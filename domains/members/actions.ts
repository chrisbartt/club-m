'use server'

import type { z } from 'zod'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { generateSecureToken, hashToken } from '@/lib/server-utils'
import { EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS } from '@/lib/constants'
import { sendWelcomeEmail } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { registerMemberSchema, registerCustomerSchema } from './validators'
import { getUserByEmail } from './queries'

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

export async function registerMember(
  input: unknown,
): Promise<ActionResult<{ userId: string; memberId: string }>> {
  const parsed = registerMemberSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'INVALID_INPUT',
      details: flattenFieldErrors(parsed.error),
    }
  }

  const ip = await getClientIp()
  const rl = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000)
  if (!rl.success) {
    return { success: false, error: 'Trop de tentatives. Reessayez dans une heure.' }
  }

  const { email, password, firstName, lastName } = parsed.data

  const existing = await getUserByEmail(email)
  if (existing) {
    return {
      success: false,
      error: 'EMAIL_TAKEN',
      details: { email: ['Cette adresse email est deja utilisee'] },
    }
  }

  const passwordHash = await hash(password, 12)

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      member: {
        create: {
          firstName,
          lastName,
          tier: 'FREE',
          status: 'ACTIVE',
          verificationStatus: 'DECLARED',
        },
      },
    },
    include: { member: true },
  })

  // Generate verification token and send welcome email
  const rawToken = generateSecureToken()
  const hashedToken = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

  await db.emailVerificationToken.create({
    data: { token: hashedToken, userId: user.id, expiresAt },
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verificationUrl = `${baseUrl}/verify-email/${rawToken}`
  try {
    await sendWelcomeEmail(email, firstName, verificationUrl)
  } catch (e) {
    console.error('Failed to send welcome email:', e)
  }

  return {
    success: true,
    data: { userId: user.id, memberId: user.member!.id },
  }
}

export async function registerCustomer(
  input: unknown,
): Promise<ActionResult<{ userId: string; customerId: string }>> {
  const parsed = registerCustomerSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'INVALID_INPUT',
      details: flattenFieldErrors(parsed.error),
    }
  }

  const { email, password, firstName, lastName, phone } = parsed.data

  const existing = await getUserByEmail(email)
  if (existing) {
    return {
      success: false,
      error: 'EMAIL_TAKEN',
      details: { email: ['Cette adresse email est deja utilisee'] },
    }
  }

  const passwordHash = await hash(password, 12)

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      customer: {
        create: { firstName, lastName, phone },
      },
    },
    include: { customer: true },
  })

  return {
    success: true,
    data: { userId: user.id, customerId: user.customer!.id },
  }
}
