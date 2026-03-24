import { db } from '@/lib/db'
import type { PublicEventListItem } from './types'

export async function getPublishedEvents(): Promise<PublicEventListItem[]> {
  return db.event.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      prices: true,
      _count: { select: { tickets: { where: { status: { in: ['PAID', 'PENDING'] } } } } },
    },
    orderBy: { startDate: 'asc' },
  })
}

export async function getEventBySlug(slug: string) {
  return db.event.findUnique({
    where: { slug },
    include: {
      prices: true,
      _count: { select: { tickets: { where: { status: { in: ['PAID', 'PENDING'] } } } } },
    },
  })
}

export async function getAvailableSeats(eventId: string): Promise<number> {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: {
      capacity: true,
      _count: { select: { tickets: { where: { status: { in: ['PAID', 'PENDING'] } } } } },
    },
  })

  if (!event) return 0
  return Math.max(0, event.capacity - event._count.tickets)
}
