'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, requireMember, requireAdmin } from '@/lib/auth-guards'
import { createNotification } from '@/domains/notifications/actions'
import { createReviewSchema, flagReviewSchema } from './validators'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

function flattenFieldErrors(
  error: z.ZodError
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0])
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(issue.message)
  }
  return result
}

export async function createReview(
  input: unknown
): Promise<ActionResult<{ reviewId: string }>> {
  try {
    const user = await requireAuth()

    const parsed = createReviewSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { orderId, rating, comment } = parsed.data

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        business: { include: { member: { include: { user: true } } } },
        review: true,
      },
    })

    if (!order || order.memberId !== user.member?.id) {
      return { success: false, error: 'ORDER_NOT_FOUND' }
    }

    if (order.status !== 'DELIVERED') {
      return { success: false, error: 'ORDER_NOT_DELIVERED' }
    }

    if (order.review) {
      return { success: false, error: 'REVIEW_ALREADY_EXISTS' }
    }

    const productId = order.items[0].productId
    const productName = order.items[0].product.name

    const review = await db.review.create({
      data: {
        orderId,
        memberId: user.member!.id,
        productId,
        rating,
        comment: comment || null,
      },
    })

    // Notify seller
    await createNotification({
      userId: order.business.member.user.id,
      type: 'REVIEW_RECEIVED',
      title: 'Nouvel avis',
      message: `${rating} etoiles sur ${productName}`,
      link: `/mon-business/commandes/${orderId}`,
    })

    return { success: true, data: { reviewId: review.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function flagReview(
  input: unknown
): Promise<ActionResult<{ reviewId: string }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const parsed = flagReviewSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { reviewId, reason } = parsed.data

    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: { product: true },
    })

    if (!review) {
      return { success: false, error: 'REVIEW_NOT_FOUND' }
    }

    const sellerProfile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })

    if (!sellerProfile || review.product.businessId !== sellerProfile.id) {
      return { success: false, error: 'NOT_AUTHORIZED' }
    }

    await db.review.update({
      where: { id: reviewId },
      data: { flagged: true, flagReason: reason },
    })

    return { success: true, data: { reviewId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

const moderateReviewSchema = z.object({
  reviewId: z.string().min(1, 'ID avis requis'),
  decision: z.enum(['MAINTAIN', 'HIDE']),
})

export async function moderateReview(
  reviewId: string,
  decision: 'MAINTAIN' | 'HIDE'
): Promise<ActionResult<{ reviewId: string }>> {
  try {
    await requireAdmin()

    const parsed = moderateReviewSchema.safeParse({ reviewId, decision })
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT', details: flattenFieldErrors(parsed.error) }
    }

    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: { member: { include: { user: true } } },
    })

    if (!review) {
      return { success: false, error: 'REVIEW_NOT_FOUND' }
    }

    await db.review.update({
      where: { id: reviewId },
      data: {
        flagged: false,
        visible: decision === 'MAINTAIN',
      },
    })

    if (decision === 'HIDE') {
      await createNotification({
        userId: review.member.user.id,
        type: 'REVIEW_HIDDEN',
        title: 'Avis masque',
        message: 'Votre avis a ete masque suite a un signalement.',
        link: '/achats',
      })
    }

    return { success: true, data: { reviewId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
