'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import type { MemberTier } from '@/lib/generated/prisma/client'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function suspendMember(
  memberId: string
): Promise<ActionResult<{ memberId: string }>> {
  try {
    const { user: adminUser } = await requireAdmin()

    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { user: true },
    })

    if (!member) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    if (member.status === 'SUSPENDED') {
      return { success: false, error: 'ALREADY_SUSPENDED' }
    }

    await db.$transaction([
      db.member.update({
        where: { id: memberId },
        data: { status: 'SUSPENDED' },
      }),
      db.user.update({
        where: { id: member.userId },
        data: { status: 'SUSPENDED' },
      }),
    ])

    await createAuditLog({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'MEMBER_SUSPENDED',
      entity: 'Member',
      entityId: memberId,
    })

    return { success: true, data: { memberId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function reactivateMember(
  memberId: string
): Promise<ActionResult<{ memberId: string }>> {
  try {
    const { user: adminUser } = await requireAdmin()

    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { user: true },
    })

    if (!member) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    if (member.status === 'ACTIVE') {
      return { success: false, error: 'ALREADY_ACTIVE' }
    }

    await db.$transaction([
      db.member.update({
        where: { id: memberId },
        data: { status: 'ACTIVE' },
      }),
      db.user.update({
        where: { id: member.userId },
        data: { status: 'ACTIVE' },
      }),
    ])

    await createAuditLog({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'MEMBER_REACTIVATED',
      entity: 'Member',
      entityId: memberId,
    })

    return { success: true, data: { memberId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function changeMemberTier(
  memberId: string,
  newTier: MemberTier
): Promise<ActionResult<{ memberId: string; newTier: MemberTier }>> {
  try {
    const { user: adminUser } = await requireAdmin('SUPER_ADMIN')

    const member = await db.member.findUnique({
      where: { id: memberId },
    })

    if (!member) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    if (member.tier === newTier) {
      return { success: false, error: 'ALREADY_AT_TIER' }
    }

    const previousTier = member.tier

    await db.member.update({
      where: { id: memberId },
      data: { tier: newTier },
    })

    await createAuditLog({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'MEMBER_TIER_CHANGED',
      entity: 'Member',
      entityId: memberId,
      details: { previousTier, newTier },
    })

    return { success: true, data: { memberId, newTier } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
