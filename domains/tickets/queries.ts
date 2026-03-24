import { db } from '@/lib/db'
import type { TicketWithEvent } from './types'

export async function getMemberTickets(memberId: string): Promise<TicketWithEvent[]> {
  return db.ticket.findMany({
    where: { memberId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          startDate: true,
          endDate: true,
          coverImage: true,
        },
      },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTicketById(ticketId: string): Promise<TicketWithEvent | null> {
  return db.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          startDate: true,
          endDate: true,
          coverImage: true,
        },
      },
      payment: true,
    },
  })
}

export async function hasTicketForEvent(
  memberId: string,
  eventId: string
): Promise<boolean> {
  const ticket = await db.ticket.findFirst({
    where: {
      memberId,
      eventId,
      status: { in: ['PAID', 'PENDING'] },
    },
    select: { id: true },
  })
  return ticket !== null
}
