'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createCategorySchema, updateCategorySchema } from './validators'

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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9àâäéèêëïîôùûüç]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createCategory(
  input: unknown,
): Promise<ActionResult<{ categoryId: string }>> {
  try {
    await requireAdmin()

    const parsed = createCategorySchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { name } = parsed.data
    const slug = generateSlug(name)

    const category = await db.category.create({
      data: { name, slug },
    })

    return { success: true, data: { categoryId: category.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function updateCategory(
  input: unknown,
): Promise<ActionResult<{ categoryId: string }>> {
  try {
    await requireAdmin()

    const parsed = updateCategorySchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { id, name } = parsed.data
    const slug = generateSlug(name)

    const category = await db.category.update({
      where: { id },
      data: { name, slug },
    })

    return { success: true, data: { categoryId: category.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function toggleCategory(
  categoryId: string,
): Promise<ActionResult<{ categoryId: string; isActive: boolean }>> {
  try {
    await requireAdmin()

    const category = await db.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return { success: false, error: 'CATEGORY_NOT_FOUND' }
    }

    const updated = await db.category.update({
      where: { id: categoryId },
      data: { isActive: !category.isActive },
    })

    return {
      success: true,
      data: { categoryId: updated.id, isActive: updated.isActive },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
