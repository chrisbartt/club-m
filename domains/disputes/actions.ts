'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, requireMember, requireAdmin } from '@/lib/auth-guards'
import { createNotification } from '@/domains/notifications/actions'
import {
  openDisputeSchema,
  respondDisputeSchema,
  resolveDisputeSchema,
} from './validators'

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

export async function openDispute(
  input: unknown
): Promise<ActionResult<{ disputeId: string }>> {
  try {
    const user = await requireAuth()

    const parsed = openDisputeSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { orderId, reason, description } = parsed.data

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        business: { include: { member: { include: { user: true } } } },
      },
    })

    if (!order || order.memberId !== user.member?.id) {
      return { success: false, error: 'ORDER_NOT_FOUND' }
    }

    if (order.status !== 'SHIPPED' && order.status !== 'DELIVERED') {
      return { success: false, error: 'ORDER_STATUS_INVALID' }
    }

    const existingDispute = await db.dispute.findUnique({
      where: { orderId },
    })
    if (existingDispute) {
      return { success: false, error: 'DISPUTE_ALREADY_EXISTS' }
    }

    const daysSinceOrder =
      (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceOrder > 14) {
      return { success: false, error: 'DISPUTE_DEADLINE_PASSED' }
    }

    const dispute = await db.dispute.create({
      data: {
        orderId,
        memberId: user.member!.id,
        reason,
        description,
        status: 'OPEN',
      },
    })

    // Notify seller
    await createNotification({
      userId: order.business.member.user.id,
      type: 'DISPUTE_OPENED',
      title: 'Litige ouvert',
      message: `Litige sur la commande ${order.id.slice(-6).toUpperCase()} — ${reason}`,
      link: `/mon-business/commandes/${orderId}`,
    })

    return { success: true, data: { disputeId: dispute.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function respondToDispute(
  input: unknown
): Promise<ActionResult<{ disputeId: string }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const parsed = respondDisputeSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { disputeId, response } = parsed.data

    const dispute = await db.dispute.findUnique({
      where: { id: disputeId },
      include: {
        order: true,
        member: { include: { user: true } },
      },
    })

    if (!dispute) {
      return { success: false, error: 'DISPUTE_NOT_FOUND' }
    }

    const sellerProfile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })

    if (!sellerProfile || dispute.order.businessId !== sellerProfile.id) {
      return { success: false, error: 'NOT_AUTHORIZED' }
    }

    if (dispute.status !== 'OPEN') {
      return { success: false, error: 'DISPUTE_NOT_OPEN' }
    }

    await db.dispute.update({
      where: { id: disputeId },
      data: {
        sellerResponse: response,
        status: 'SELLER_RESPONDED',
      },
    })

    // Notify buyer
    await createNotification({
      userId: dispute.member.user.id,
      type: 'DISPUTE_SELLER_RESPONDED',
      title: 'Reponse de la vendeuse',
      message: `La vendeuse a repondu a votre litige sur la commande ${dispute.order.id.slice(-6).toUpperCase()}.`,
      link: `/achats/${dispute.order.id}`,
    })

    return { success: true, data: { disputeId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function resolveDispute(
  input: unknown
): Promise<ActionResult<{ disputeId: string }>> {
  try {
    await requireAdmin()

    const parsed = resolveDisputeSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { disputeId, decision, adminNote } = parsed.data

    const dispute = await db.dispute.findUnique({
      where: { id: disputeId },
      include: {
        order: {
          include: {
            business: { include: { member: { include: { user: true } } } },
          },
        },
        member: { include: { user: true } },
      },
    })

    if (!dispute) {
      return { success: false, error: 'DISPUTE_NOT_FOUND' }
    }

    const resolutionText =
      decision === 'RESOLVED_BUYER'
        ? 'Resolu en faveur de l\'acheteuse'
        : decision === 'RESOLVED_SELLER'
          ? 'Resolu en faveur de la vendeuse'
          : 'Litige clos'

    await db.dispute.update({
      where: { id: disputeId },
      data: {
        status: decision,
        adminNote: adminNote || null,
        resolution: resolutionText,
      },
    })

    // Notify buyer
    await createNotification({
      userId: dispute.member.user.id,
      type: 'DISPUTE_RESOLVED',
      title: 'Litige resolu',
      message: `${resolutionText} pour la commande ${dispute.order.id.slice(-6).toUpperCase()}.`,
      link: `/achats/${dispute.order.id}`,
    })

    // Notify seller
    await createNotification({
      userId: dispute.order.business.member.user.id,
      type: 'DISPUTE_RESOLVED',
      title: 'Litige resolu',
      message: `${resolutionText} pour la commande ${dispute.order.id.slice(-6).toUpperCase()}.`,
      link: `/mon-business/commandes/${dispute.order.id}`,
    })

    return { success: true, data: { disputeId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
