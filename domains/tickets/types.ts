import type { Ticket, Event, Payment } from '@/lib/generated/prisma/client'

export type TicketWithEvent = Ticket & {
  event: Pick<Event, 'id' | 'title' | 'slug' | 'location' | 'startDate' | 'endDate' | 'coverImage'>
  payment: Payment | null
}
