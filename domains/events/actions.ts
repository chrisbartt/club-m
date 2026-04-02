'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import { generateSlug } from '@/lib/utils'
import { createEventSchema, updateEventSchema, eventIdSchema } from './validators'

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

export async function createEvent(
  input: unknown
): Promise<ActionResult<{ eventId: string; slug: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = createEventSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const data = parsed.data
    const slug = `${generateSlug(data.title)}-${Date.now().toString(36)}`

    const event = await db.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacity: data.capacity,
        coverImage: data.coverImage,
        accessLevel: data.accessLevel,
        waitlistEnabled: data.waitlistEnabled,
        createdById: user.id,
        prices: {
          create: data.prices.map((p) => ({
            targetRole: p.targetRole,
            price: p.price,
            currency: p.currency,
          })),
        },
      },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'EVENT_CREATED',
      entity: 'Event',
      entityId: event.id,
      details: { title: data.title, slug },
    })

    return { success: true, data: { eventId: event.id, slug } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function updateEvent(
  input: unknown
): Promise<ActionResult<{ eventId: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = updateEventSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { id, prices, startDate, endDate, ...rest } = parsed.data

    const existing = await db.event.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    await db.$transaction(async (tx) => {
      await tx.event.update({
        where: { id },
        data: {
          ...rest,
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
        },
      })

      if (prices) {
        await tx.eventPrice.deleteMany({ where: { eventId: id } })
        await tx.eventPrice.createMany({
          data: prices.map((p) => ({
            eventId: id,
            targetRole: p.targetRole,
            price: p.price,
            currency: p.currency,
          })),
        })
      }
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'EVENT_UPDATED',
      entity: 'Event',
      entityId: id,
      details: { title: rest.title ?? existing.title },
    })

    return { success: true, data: { eventId: id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function publishEvent(
  input: unknown
): Promise<ActionResult<{ eventId: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = eventIdSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }
    const { eventId } = parsed.data

    const event = await db.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    await db.event.update({
      where: { id: eventId },
      data: { status: 'PUBLISHED' },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'EVENT_PUBLISHED',
      entity: 'Event',
      entityId: eventId,
      details: { title: event.title },
    })

    return { success: true, data: { eventId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function cancelEvent(
  input: unknown
): Promise<ActionResult<{ eventId: string }>> {
  try {
    const { user } = await requireAdmin()

    const parsed = eventIdSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'INVALID_INPUT' }
    }
    const { eventId } = parsed.data

    const event = await db.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    await db.event.update({
      where: { id: eventId },
      data: { status: 'CANCELLED' },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'EVENT_CANCELLED',
      entity: 'Event',
      entityId: eventId,
      details: { title: event.title },
    })

    return { success: true, data: { eventId } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
