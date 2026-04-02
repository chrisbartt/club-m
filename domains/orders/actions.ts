'use server'

import { db } from '@/lib/db'
import { requireAuth, requireMember, requireVerifiedEmail } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import { createNotification } from '@/domains/notifications/actions'
import {
  COMMISSION_RATE,
  CONFIRMATION_CODE_LENGTH,
  CONFIRMATION_CODE_EXPIRY_DAYS,
} from '@/lib/constants'
import { generateConfirmationCode } from '@/lib/utils'
import {
  createOrderSchema,
  createCartOrderSchema,
  confirmDeliverySchema,
  markAsShippedSchema,
} from './validators'
import {
  sendOrderShippedEmail,
  sendDeliveryConfirmedBuyer,
  sendDeliveryConfirmedSeller,
} from '@/lib/email'
import { formatOrderNumber } from '@/lib/server-utils'
import { getPaymentProvider } from '@/integrations/payment'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function purchaseProduct(
  input: unknown,
): Promise<ActionResult<{ orderId: string; transactionId: string }>> {
  try {
    const user = await requireAuth()
    await requireVerifiedEmail()

    const parsed = createOrderSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const { productId, quantity, variantId, payment: paymentInfo } = parsed.data

    // Fetch product
    const product = await db.product.findUnique({
      where: { id: productId },
    })
    if (!product) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }
    if (!product.isActive) {
      return { success: false, error: 'PRODUCT_INACTIVE' }
    }

    // If variantId provided, fetch and validate variant
    let variant: { id: string; label: string; stock: number; price: unknown; isActive: boolean; productId: string } | null = null
    if (variantId) {
      variant = await db.productVariant.findUnique({ where: { id: variantId } })
      if (!variant) {
        return { success: false, error: 'VARIANT_NOT_FOUND' }
      }
      if (variant.productId !== productId) {
        return { success: false, error: 'VARIANT_MISMATCH' }
      }
      if (!variant.isActive) {
        return { success: false, error: 'VARIANT_INACTIVE' }
      }
      if (variant.stock < quantity) {
        return { success: false, error: 'INSUFFICIENT_STOCK' }
      }
    } else if (product.type === 'PHYSICAL' && product.stock !== null && product.stock < quantity) {
      return { success: false, error: 'INSUFFICIENT_STOCK' }
    }

    // Fetch business profile
    const business = await db.businessProfile.findUnique({
      where: { id: product.businessId },
    })
    if (
      !business ||
      business.profileType !== 'STORE' ||
      !business.isApproved ||
      !business.isPublished
    ) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    // Determine buyer
    const memberId = user.member?.id ?? null
    const customerId = user.customer?.id ?? null
    if (!memberId && !customerId) {
      return { success: false, error: 'NOT_AUTHENTICATED' }
    }

    // Calculate amounts — use variant price if available
    const unitPrice = variant?.price ? Number(variant.price) : Number(product.price)
    const totalAmount = quantity * unitPrice
    const commission = totalAmount * COMMISSION_RATE

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode(CONFIRMATION_CODE_LENGTH)
    const codeExpiresAt = new Date(
      Date.now() + CONFIRMATION_CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    // Create order as PENDING, initiate ARAKA payment
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          memberId,
          customerId,
          businessId: business.id,
          totalAmount,
          currency: product.currency,
          commission,
          confirmationCode,
          codeExpiresAt,
          status: 'PENDING',
          items: {
            create: {
              productId: product.id,
              quantity,
              unitPrice: unitPrice,
              ...(variant ? { variantId: variant.id, variantLabel: variant.label } : {}),
            },
          },
        },
      })

      // Decrement stock — variant stock if variant, else product stock
      if (variant) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: quantity } },
        })
      } else if (product.type === 'PHYSICAL' && product.stock !== null) {
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: quantity } },
        })
      }

      return newOrder
    })

    // Initiate ARAKA payment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const buyerName = user.member?.firstName ?? user.customer?.firstName ?? 'Client'

    const paymentProvider = getPaymentProvider()
    const paymentResult = await paymentProvider.createPayment({
      amount: totalAmount,
      currency: product.currency as 'USD' | 'CDF' | 'EUR',
      description: `Commande ${formatOrderNumber(order.id)}`,
      returnUrl: `${baseUrl}/api/payments/callback`,
      cancelUrl: `${baseUrl}/checkout?error=payment_cancelled`,
      metadata: {
        orderId: order.id,
        customerName: buyerName,
        customerEmail: user.email,
        provider: paymentInfo.provider,
        walletId: paymentInfo.walletId,
      },
    })

    // Create payment record with ARAKA transactionId
    await db.payment.create({
      data: {
        amount: totalAmount,
        currency: product.currency,
        status: 'PENDING',
        provider: 'MOBILE_MONEY',
        providerRef: paymentResult.providerRef,
        orderId: order.id,
      },
    })

    // Timeline entry
    try {
      await db.orderStatusHistory.create({
        data: { orderId: order.id, status: 'PENDING', note: 'Paiement initie via ' + paymentInfo.provider },
      })
    } catch (e) { console.error('Timeline entry failed:', e) }

    // Audit log
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: order.id,
    })

    // Emails + notifications sent in /api/payments/callback on payment confirmation

    return {
      success: true,
      data: { orderId: order.id, transactionId: paymentResult.providerRef },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function createCartOrder(
  input: unknown,
): Promise<ActionResult<{ orderId: string; transactionId: string }>> {
  try {
    const user = await requireAuth()
    await requireVerifiedEmail()

    const parsed = createCartOrderSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const { items, businessId, deliveryAddress, couponCode, payment: paymentInfo } = parsed.data

    // Verify business is a valid, approved store
    const business = await db.businessProfile.findUnique({
      where: { id: businessId },
    })
    if (
      !business ||
      business.profileType !== 'STORE' ||
      !business.isApproved ||
      !business.isPublished
    ) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    // Fetch and validate all products
    const productIds = items.map((i) => i.productId)
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== new Set(productIds).size) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    // Validate all products belong to the same business
    for (const product of products) {
      if (product.businessId !== businessId) {
        return { success: false, error: 'PRODUCTS_MIXED_BUSINESSES' }
      }
      if (!product.isActive) {
        return { success: false, error: 'PRODUCT_INACTIVE' }
      }
    }

    // Build a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]))

    // Fetch variants for items that have variantId
    const variantIds = items.map((i) => i.variantId).filter(Boolean) as string[]
    const variants = variantIds.length > 0
      ? await db.productVariant.findMany({ where: { id: { in: variantIds } } })
      : []
    const variantMap = new Map(variants.map((v) => [v.id, v]))

    // Validate stock for each item (variant-aware)
    for (const item of items) {
      const product = productMap.get(item.productId)!
      if (item.variantId) {
        const variant = variantMap.get(item.variantId)
        if (!variant) {
          return { success: false, error: 'VARIANT_NOT_FOUND' }
        }
        if (variant.productId !== item.productId) {
          return { success: false, error: 'VARIANT_MISMATCH' }
        }
        if (!variant.isActive) {
          return { success: false, error: 'VARIANT_INACTIVE' }
        }
        if (variant.stock < item.quantity) {
          return { success: false, error: 'INSUFFICIENT_STOCK' }
        }
      } else if (
        product.type === 'PHYSICAL' &&
        product.stock !== null &&
        product.stock < item.quantity
      ) {
        return { success: false, error: 'INSUFFICIENT_STOCK' }
      }
    }

    // Determine buyer
    const memberId = user.member?.id ?? null
    const customerId = user.customer?.id ?? null
    if (!memberId && !customerId) {
      return { success: false, error: 'NOT_AUTHENTICATED' }
    }

    // Calculate total amount (variant price takes precedence)
    const totalAmount = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!
      const variant = item.variantId ? variantMap.get(item.variantId) : null
      const price = variant?.price ? Number(variant.price) : Number(product.price)
      return sum + item.quantity * price
    }, 0)

    // Use the currency from the first product (all from the same store)
    const currency = products[0].currency

    // Handle coupon discount
    let couponDiscount = 0
    let couponId: string | null = null
    if (couponCode) {
      const { validateCoupon } = await import('@/domains/coupons/queries')
      const couponResult = await validateCoupon(couponCode, businessId, totalAmount, currency)
      if (!couponResult.valid) {
        return { success: false, error: couponResult.error }
      }
      couponDiscount = couponResult.discount
      couponId = couponResult.coupon.id
    }

    const finalAmount = totalAmount - couponDiscount
    const commission = finalAmount * COMMISSION_RATE

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode(CONFIRMATION_CODE_LENGTH)
    const codeExpiresAt = new Date(
      Date.now() + CONFIRMATION_CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    // Create order as PENDING, initiate ARAKA payment
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          memberId,
          customerId,
          businessId: business.id,
          totalAmount: finalAmount,
          currency,
          commission,
          discount: couponDiscount,
          ...(couponId ? { couponId } : {}),
          confirmationCode,
          codeExpiresAt,
          deliveryPhone: deliveryAddress?.phone || null,
          deliveryCommune: deliveryAddress?.commune || null,
          deliveryQuartier: deliveryAddress?.quartier || null,
          deliveryAvenue: deliveryAddress?.avenue || null,
          deliveryRepere: deliveryAddress?.repere || null,
          status: 'PENDING',
          items: {
            create: items.map((item) => {
              const product = productMap.get(item.productId)!
              const variant = item.variantId ? variantMap.get(item.variantId) : null
              const price = variant?.price ? Number(variant.price) : Number(product.price)
              return {
                productId: product.id,
                quantity: item.quantity,
                unitPrice: price,
                ...(variant ? { variantId: variant.id, variantLabel: item.variantLabel ?? variant.label } : {}),
              }
            }),
          },
        },
      })

      // Increment coupon usage count
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        })
      }

      // Decrement stock
      for (const item of items) {
        const product = productMap.get(item.productId)!
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        } else if (product.type === 'PHYSICAL' && product.stock !== null) {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }

      return newOrder
    })

    // Initiate ARAKA payment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const buyerName = user.member?.firstName ?? user.customer?.firstName ?? 'Client'

    const paymentProvider = getPaymentProvider()
    const paymentResult = await paymentProvider.createPayment({
      amount: finalAmount,
      currency: currency as 'USD' | 'CDF' | 'EUR',
      description: `Commande ${formatOrderNumber(order.id)}`,
      returnUrl: `${baseUrl}/api/payments/callback`,
      cancelUrl: `${baseUrl}/checkout?error=payment_cancelled`,
      metadata: {
        orderId: order.id,
        customerName: buyerName,
        customerEmail: user.email,
        provider: paymentInfo.provider,
        walletId: paymentInfo.walletId,
      },
    })

    // Create payment record
    await db.payment.create({
      data: {
        amount: finalAmount,
        currency,
        status: 'PENDING',
        provider: 'MOBILE_MONEY',
        providerRef: paymentResult.providerRef,
        orderId: order.id,
      },
    })

    // Timeline entry
    try {
      await db.orderStatusHistory.create({
        data: { orderId: order.id, status: 'PENDING', note: 'Paiement initie via ' + paymentInfo.provider },
      })
    } catch (e) { console.error('Timeline entry failed:', e) }

    // Audit log
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: order.id,
    })

    // Emails + notifications sent in /api/payments/callback on payment confirmation

    return {
      success: true,
      data: { orderId: order.id, transactionId: paymentResult.providerRef },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function markAsShipped(
  input: unknown,
): Promise<ActionResult<{ orderId: string }>> {
  try {
    const { user, member } = await requireMember('BUSINESS')

    const parsed = markAsShippedSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }
    const { orderId } = parsed.data

    const profile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })
    if (!profile) {
      return { success: false, error: 'NO_STORE_PROFILE' }
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
    })
    if (!order) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }
    if (order.businessId !== profile.id) {
      return { success: false, error: 'NOT_OWNER' }
    }
    if (order.status !== 'PAID') {
      return { success: false, error: 'ORDER_ALREADY_CONFIRMED' }
    }

    await db.order.update({
      where: { id: orderId },
      data: { status: 'SHIPPED', shippedAt: new Date() },
    })

    // Timeline entry
    try {
      await db.orderStatusHistory.create({
        data: { orderId, status: 'SHIPPED' },
      })
    } catch (e) { console.error('Timeline entry failed:', e) }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'ORDER_SHIPPED',
      entity: 'Order',
      entityId: orderId,
    })

    // Send shipped notification to buyer
    const fullOrder = await db.order.findUnique({
      where: { id: orderId },
      include: {
        member: { include: { user: true } },
        customer: { include: { user: true } },
        business: true,
      },
    })
    if (fullOrder) {
      const buyerUser = fullOrder.member?.user ?? fullOrder.customer?.user
      if (buyerUser) {
        const buyerName = fullOrder.member?.firstName ?? fullOrder.customer?.firstName ?? 'Client'
        try {
          await sendOrderShippedEmail(buyerUser.email, buyerName, {
            number: formatOrderNumber(orderId),
            businessName: fullOrder.business.businessName,
            confirmationCode: fullOrder.confirmationCode,
          })
        } catch (e) {
          console.error('Shipped email failed:', e)
        }

        // Notification
        await createNotification({
          userId: buyerUser.id,
          type: 'ORDER_SHIPPED',
          title: 'Commande expediee',
          message: `Votre commande ${formatOrderNumber(orderId)} a ete expediee.`,
          link: '/achats/' + orderId,
        })
      }
    }

    return { success: true, data: { orderId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function confirmDelivery(
  input: unknown,
): Promise<ActionResult<{ orderId: string }>> {
  try {
    const { user, member } = await requireMember('BUSINESS')

    const parsed = confirmDeliverySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const { orderId, confirmationCode } = parsed.data

    const profile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })
    if (!profile) {
      return { success: false, error: 'NO_STORE_PROFILE' }
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
    })
    if (!order) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }
    if (order.businessId !== profile.id) {
      return { success: false, error: 'NOT_OWNER' }
    }
    if (order.status !== 'SHIPPED') {
      return { success: false, error: 'ORDER_ALREADY_CONFIRMED' }
    }

    // Verify confirmation code (case-insensitive)
    if (order.confirmationCode.toUpperCase() !== confirmationCode.toUpperCase()) {
      return { success: false, error: 'CONFIRMATION_CODE_INVALID' }
    }

    // Verify not expired
    if (order.codeExpiresAt < new Date()) {
      return { success: false, error: 'CONFIRMATION_CODE_EXPIRED' }
    }

    // Mark as DELIVERED
    await db.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
        codeUsed: true,
      },
    })

    // Timeline entry
    try {
      await db.orderStatusHistory.create({
        data: { orderId, status: 'DELIVERED' },
      })
    } catch (e) { console.error('Timeline entry failed:', e) }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'order.confirm_delivery',
      entity: 'Order',
      entityId: orderId,
    })

    // Send delivery confirmation emails
    const fullOrder = await db.order.findUnique({
      where: { id: orderId },
      include: {
        member: { include: { user: true } },
        customer: { include: { user: true } },
        business: { include: { member: { include: { user: true } } } },
      },
    })
    if (fullOrder) {
      const buyerUser = fullOrder.member?.user ?? fullOrder.customer?.user
      const buyerName = fullOrder.member?.firstName ?? fullOrder.customer?.firstName ?? 'Client'
      const sellerEmail = fullOrder.business.member.user.email

      try {
        if (buyerUser) {
          await sendDeliveryConfirmedBuyer(buyerUser.email, buyerName, {
            number: formatOrderNumber(orderId),
            businessName: fullOrder.business.businessName,
          })
        }
        await sendDeliveryConfirmedSeller(sellerEmail, fullOrder.business.businessName, {
          number: formatOrderNumber(orderId),
          buyerName,
        })
      } catch (e) {
        console.error('Delivery confirmation emails failed:', e)
      }

      // Notifications
      if (buyerUser) {
        await createNotification({
          userId: buyerUser.id,
          type: 'ORDER_DELIVERED',
          title: 'Commande livree',
          message: `Votre commande ${formatOrderNumber(orderId)} a ete livree.`,
          link: '/achats/' + orderId,
        })
      }
      await createNotification({
        userId: fullOrder.business.member.user.id,
        type: 'ORDER_DELIVERED',
        title: 'Livraison confirmee',
        message: `La commande ${formatOrderNumber(orderId)} a ete livree.`,
        link: '/mon-business/commandes/' + orderId,
      })
    }

    return { success: true, data: { orderId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
