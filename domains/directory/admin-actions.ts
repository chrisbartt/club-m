'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function approveProfile(
  profileId: string,
): Promise<ActionResult<{ profileId: string }>> {
  try {
    const { user } = await requireAdmin()

    const profile = await db.businessProfile.findUnique({
      where: { id: profileId },
    })
    if (!profile) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    await db.businessProfile.update({
      where: { id: profileId },
      data: { isApproved: true },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'PROFILE_APPROVED',
      entity: 'BusinessProfile',
      entityId: profileId,
      details: { businessName: profile.businessName },
    })

    return { success: true, data: { profileId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function rejectProfile(
  profileId: string,
): Promise<ActionResult<{ profileId: string }>> {
  try {
    const { user } = await requireAdmin()

    const profile = await db.businessProfile.findUnique({
      where: { id: profileId },
    })
    if (!profile) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    await db.businessProfile.update({
      where: { id: profileId },
      data: { isApproved: false, isPublished: false },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'PROFILE_REJECTED',
      entity: 'BusinessProfile',
      entityId: profileId,
      details: { businessName: profile.businessName },
    })

    return { success: true, data: { profileId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
