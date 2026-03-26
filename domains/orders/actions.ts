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
} from './validators'
import {
  sendOrderConfirmationBuyer,
  sendOrderNotificationSeller,
  sendOrderShippedEmail,
  sendDeliveryConfirmedBuyer,
  sendDeliveryConfirmedSeller,
} from '@/lib/email'
import { formatOrderNumber } from '@/lib/server-utils'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function purchaseProduct(
  input: unknown,
): Promise<ActionResult<{ orderId: string; confirmationCode: string }>> {
  try {
    const user = await requireAuth()
    await requireVerifiedEmail()

    const parsed = createOrderSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const { productId, quantity } = parsed.data

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
    if (product.type === 'PHYSICAL' && product.stock !== null && product.stock < quantity) {
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

    // Calculate amounts
    const totalAmount = quantity * Number(product.price)
    const commission = totalAmount * COMMISSION_RATE

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode(CONFIRMATION_CODE_LENGTH)
    const codeExpiresAt = new Date(
      Date.now() + CONFIRMATION_CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    // Create order, order item, payment in transaction
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
          status: 'PAID', // MVP: simulated payment
          items: {
            create: {
              productId: product.id,
              quantity,
              unitPrice: product.price,
            },
          },
        },
      })

      await tx.payment.create({
        data: {
          amount: totalAmount,
          currency: product.currency,
          status: 'SUCCESS',
          provider: 'LOCAL_FINTECH',
          orderId: newOrder.id,
        },
      })

      // Decrement stock for physical products
      if (product.type === 'PHYSICAL' && product.stock !== null) {
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: quantity } },
        })
      }

      return newOrder
    })

    // Audit log
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: order.id,
    })

    // Send emails + notifications
    const buyerName = user.member?.firstName ?? user.customer?.firstName ?? 'Client'
    const sellerProfile = await db.businessProfile.findUnique({
      where: { id: business.id },
      include: { member: { include: { user: true } } },
    })
    if (sellerProfile) {
      try {
        await sendOrderConfirmationBuyer(user.email, buyerName, {
          number: formatOrderNumber(order.id),
          items: [{ name: product.name, quantity, unitPrice: Number(product.price) }],
          total: totalAmount,
          currency: product.currency,
          confirmationCode,
          businessName: business.businessName,
        })
        await sendOrderNotificationSeller(sellerProfile.member.user.email, business.businessName, {
          number: formatOrderNumber(order.id),
          buyerName,
          items: [{ name: product.name, quantity, unitPrice: Number(product.price) }],
          total: totalAmount,
          currency: product.currency,
        })
      } catch (e) {
        console.error('Order emails failed:', e)
      }

      await createNotification({
        userId: user.id,
        type: 'ORDER_CREATED',
        title: 'Commande confirmee',
        message: `Commande ${formatOrderNumber(order.id)} chez ${business.businessName} confirmee.`,
        link: '/achats/' + order.id,
      })
      await createNotification({
        userId: sellerProfile.member.user.id,
        type: 'ORDER_RECEIVED',
        title: 'Nouvelle commande',
        message: `Nouvelle commande ${formatOrderNumber(order.id)} de ${buyerName}.`,
        link: '/mon-business/commandes/' + order.id,
      })
    }

    return {
      success: true,
      data: { orderId: order.id, confirmationCode },
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
): Promise<ActionResult<{ orderId: string; confirmationCode: string }>> {
  try {
    const user = await requireAuth()
    await requireVerifiedEmail()

    const parsed = createCartOrderSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const { items, businessId, deliveryAddress } = parsed.data

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

    if (products.length !== items.length) {
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

    // Validate stock for each item
    for (const item of items) {
      const product = productMap.get(item.productId)!
      if (
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

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!
      return sum + item.quantity * Number(product.price)
    }, 0)
    const commission = totalAmount * COMMISSION_RATE

    // Use the currency from the first product (all from the same store)
    const currency = products[0].currency

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode(CONFIRMATION_CODE_LENGTH)
    const codeExpiresAt = new Date(
      Date.now() + CONFIRMATION_CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    // Create order with all items in a transaction
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          memberId,
          customerId,
          businessId: business.id,
          totalAmount,
          currency,
          commission,
          confirmationCode,
          codeExpiresAt,
          deliveryPhone: deliveryAddress?.phone || null,
          deliveryCommune: deliveryAddress?.commune || null,
          deliveryQuartier: deliveryAddress?.quartier || null,
          deliveryAvenue: deliveryAddress?.avenue || null,
          deliveryRepere: deliveryAddress?.repere || null,
          status: 'PAID', // MVP: simulated payment
          items: {
            create: items.map((item) => {
              const product = productMap.get(item.productId)!
              return {
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
              }
            }),
          },
        },
      })

      await tx.payment.create({
        data: {
          amount: totalAmount,
          currency,
          status: 'SUCCESS',
          provider: 'LOCAL_FINTECH',
          orderId: newOrder.id,
        },
      })

      // Decrement stock for physical products
      for (const item of items) {
        const product = productMap.get(item.productId)!
        if (product.type === 'PHYSICAL' && product.stock !== null) {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }

      return newOrder
    })

    // Audit log
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: order.id,
    })

    // Send order emails (non-blocking)
    const buyerName = user.member?.firstName ?? user.customer?.firstName ?? 'Client'
    const sellerProfile = await db.businessProfile.findUnique({
      where: { id: business.id },
      include: { member: { include: { user: true } } },
    })
    if (sellerProfile) {
      try {
        await sendOrderConfirmationBuyer(user.email, buyerName, {
          number: formatOrderNumber(order.id),
          items: items.map((item) => {
            const product = productMap.get(item.productId)!
            return { name: product.name, quantity: item.quantity, unitPrice: Number(product.price) }
          }),
          total: totalAmount,
          currency,
          confirmationCode,
          businessName: business.businessName,
        })
        await sendOrderNotificationSeller(sellerProfile.member.user.email, business.businessName, {
          number: formatOrderNumber(order.id),
          buyerName,
          items: items.map((item) => {
            const product = productMap.get(item.productId)!
            return { name: product.name, quantity: item.quantity, unitPrice: Number(product.price) }
          }),
          total: totalAmount,
          currency,
        })
      } catch (e) {
        console.error('Order emails failed:', e)
      }

      // Notifications
      await createNotification({
        userId: user.id,
        type: 'ORDER_CREATED',
        title: 'Commande confirmee',
        message: `Commande ${formatOrderNumber(order.id)} chez ${business.businessName} confirmee.`,
        link: '/achats/' + order.id,
      })
      await createNotification({
        userId: sellerProfile.member.user.id,
        type: 'ORDER_RECEIVED',
        title: 'Nouvelle commande',
        message: `Nouvelle commande ${formatOrderNumber(order.id)} de ${buyerName}.`,
        link: '/mon-business/commandes/' + order.id,
      })
    }

    return {
      success: true,
      data: { orderId: order.id, confirmationCode },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function markAsShipped(
  orderId: string,
): Promise<ActionResult<{ orderId: string }>> {
  try {
    const { user, member } = await requireMember('BUSINESS')

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
