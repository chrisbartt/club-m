'use server'

import { db } from '@/lib/db'
import { requireAdmin, requireMember } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import { createNotification } from '@/domains/notifications/actions'
import {
  createTontineSchema,
  updateTontineSchema,
  tontineIdSchema,
  recordPaymentSchema,
  sendReminderSchema,
} from './validators'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

export async function createTontine(
  input: unknown,
): Promise<ActionResult<{ tontineId: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = createTontineSchema.safeParse(input)
    if (!parsed.success) {
      const details: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0])
        if (!details[key]) details[key] = []
        details[key].push(issue.message)
      }
      return { success: false, error: 'INVALID_INPUT', details }
    }

    const data = parsed.data

    // Check unique code if provided
    if (data.code) {
      const existing = await db.tontine.findUnique({ where: { code: data.code } })
      if (existing) {
        return { success: false, error: 'Ce code est deja utilise.', details: { code: ['Code deja utilise'] } }
      }
    }

    const tontine = await db.tontine.create({
      data: {
        name: data.name,
        code: data.code || null,
        monthlyAmount: data.monthlyAmount,
        currency: data.currency,
        durationMonths: data.durationMonths,
        startDate: new Date(data.startDate),
        totalSpots: data.totalSpots,
        description: data.description || null,
        isPremium: data.isPremium,
        notifyMembers: data.notifyMembers,
        allowPreRegistration: data.allowPreRegistration,
        createdById: user.id,
      },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TONTINE_CREATED',
      entity: 'Tontine',
      entityId: tontine.id,
      details: { name: data.name },
    })

    return { success: true, data: { tontineId: tontine.id } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }
  }
}

export async function updateTontine(
  input: unknown,
): Promise<ActionResult<{ tontineId: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = updateTontineSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const { id, startDate, ...data } = parsed.data

    const existing = await db.tontine.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    await db.tontine.update({
      where: { id },
      data: {
        ...data,
        ...(startDate ? { startDate: new Date(startDate) } : {}),
      },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TONTINE_UPDATED',
      entity: 'Tontine',
      entityId: id,
    })

    return { success: true, data: { tontineId: id } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }
  }
}

export async function publishTontine(
  input: unknown,
): Promise<ActionResult<{ tontineId: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = tontineIdSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const tontine = await db.tontine.findUnique({ where: { id: parsed.data.tontineId } })
    if (!tontine) return { success: false, error: 'RESOURCE_NOT_FOUND' }
    if (tontine.status !== 'DRAFT') return { success: false, error: 'Seules les tontines en brouillon peuvent etre publiees.' }

    await db.tontine.update({
      where: { id: tontine.id },
      data: { status: 'OPEN' },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TONTINE_PUBLISHED',
      entity: 'Tontine',
      entityId: tontine.id,
    })

    return { success: true, data: { tontineId: tontine.id } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }
  }
}

export async function joinTontine(
  input: unknown,
): Promise<ActionResult<{ membershipId: string }>> {
  try {
    const { user, member } = await requireMember()

    const parsed = tontineIdSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const tontine = await db.tontine.findUnique({
      where: { id: parsed.data.tontineId },
      include: { _count: { select: { members: true } } },
    })
    if (!tontine) return { success: false, error: 'RESOURCE_NOT_FOUND' }
    if (tontine.status !== 'OPEN') return { success: false, error: 'Cette tontine n\'accepte plus de nouveaux membres.' }
    if (tontine._count.members >= tontine.totalSpots) return { success: false, error: 'Cette tontine est complete.' }
    if (tontine.isPremium && member.tier === 'FREE') return { success: false, error: 'Cette tontine est reservee aux membres Premium et Business.' }

    // Check not already a member
    const existing = await db.tontineMember.findUnique({
      where: { tontineId_memberId: { tontineId: tontine.id, memberId: member.id } },
    })
    if (existing) return { success: false, error: 'Vous etes deja membre de cette tontine.' }

    const membership = await db.tontineMember.create({
      data: {
        tontineId: tontine.id,
        memberId: member.id,
        role: 'MEMBER',
      },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TONTINE_JOINED',
      entity: 'TontineMember',
      entityId: membership.id,
      details: { tontineId: tontine.id, tontineName: tontine.name },
    })

    return { success: true, data: { membershipId: membership.id } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }
  }
}

export async function leaveTontine(
  input: unknown,
): Promise<ActionResult<{ tontineId: string }>> {
  try {
    const { user, member } = await requireMember()

    const parsed = tontineIdSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const membership = await db.tontineMember.findUnique({
      where: { tontineId_memberId: { tontineId: parsed.data.tontineId, memberId: member.id } },
    })
    if (!membership) return { success: false, error: 'Vous n\'etes pas membre de cette tontine.' }

    await db.tontineMember.update({
      where: { id: membership.id },
      data: { status: 'LEFT' },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TONTINE_LEFT',
      entity: 'TontineMember',
      entityId: membership.id,
    })

    return { success: true, data: { tontineId: parsed.data.tontineId } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }
  }
}

export async function recordPayment(
  input: unknown,
): Promise<ActionResult<{ paymentId: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = recordPaymentSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const membership = await db.tontineMember.findUnique({
      where: { id: parsed.data.tontineMemberId },
      include: { member: true, tontine: true },
    })
    if (!membership) return { success: false, error: 'Membre introuvable.' }

    const payment = await db.tontinePayment.create({
      data: {
        tontineMemberId: membership.id,
        amount: parsed.data.amount,
        currency: membership.tontine.currency,
        dueDate: new Date(parsed.data.dueDate),
        paidAt: new Date(),
        status: 'SUCCESS',
      },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TONTINE_PAYMENT_RECORDED',
      entity: 'TontinePayment',
      entityId: payment.id,
      details: {
        tontineId: membership.tontineId,
        memberId: membership.memberId,
        amount: parsed.data.amount.toString(),
      },
    })

    return { success: true, data: { paymentId: payment.id } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }
  }
}

export async function sendReminder(
  input: unknown,
): Promise<ActionResult<{ notified: number }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = sendReminderSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }

    const { tontineId, memberIds, tone, message } = parsed.data

    const tontine = await db.tontine.findUnique({ where: { id: tontineId } })
    if (!tontine) return { success: false, error: 'RESOURCE_NOT_FOUND' }

    const toneMessages: Record<string, string> = {
      rappel_amical: `Petit rappel : votre paiement pour la tontine "${tontine.name}" est en attente.`,
      formel: `Nous vous rappelons que votre paiement pour la tontine "${tontine.name}" est en retard. Merci de regulariser.`,
      ferme: `URGENT : Votre paiement pour la tontine "${tontine.name}" est en retard. Veuillez regulariser immediatement.`,
    }

    const notificationMessage = message || toneMessages[tone] || toneMessages.rappel_amical

    // Get member user IDs
    const memberships = await db.tontineMember.findMany({
      where: { id: { in: memberIds } },
      include: { member: { include: { user: true } } },
    })

    for (const m of memberships) {
      await createNotification({
        userId: m.member.user.id,
        type: 'ORDER_CREATED', // Reuse existing type — tontine-specific type not in enum
        title: `Rappel tontine : ${tontine.name}`,
        message: notificationMessage,
        link: '/epargne-tontines',
      })
    }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TONTINE_REMINDER_SENT',
      entity: 'Tontine',
      entityId: tontineId,
      details: { membersNotified: memberships.length.toString(), tone },
    })

    return { success: true, data: { notified: memberships.length } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }
  }
}
