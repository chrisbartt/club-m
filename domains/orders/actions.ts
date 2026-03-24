'use server'

import { db } from '@/lib/db'
import { requireAuth, requireMember } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import {
  COMMISSION_RATE,
  CONFIRMATION_CODE_LENGTH,
  CONFIRMATION_CODE_EXPIRY_DAYS,
} from '@/lib/constants'
import { generateConfirmationCode } from '@/lib/utils'
import { createOrderSchema, confirmDeliverySchema } from './validators'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function purchaseProduct(
  input: unknown,
): Promise<ActionResult<{ orderId: string; confirmationCode: string }>> {
  try {
    const user = await requireAuth()

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
    const { member } = await requireMember('BUSINESS')

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
      data: { status: 'SHIPPED' },
    })

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

    // MVP: go straight to COMPLETED
    await db.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
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

    return { success: true, data: { orderId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
