'use server'

import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { generateSecureToken, hashToken } from '@/lib/server-utils'
import { createAuditLog } from '@/domains/audit/actions'
import { sendPasswordResetEmail } from '@/lib/email'
import {
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
  PASSWORD_RESET_COOLDOWN_MINUTES,
} from '@/lib/constants'
import { forgotPasswordSchema, resetPasswordSchema } from './validators'
import { findValidPasswordResetToken, getLastPasswordResetRequest } from './queries'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

const GENERIC_SUCCESS_MESSAGE =
  'Si un compte existe avec cette adresse email, un lien de reinitialisation a ete envoye.'

export async function requestPasswordReset(
  input: unknown,
): Promise<ActionResult<{ message: string }>> {
  try {
    const parsed = forgotPasswordSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: { email: ['Email invalide'] },
      }
    }

    const { email } = parsed.data

    // Always return same message to prevent email enumeration
    const user = await db.user.findUnique({
      where: { email },
      include: { member: true },
    })

    if (!user) {
      return { success: true, data: { message: GENERIC_SUCCESS_MESSAGE } }
    }

    // Check cooldown
    const lastRequest = await getLastPasswordResetRequest(user.id)
    if (lastRequest) {
      const cooldownMs = PASSWORD_RESET_COOLDOWN_MINUTES * 60 * 1000
      const elapsed = Date.now() - lastRequest.createdAt.getTime()
      if (elapsed < cooldownMs) {
        return { success: true, data: { message: GENERIC_SUCCESS_MESSAGE } }
      }
    }

    // Invalidate old tokens
    await db.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    })

    // Generate new token
    const rawToken = generateSecureToken()
    const hashedToken = hashToken(rawToken)
    const expiresAt = new Date(
      Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    )

    await db.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    })

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reinitialiser-mot-de-passe?token=${rawToken}`
    const prenom = user.member?.firstName ?? 'Membre'

    await sendPasswordResetEmail(user.email, prenom, resetUrl)

    // Audit log
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'USER',
      entityId: user.id,
    })

    return { success: true, data: { message: GENERIC_SUCCESS_MESSAGE } }
  } catch (error) {
    console.error('[requestPasswordReset]', error)
    return { success: false, error: 'Une erreur est survenue. Veuillez reessayer.' }
  }
}

export async function resetPassword(
  input: unknown,
): Promise<ActionResult<{ message: string }>> {
  try {
    const parsed = resetPasswordSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: { password: ['Donnees invalides'] },
      }
    }

    const { token, password } = parsed.data

    // Hash the incoming token and look up
    const hashedToken = hashToken(token)
    const resetToken = await findValidPasswordResetToken(hashedToken)

    if (!resetToken) {
      return {
        success: false,
        error: 'Token invalide ou expire. Veuillez refaire une demande.',
      }
    }

    // Update password
    const passwordHash = await hash(password, 12)

    await db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    })

    // Mark token as used
    await db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    })

    // Audit log
    await createAuditLog({
      userId: resetToken.userId,
      userEmail: resetToken.user.email,
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'USER',
      entityId: resetToken.userId,
    })

    return {
      success: true,
      data: { message: 'Mot de passe reinitialise avec succes.' },
    }
  } catch (error) {
    console.error('[resetPassword]', error)
    return { success: false, error: 'Une erreur est survenue. Veuillez reessayer.' }
  }
}
