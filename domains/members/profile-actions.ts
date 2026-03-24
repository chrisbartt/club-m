'use server'

import type { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import {
  updateProfileSchema,
  updatePasswordSchema,
  updateAvatarSchema,
} from './profile-validators'

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

export async function updateProfile(
  input: unknown
): Promise<ActionResult<{ memberId: string }>> {
  try {
    const { member } = await requireMember()

    const parsed = updateProfileSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    await db.member.update({
      where: { id: member.id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        bio: parsed.data.bio,
      },
    })

    return { success: true, data: { memberId: member.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function updatePassword(
  input: unknown
): Promise<ActionResult<{ updated: true }>> {
  try {
    const { user, member } = await requireMember()

    const parsed = updatePasswordSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const isValid = await compare(
      parsed.data.currentPassword,
      user.passwordHash
    )
    if (!isValid) {
      return {
        success: false,
        error: 'INVALID_CURRENT_PASSWORD',
        details: {
          currentPassword: ['Le mot de passe actuel est incorrect'],
        },
      }
    }

    const passwordHash = await hash(parsed.data.newPassword, 12)
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'PASSWORD_CHANGED',
      entity: 'Member',
      entityId: member.id,
    })

    return { success: true, data: { updated: true } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function updateAvatar(
  input: unknown
): Promise<ActionResult<{ avatarUrl: string }>> {
  try {
    const { member } = await requireMember()

    const parsed = updateAvatarSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    await db.member.update({
      where: { id: member.id },
      data: { avatar: parsed.data.avatarUrl },
    })

    return { success: true, data: { avatarUrl: parsed.data.avatarUrl } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
