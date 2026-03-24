'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import { generateSlug } from '@/lib/utils'
import { createProfileSchema, updateProfileSchema } from './validators'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

function flattenFieldErrors(
  error: z.ZodError,
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

export async function createBusinessProfile(
  input: unknown,
): Promise<ActionResult<{ profileId: string; slug: string }>> {
  try {
    const { user, member } = await requireMember('PREMIUM')

    const parsed = createProfileSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const existing = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })
    if (existing) {
      return { success: false, error: 'PROFILE_ALREADY_EXISTS' }
    }

    const data = parsed.data
    const profileType = member.tier === 'BUSINESS' ? 'STORE' : 'SHOWCASE'
    const slug = `${generateSlug(data.businessName)}-${Date.now().toString(36)}`

    const profile = await db.businessProfile.create({
      data: {
        memberId: member.id,
        businessName: data.businessName,
        slug,
        description: data.description,
        category: data.category,
        coverImage: data.coverImage,
        images: data.images,
        phone: data.phone,
        email: data.email,
        website: data.website,
        whatsapp: data.whatsapp,
        address: data.address,
        profileType,
      },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'PROFILE_CREATED',
      entity: 'BusinessProfile',
      entityId: profile.id,
      details: { businessName: data.businessName, slug, profileType },
    })

    return { success: true, data: { profileId: profile.id, slug } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function updateBusinessProfile(
  input: unknown,
): Promise<ActionResult<{ profileId: string }>> {
  try {
    const { member } = await requireMember('PREMIUM')

    const parsed = updateProfileSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { id, ...data } = parsed.data

    const profile = await db.businessProfile.findUnique({
      where: { id },
    })
    if (!profile) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }
    if (profile.memberId !== member.id) {
      return { success: false, error: 'NOT_OWNER' }
    }

    await db.businessProfile.update({
      where: { id },
      data,
    })

    return { success: true, data: { profileId: id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function togglePublishProfile(
  profileId: string,
): Promise<ActionResult<{ profileId: string; isPublished: boolean }>> {
  try {
    const { member } = await requireMember('PREMIUM')

    const profile = await db.businessProfile.findUnique({
      where: { id: profileId },
    })
    if (!profile) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }
    if (profile.memberId !== member.id) {
      return { success: false, error: 'NOT_OWNER' }
    }
    if (!profile.isApproved) {
      return { success: false, error: 'PROFILE_NOT_APPROVED' }
    }

    const updated = await db.businessProfile.update({
      where: { id: profileId },
      data: { isPublished: !profile.isPublished },
    })

    return {
      success: true,
      data: { profileId, isPublished: updated.isPublished },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
