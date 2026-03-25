'use server'

import { hash, compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { generateSecureToken, hashToken } from '@/lib/server-utils'
import { requireAuth } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import { sendPasswordResetEmail, sendWelcomeEmail } from '@/lib/email'
import {
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
  PASSWORD_RESET_COOLDOWN_MINUTES,
  EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS,
  EMAIL_RESEND_COOLDOWN_MINUTES,
} from '@/lib/constants'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changeEmailSchema,
} from './validators'
import {
  findValidPasswordResetToken,
  findValidEmailVerificationToken,
  getLastPasswordResetRequest,
  getLastVerificationEmailSent,
} from './queries'

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

export async function verifyEmail(
  input: unknown,
): Promise<ActionResult<{ message: string }>> {
  try {
    const parsed = verifyEmailSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: { token: ['Token requis'] },
      }
    }

    const { token } = parsed.data

    const hashedToken = hashToken(token)
    const verificationToken = await findValidEmailVerificationToken(hashedToken)

    if (!verificationToken) {
      return {
        success: false,
        error: 'Token invalide ou expire. Veuillez demander un nouveau lien de verification.',
      }
    }

    // Mark user as verified
    await db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    })

    // Mark token as used
    await db.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() },
    })

    // Audit log
    await createAuditLog({
      userId: verificationToken.userId,
      userEmail: verificationToken.user.email,
      action: 'EMAIL_VERIFIED',
      entity: 'USER',
      entityId: verificationToken.userId,
    })

    return {
      success: true,
      data: { message: 'Adresse email verifiee avec succes.' },
    }
  } catch (error) {
    console.error('[verifyEmail]', error)
    return { success: false, error: 'Une erreur est survenue. Veuillez reessayer.' }
  }
}

export async function resendVerificationEmail(): Promise<ActionResult<{ message: string }>> {
  try {
    const user = await requireAuth()

    if (user.emailVerified) {
      return { success: false, error: 'Email deja verifie.' }
    }

    // Check cooldown
    const lastSent = await getLastVerificationEmailSent(user.id)
    if (lastSent) {
      const cooldownMs = EMAIL_RESEND_COOLDOWN_MINUTES * 60 * 1000
      const elapsed = Date.now() - lastSent.createdAt.getTime()
      if (elapsed < cooldownMs) {
        return {
          success: false,
          error: `Veuillez attendre ${EMAIL_RESEND_COOLDOWN_MINUTES} minutes avant de renvoyer un email.`,
        }
      }
    }

    // Invalidate old tokens
    await db.emailVerificationToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    })

    // Generate new token
    const rawToken = generateSecureToken()
    const hashedToken = hashToken(rawToken)
    const expiresAt = new Date(
      Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    )

    await db.emailVerificationToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    })

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/verify-email/${rawToken}`
    const prenom = user.member?.firstName ?? 'Membre'

    await sendWelcomeEmail(user.email, prenom, verificationUrl)

    // Audit log
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'EMAIL_VERIFICATION_RESENT',
      entity: 'USER',
      entityId: user.id,
    })

    return {
      success: true,
      data: { message: 'Email de verification envoye.' },
    }
  } catch (error) {
    console.error('[resendVerificationEmail]', error)
    return { success: false, error: 'Une erreur est survenue. Veuillez reessayer.' }
  }
}

export async function changeEmailAndResend(
  input: unknown,
): Promise<ActionResult<{ message: string }>> {
  try {
    const user = await requireAuth()

    const parsed = changeEmailSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: { newEmail: ['Donnees invalides'] },
      }
    }

    const { newEmail, currentPassword } = parsed.data

    // Verify current password
    if (!user.passwordHash) {
      return { success: false, error: 'Impossible de verifier le mot de passe.' }
    }

    const passwordValid = await compare(currentPassword, user.passwordHash)
    if (!passwordValid) {
      return {
        success: false,
        error: 'Mot de passe incorrect.',
        details: { currentPassword: ['Mot de passe incorrect'] },
      }
    }

    // Check new email uniqueness
    const existingUser = await db.user.findUnique({
      where: { email: newEmail },
    })
    if (existingUser) {
      return {
        success: false,
        error: 'EMAIL_TAKEN',
        details: { newEmail: ['Cette adresse email est deja utilisee'] },
      }
    }

    // Update email and reset verification
    await db.user.update({
      where: { id: user.id },
      data: { email: newEmail, emailVerified: false },
    })

    // Invalidate old verification tokens
    await db.emailVerificationToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    })

    // Generate new token
    const rawToken = generateSecureToken()
    const hashedToken = hashToken(rawToken)
    const expiresAt = new Date(
      Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    )

    await db.emailVerificationToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    })

    // Send verification email to new address
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/verify-email/${rawToken}`
    const prenom = user.member?.firstName ?? 'Membre'

    await sendWelcomeEmail(newEmail, prenom, verificationUrl)

    // Audit log
    await createAuditLog({
      userId: user.id,
      userEmail: newEmail,
      action: 'EMAIL_CHANGED',
      entity: 'USER',
      entityId: user.id,
      details: { oldEmail: user.email, newEmail },
    })

    return {
      success: true,
      data: { message: 'Email mis a jour. Un lien de verification a ete envoye a la nouvelle adresse.' },
    }
  } catch (error) {
    console.error('[changeEmailAndResend]', error)
    return { success: false, error: 'Une erreur est survenue. Veuillez reessayer.' }
  }
}
