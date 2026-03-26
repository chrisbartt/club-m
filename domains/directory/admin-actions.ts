'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import { createNotification } from '@/domains/notifications/actions'
import { sendProfileApprovedEmail, sendProfileRejectedEmail } from '@/lib/email'

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
      include: { member: { include: { user: true } } },
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

    // Email + notification
    try {
      await sendProfileApprovedEmail(profile.member.user.email, profile.member.firstName, profile.businessName)
    } catch (e) {
      console.error('Profile approved email failed:', e)
    }
    await createNotification({
      userId: profile.member.user.id,
      type: 'PROFILE_APPROVED',
      title: 'Boutique approuvee',
      message: `${profile.businessName} est maintenant en ligne.`,
      link: '/mon-business',
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
  reason?: string,
): Promise<ActionResult<{ profileId: string }>> {
  try {
    const { user } = await requireAdmin()

    const profile = await db.businessProfile.findUnique({
      where: { id: profileId },
      include: { member: { include: { user: true } } },
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

    // Email + notification
    try {
      await sendProfileRejectedEmail(profile.member.user.email, profile.member.firstName, profile.businessName, reason || '')
    } catch (e) {
      console.error('Profile rejected email failed:', e)
    }
    await createNotification({
      userId: profile.member.user.id,
      type: 'PROFILE_REJECTED',
      title: 'Boutique refusee',
      message: reason || 'Votre boutique n\'a pas ete approuvee.',
      link: '/mon-business',
    })

    return { success: true, data: { profileId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
