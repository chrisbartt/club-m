'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { hasMinTier } from '@/lib/permissions'
import { createAuditLog } from '@/domains/audit/actions'
import { createUpgradeSchema } from './validators'
import { getActiveUpgradeRequest } from './queries'
import { CANCELLABLE_STATUSES } from './types'
import type { UpgradeStatus } from '@/lib/generated/prisma/client'

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

export async function createUpgradeRequest(
  input: unknown
): Promise<ActionResult<{ upgradeId: string; nextStep: string }>> {
  try {
    const { user, member } = await requireMember()

    const parsed = createUpgradeSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { targetTier } = parsed.data

    // Validate it's actually an upgrade
    if (hasMinTier(member.tier, targetTier)) {
      return {
        success: false,
        error: 'ALREADY_AT_OR_ABOVE_TIER',
      }
    }

    // Check no active upgrade in progress
    const existing = await getActiveUpgradeRequest(member.id)
    if (existing) {
      return {
        success: false,
        error: 'UPGRADE_IN_PROGRESS',
      }
    }

    // Determine initial status based on verification
    let initialStatus: UpgradeStatus
    let nextStep: string

    if (member.verificationStatus === 'VERIFIED') {
      initialStatus = 'READY_FOR_PAYMENT'
      nextStep = '/upgrade/payment'
    } else {
      initialStatus = 'KYC_PENDING'
      nextStep = '/kyc'
    }

    const upgrade = await db.upgradeRequest.create({
      data: {
        memberId: member.id,
        fromTier: member.tier,
        toTier: targetTier,
        status: initialStatus,
      },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'UPGRADE_REQUESTED',
      entity: 'UpgradeRequest',
      entityId: upgrade.id,
      details: {
        fromTier: member.tier,
        toTier: targetTier,
        initialStatus,
      },
    })

    return {
      success: true,
      data: { upgradeId: upgrade.id, nextStep },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function cancelUpgradeRequest(
  upgradeId: string
): Promise<ActionResult<{ upgradeId: string }>> {
  try {
    const { user, member } = await requireMember()

    const upgrade = await db.upgradeRequest.findUnique({
      where: { id: upgradeId },
    })

    if (!upgrade) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    // Verify ownership
    if (upgrade.memberId !== member.id) {
      return { success: false, error: 'NOT_OWNER' }
    }

    // Verify cancellable state
    if (!CANCELLABLE_STATUSES.includes(upgrade.status)) {
      return { success: false, error: 'UPGRADE_NOT_CANCELLABLE' }
    }

    await db.upgradeRequest.update({
      where: { id: upgradeId },
      data: { status: 'CANCELLED' },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'UPGRADE_CANCELLED',
      entity: 'UpgradeRequest',
      entityId: upgradeId,
      details: {
        previousStatus: upgrade.status,
      },
    })

    return { success: true, data: { upgradeId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
