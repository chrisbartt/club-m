'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import {
  createCouponSchema,
  updateCouponSchema,
} from './validators'

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

export async function createCoupon(
  input: unknown
): Promise<ActionResult<{ couponId: string }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const parsed = createCouponSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { code, type, value, currency, minOrderAmount, maxUses, startsAt, expiresAt } =
      parsed.data

    const sellerProfile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })

    if (!sellerProfile) {
      return { success: false, error: 'BUSINESS_NOT_FOUND' }
    }

    const normalizedCode = code.trim().toUpperCase()

    const coupon = await db.coupon.create({
      data: {
        businessId: sellerProfile.id,
        code: normalizedCode,
        type,
        value,
        currency: currency ?? null,
        minOrderAmount: minOrderAmount ?? null,
        maxUses: maxUses ?? null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return { success: true, data: { couponId: coupon.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function updateCoupon(
  input: unknown
): Promise<ActionResult<{ couponId: string }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const parsed = updateCouponSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { id, code, type, value, currency, minOrderAmount, maxUses, startsAt, expiresAt } =
      parsed.data

    const sellerProfile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })

    if (!sellerProfile) {
      return { success: false, error: 'BUSINESS_NOT_FOUND' }
    }

    const existing = await db.coupon.findUnique({ where: { id } })
    if (!existing || existing.businessId !== sellerProfile.id) {
      return { success: false, error: 'COUPON_NOT_FOUND' }
    }

    const normalizedCode = code.trim().toUpperCase()

    const coupon = await db.coupon.update({
      where: { id },
      data: {
        code: normalizedCode,
        type,
        value,
        currency: currency ?? null,
        minOrderAmount: minOrderAmount ?? null,
        maxUses: maxUses ?? null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return { success: true, data: { couponId: coupon.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function checkCoupon(
  code: string,
  businessId: string,
  cartTotal: number,
  cartCurrency: string,
): Promise<ActionResult<{ code: string; discount: number }>> {
  try {
    const { validateCoupon } = await import('./queries')
    const result = await validateCoupon(code, businessId, cartTotal, cartCurrency)
    if (result.valid) {
      return { success: true, data: { code: result.coupon.code, discount: result.discount } }
    }
    return { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function toggleCoupon(
  couponId: string
): Promise<ActionResult<{ couponId: string; isActive: boolean }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const sellerProfile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })

    if (!sellerProfile) {
      return { success: false, error: 'BUSINESS_NOT_FOUND' }
    }

    const existing = await db.coupon.findUnique({ where: { id: couponId } })
    if (!existing || existing.businessId !== sellerProfile.id) {
      return { success: false, error: 'COUPON_NOT_FOUND' }
    }

    const coupon = await db.coupon.update({
      where: { id: couponId },
      data: { isActive: !existing.isActive },
    })

    return {
      success: true,
      data: { couponId: coupon.id, isActive: coupon.isActive },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
