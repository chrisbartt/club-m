'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { createProductSchema, updateProductSchema } from './validators'

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

export async function createProduct(
  input: unknown,
): Promise<ActionResult<{ productId: string }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const profile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })
    if (!profile || profile.profileType !== 'STORE') {
      return { success: false, error: 'NO_STORE_PROFILE' }
    }

    const parsed = createProductSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const data = parsed.data

    const product = await db.product.create({
      data: {
        businessId: profile.id,
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        images: data.images,
        type: data.type,
        category: data.category,
        stock: data.stock,
      },
    })

    return { success: true, data: { productId: product.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function updateProduct(
  input: unknown,
): Promise<ActionResult<{ productId: string }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const profile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })
    if (!profile || profile.profileType !== 'STORE') {
      return { success: false, error: 'NO_STORE_PROFILE' }
    }

    const parsed = updateProductSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { id, ...data } = parsed.data

    const product = await db.product.findUnique({
      where: { id },
    })
    if (!product) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }
    if (product.businessId !== profile.id) {
      return { success: false, error: 'NOT_OWNER' }
    }

    await db.product.update({
      where: { id },
      data,
    })

    return { success: true, data: { productId: id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function toggleProductActive(
  productId: string,
): Promise<ActionResult<{ productId: string; isActive: boolean }>> {
  try {
    const { member } = await requireMember('BUSINESS')

    const profile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })
    if (!profile || profile.profileType !== 'STORE') {
      return { success: false, error: 'NO_STORE_PROFILE' }
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    })
    if (!product) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }
    if (product.businessId !== profile.id) {
      return { success: false, error: 'NOT_OWNER' }
    }

    const updated = await db.product.update({
      where: { id: productId },
      data: { isActive: !product.isActive },
    })

    return {
      success: true,
      data: { productId, isActive: updated.isActive },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
