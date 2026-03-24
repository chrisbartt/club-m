import { db } from '@/lib/db'
import type { EventStatus } from '@/lib/generated/prisma/client'
import type { AdminEventListItem, AdminEventsStats, EventWithDetails } from './types'

export async function getAdminEventsList(filters?: {
  status?: EventStatus
}): Promise<AdminEventListItem[]> {
  return db.event.findMany({
    where: filters?.status ? { status: filters.status } : undefined,
    include: {
      prices: true,
      _count: { select: { tickets: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAdminEventDetail(eventId: string): Promise<EventWithDetails | null> {
  return db.event.findUnique({
    where: { id: eventId },
    include: {
      prices: true,
      tickets: {
        include: {
          member: { select: { firstName: true, lastName: true } },
          customer: { select: { firstName: true, lastName: true } },
        },
      },
      _count: { select: { tickets: true } },
    },
  })
}

export async function getAdminEventsStats(): Promise<AdminEventsStats> {
  const [total, published, draft, totalPaidTickets] = await Promise.all([
    db.event.count(),
    db.event.count({ where: { status: 'PUBLISHED' } }),
    db.event.count({ where: { status: 'DRAFT' } }),
    db.ticket.count({ where: { status: 'PAID' } }),
  ])

  return { total, published, draft, totalPaidTickets }
}
