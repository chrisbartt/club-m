'use server'

import type { z } from 'zod'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
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
