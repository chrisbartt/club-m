import type {
  Event,
  EventPrice,
  Ticket,
  EventAccessLevel,
  EventStatus,
  PricingRole,
  Currency,
} from '@/lib/generated/prisma/client'

export type EventWithPrices = Event & {
  prices: EventPrice[]
}

export type EventWithDetails = Event & {
  prices: EventPrice[]
  tickets: (Ticket & {
    member: { firstName: string; lastName: string } | null
    customer: { firstName: string; lastName: string } | null
  })[]
  _count: { tickets: number }
}

export type PublicEventListItem = Event & {
  prices: EventPrice[]
  _count: { tickets: number }
}

export type AdminEventListItem = Event & {
  prices: EventPrice[]
  _count: { tickets: number }
}

export type AdminEventsStats = {
  total: number
  published: number
  draft: number
  totalPaidTickets: number
}

export type EventPriceInput = {
  targetRole: PricingRole
  price: number
  currency: Currency
}

export type {
  EventAccessLevel,
  EventStatus,
  PricingRole,
  Currency,
}
