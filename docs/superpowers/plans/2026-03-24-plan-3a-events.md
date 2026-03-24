# Plan 3A — Events & Ticketing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build complete events system — admin CRUD with dynamic pricing, public event listing, member event booking with QR ticket generation.

**Architecture:** Events domain with validators/queries/actions. Admin creates events with per-role pricing. Public and member pages display events. Ticket purchase creates a Payment (stub for now) and generates a QR code. QR scanning marks ticket as USED.

**Tech Stack:** Next.js 16, Prisma 7, Zod 4, shadcn/ui, qrcode (npm package for QR generation)

**Spec:** `docs/superpowers/specs/2026-03-23-club-m-platform-design.md` — Sections 5 (Events model) and 7 (Flow 5)

---

## Codebase Notes

**Import rules:**
- Prisma: `from '@/lib/generated/prisma/client'`
- DB: `import { db } from '@/lib/db'`
- Auth: `import { auth } from '@/lib/auth'`
- Guards: `from '@/lib/auth-guards'`
- Constants: `from '@/lib/constants'`
- Utils: `from '@/lib/utils'` (has cn, generateSlug)
- Audit: `from '@/domains/audit/actions'`

**Server Actions:** Return-value pattern `{ success, data } | { success, error, details? }`

**URLs:** French — `/evenements`, `/admin/evenements`

**Admin sidebar** already has `/admin/evenements` link.
**Member sidebar** already has `/evenements` link.

---

## File Structure

```
domains/events/types.ts                — Event-related TypeScript types
domains/events/validators.ts           — Zod schemas for event CRUD
domains/events/queries.ts              — Public + member event queries
domains/events/actions.ts              — Event CRUD + ticket booking actions
domains/events/admin-queries.ts        — Admin event queries
domains/tickets/types.ts               — Ticket types
domains/tickets/queries.ts             — Ticket queries for members
domains/tickets/actions.ts             — Ticket purchase + QR generation

app/(admin)/admin/evenements/page.tsx           — Admin events list
app/(admin)/admin/evenements/nouveau/page.tsx   — Admin create event form
app/(admin)/admin/evenements/[id]/page.tsx      — Admin event detail + edit

app/(public)/evenements/page.tsx                — Public events listing
app/(public)/evenements/[slug]/page.tsx         — Public event detail

app/(member)/evenements/page.tsx                — Member events (with member pricing)
app/(member)/evenements/[slug]/page.tsx         — Member event detail + booking
app/(member)/tickets/page.tsx                   — My tickets list

components/events/event-card.tsx                — Event card (reusable)
components/events/event-pricing.tsx             — Pricing display by role
components/events/event-form.tsx                — Admin event create/edit form
components/events/ticket-card.tsx               — Ticket with QR code display
components/events/booking-button.tsx            — Book event button (client)
```

---

## Task 1: Events Domain

**Files:**
- Create: `domains/events/types.ts`, `domains/events/validators.ts`, `domains/events/queries.ts`, `domains/events/actions.ts`, `domains/events/admin-queries.ts`

### domains/events/types.ts

```typescript
import type { Event, EventPrice, Ticket, PricingRole, EventAccessLevel, EventStatus } from '@/lib/generated/prisma/client'

export type EventWithPrices = Event & { prices: EventPrice[] }

export type EventWithDetails = Event & {
  prices: EventPrice[]
  _count: { tickets: number }
}

export type PublicEventListItem = {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string | null
  location: string
  startDate: Date
  endDate: Date
  capacity: number
  accessLevel: EventAccessLevel
  status: EventStatus
  ticketsSold: number
  prices: EventPrice[]
}
```

### domains/events/validators.ts

```typescript
import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  description: z.string().min(1, 'Description requise'),
  location: z.string().min(1, 'Lieu requis'),
  startDate: z.string().min(1, 'Date de debut requise'),
  endDate: z.string().min(1, 'Date de fin requise'),
  capacity: z.number().int().min(1, 'Capacite minimale: 1'),
  coverImage: z.string().optional(),
  accessLevel: z.enum(['PUBLIC', 'MEMBERS_ONLY', 'PREMIUM_ONLY', 'BUSINESS_ONLY']),
  waitlistEnabled: z.boolean().default(false),
  prices: z.array(z.object({
    targetRole: z.enum(['PUBLIC', 'FREE', 'PREMIUM', 'BUSINESS']),
    price: z.number().min(0, 'Prix minimum: 0'),
    currency: z.enum(['USD', 'CDF', 'EUR']).default('USD'),
  })).min(1, 'Au moins un prix requis'),
})

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
})
```

### domains/events/queries.ts

```typescript
import { db } from '@/lib/db'
import type { EventAccessLevel } from '@/lib/generated/prisma/client'

export async function getPublishedEvents(accessLevel?: EventAccessLevel) {
  const where: Record<string, unknown> = { status: 'PUBLISHED' }
  if (accessLevel) {
    where.accessLevel = { in: getAccessibleLevels(accessLevel) }
  }

  return db.event.findMany({
    where: where as any,
    include: {
      prices: true,
      _count: { select: { tickets: { where: { status: { in: ['PAID', 'USED'] } } } } },
    },
    orderBy: { startDate: 'asc' },
  })
}

export async function getEventBySlug(slug: string) {
  return db.event.findUnique({
    where: { slug },
    include: {
      prices: true,
      _count: { select: { tickets: { where: { status: { in: ['PAID', 'USED'] } } } } },
    },
  })
}

function getAccessibleLevels(maxLevel: EventAccessLevel): EventAccessLevel[] {
  const levels: EventAccessLevel[] = ['PUBLIC']
  if (maxLevel === 'MEMBERS_ONLY' || maxLevel === 'PREMIUM_ONLY' || maxLevel === 'BUSINESS_ONLY') levels.push('MEMBERS_ONLY')
  if (maxLevel === 'PREMIUM_ONLY' || maxLevel === 'BUSINESS_ONLY') levels.push('PREMIUM_ONLY')
  if (maxLevel === 'BUSINESS_ONLY') levels.push('BUSINESS_ONLY')
  return levels
}

export async function getAvailableSeats(eventId: string): Promise<number> {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { tickets: { where: { status: { in: ['PAID', 'USED', 'PENDING'] } } } } } },
  })
  if (!event) return 0
  return event.capacity - event._count.tickets
}
```

### domains/events/admin-queries.ts

```typescript
import { db } from '@/lib/db'
import type { EventStatus } from '@/lib/generated/prisma/client'

export async function getAdminEventsList(filters?: { status?: EventStatus }) {
  return db.event.findMany({
    where: filters?.status ? { status: filters.status } : undefined,
    include: {
      prices: true,
      _count: { select: { tickets: true } },
    },
    orderBy: { startDate: 'desc' },
    take: 100,
  })
}

export async function getAdminEventDetail(eventId: string) {
  return db.event.findUnique({
    where: { id: eventId },
    include: {
      prices: true,
      tickets: {
        include: {
          member: { select: { firstName: true, lastName: true } },
          customer: { select: { firstName: true, lastName: true } },
          payment: { select: { status: true, amount: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      _count: { select: { tickets: true } },
    },
  })
}

export async function getAdminEventsStats() {
  const [total, published, draft, totalTickets] = await Promise.all([
    db.event.count(),
    db.event.count({ where: { status: 'PUBLISHED' } }),
    db.event.count({ where: { status: 'DRAFT' } }),
    db.ticket.count({ where: { status: 'PAID' } }),
  ])
  return { total, published, draft, totalTickets }
}
```

### domains/events/actions.ts

```typescript
'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createEventSchema, updateEventSchema } from './validators'
import { generateSlug } from '@/lib/utils'
import { createAuditLog } from '@/domains/audit/actions'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

function flattenErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_root')
    if (!result[key]) result[key] = []
    result[key].push(issue.message)
  }
  return result
}

export async function createEvent(input: unknown): Promise<ActionResult<{ eventId: string; slug: string }>> {
  const { user, admin } = await requireAdmin()

  const parsed = createEventSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }
  }

  const { prices, startDate, endDate, ...eventData } = parsed.data
  const slug = generateSlug(eventData.title) + '-' + Date.now().toString(36)

  const event = await db.event.create({
    data: {
      ...eventData,
      slug,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'DRAFT',
      createdById: user.id,
      prices: {
        create: prices.map((p) => ({
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
    action: 'event.create',
    entity: 'Event',
    entityId: event.id,
  })

  return { success: true, data: { eventId: event.id, slug: event.slug } }
}

export async function updateEvent(input: unknown): Promise<ActionResult<{ eventId: string }>> {
  const { user } = await requireAdmin()

  const parsed = updateEventSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }
  }

  const { id, prices, startDate, endDate, ...updateData } = parsed.data

  const event = await db.event.findUnique({ where: { id } })
  if (!event) return { success: false, error: 'RESOURCE_NOT_FOUND' }

  await db.event.update({
    where: { id },
    data: {
      ...updateData,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    },
  })

  // Update prices if provided
  if (prices) {
    await db.eventPrice.deleteMany({ where: { eventId: id } })
    await db.eventPrice.createMany({
      data: prices.map((p) => ({ eventId: id, targetRole: p.targetRole, price: p.price, currency: p.currency })),
    })
  }

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'event.update',
    entity: 'Event',
    entityId: id,
    details: { status: updateData.status },
  })

  return { success: true, data: { eventId: id } }
}

export async function publishEvent(eventId: string): Promise<ActionResult<null>> {
  const { user } = await requireAdmin()

  const event = await db.event.findUnique({ where: { id: eventId } })
  if (!event) return { success: false, error: 'RESOURCE_NOT_FOUND' }

  await db.event.update({ where: { id: eventId }, data: { status: 'PUBLISHED' } })

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'event.publish',
    entity: 'Event',
    entityId: eventId,
  })

  return { success: true, data: null }
}

export async function cancelEvent(eventId: string): Promise<ActionResult<null>> {
  const { user } = await requireAdmin()
  await db.event.update({ where: { id: eventId }, data: { status: 'CANCELLED' } })
  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'event.cancel',
    entity: 'Event',
    entityId: eventId,
  })
  return { success: true, data: null }
}
```

- [ ] **Commit**

```bash
git add domains/events/
git commit -m "feat: add events domain — CRUD, pricing, queries, admin queries"
```

---

## Task 2: Tickets Domain

**Files:**
- Create: `domains/tickets/types.ts`, `domains/tickets/queries.ts`, `domains/tickets/actions.ts`

### domains/tickets/types.ts

```typescript
import type { Ticket, Event, Payment } from '@/lib/generated/prisma/client'

export type TicketWithEvent = Ticket & {
  event: Pick<Event, 'id' | 'title' | 'slug' | 'startDate' | 'endDate' | 'location' | 'coverImage'>
  payment: Pick<Payment, 'amount' | 'currency' | 'status'> | null
}
```

### domains/tickets/queries.ts

```typescript
import { db } from '@/lib/db'

export async function getMemberTickets(memberId: string) {
  return db.ticket.findMany({
    where: { memberId },
    include: {
      event: { select: { id: true, title: true, slug: true, startDate: true, endDate: true, location: true, coverImage: true } },
      payment: { select: { amount: true, currency: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTicketById(ticketId: string) {
  return db.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: true,
      payment: true,
    },
  })
}

export async function hasTicketForEvent(memberId: string, eventId: string): Promise<boolean> {
  const ticket = await db.ticket.findFirst({
    where: { memberId, eventId, status: { in: ['PAID', 'PENDING'] } },
  })
  return !!ticket
}
```

### domains/tickets/actions.ts

Book a ticket for an event. For MVP, payment is simulated (ticket goes directly to PAID since payment provider is a stub).

```typescript
'use server'

import { db } from '@/lib/db'
import { requireMember, requireAuth } from '@/lib/auth-guards'
import { getEventBySlug, getAvailableSeats } from '@/domains/events/queries'
import { hasTicketForEvent } from './queries'
import { hasMinTier } from '@/lib/permissions'
import type { MemberTier, PricingRole, EventAccessLevel } from '@/lib/generated/prisma/client'
import crypto from 'crypto'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function generateQrCode(): string {
  return crypto.randomBytes(16).toString('hex')
}

function canAccessEvent(accessLevel: EventAccessLevel, memberTier?: MemberTier): boolean {
  if (accessLevel === 'PUBLIC') return true
  if (!memberTier) return false
  if (accessLevel === 'MEMBERS_ONLY') return true
  if (accessLevel === 'PREMIUM_ONLY') return hasMinTier(memberTier, 'PREMIUM')
  if (accessLevel === 'BUSINESS_ONLY') return hasMinTier(memberTier, 'BUSINESS')
  return false
}

function getPriceForRole(prices: { targetRole: string; price: any; currency: string }[], memberTier?: MemberTier): { price: number; currency: string } | null {
  // Find best price: try exact tier match, then fall back to lower tiers
  const roleMap: Record<string, PricingRole> = { FREE: 'FREE', PREMIUM: 'PREMIUM', BUSINESS: 'BUSINESS' }
  const role = memberTier ? roleMap[memberTier] : 'PUBLIC'

  // Try exact match first
  const exact = prices.find((p) => p.targetRole === role)
  if (exact) return { price: Number(exact.price), currency: exact.currency }

  // Fallback to PUBLIC price
  const pub = prices.find((p) => p.targetRole === 'PUBLIC')
  if (pub) return { price: Number(pub.price), currency: pub.currency }

  return null
}

export async function bookEvent(eventSlug: string): Promise<ActionResult<{ ticketId: string; qrCode: string }>> {
  // Allow both members and customers to book public events
  const user = await requireAuth()
  const memberId = user.member?.id ?? null
  const customerId = user.customer?.id ?? null

  if (!memberId && !customerId) {
    return { success: false, error: 'ACCOUNT_REQUIRED' }
  }

  const event = await getEventBySlug(eventSlug)
  if (!event) return { success: false, error: 'RESOURCE_NOT_FOUND' }
  if (event.status !== 'PUBLISHED') return { success: false, error: 'EVENT_NOT_BOOKABLE' }

  // Access check
  if (!canAccessEvent(event.accessLevel, user.member?.tier as MemberTier | undefined)) {
    return { success: false, error: 'INSUFFICIENT_TIER' }
  }

  // Check capacity
  const seats = await getAvailableSeats(event.id)
  if (seats <= 0) return { success: false, error: 'EVENT_FULL' }

  // Check duplicate (member only)
  if (memberId) {
    const already = await hasTicketForEvent(memberId, event.id)
    if (already) return { success: false, error: 'ALREADY_BOOKED' }
  }

  // Get price
  const priceInfo = getPriceForRole(event.prices, user.member?.tier as MemberTier | undefined)
  if (!priceInfo) return { success: false, error: 'NO_PRICE_CONFIGURED' }

  const qrCode = generateQrCode()

  // Create ticket + payment in transaction
  // MVP: ticket goes to PAID directly (payment stub)
  const ticket = await db.ticket.create({
    data: {
      eventId: event.id,
      ...(memberId ? { memberId } : { customerId }),
      qrCode,
      status: 'PAID', // MVP: skip real payment
      payment: {
        create: {
          amount: priceInfo.price,
          currency: priceInfo.currency as any,
          status: 'SUCCESS', // MVP: simulated
          provider: 'LOCAL_FINTECH',
        },
      },
    },
  })

  return { success: true, data: { ticketId: ticket.id, qrCode } }
}

export async function scanTicket(qrCode: string): Promise<ActionResult<{ ticketId: string; eventTitle: string; attendeeName: string }>> {
  await requireAdmin()

  const ticket = await db.ticket.findUnique({
    where: { qrCode },
    include: {
      event: { select: { title: true } },
      member: { select: { firstName: true, lastName: true } },
      customer: { select: { firstName: true, lastName: true } },
    },
  })

  if (!ticket) return { success: false, error: 'TICKET_NOT_FOUND' }
  if (ticket.status === 'USED') return { success: false, error: 'TICKET_ALREADY_USED' }
  if (ticket.status !== 'PAID') return { success: false, error: 'TICKET_NOT_PAID' }

  await db.ticket.update({
    where: { id: ticket.id },
    data: { status: 'USED', scannedAt: new Date() },
  })

  const attendee = ticket.member ?? ticket.customer
  const attendeeName = attendee ? `${attendee.firstName} ${attendee.lastName}` : 'Inconnu'

  return { success: true, data: { ticketId: ticket.id, eventTitle: ticket.event.title, attendeeName } }
}
```

- [ ] **Commit**

```bash
git add domains/tickets/
git commit -m "feat: add tickets domain — booking, QR generation, scanning"
```

---

## Task 3: Admin Events Pages

**Files:**
- Create: `app/(admin)/admin/evenements/page.tsx`, `app/(admin)/admin/evenements/nouveau/page.tsx`, `app/(admin)/admin/evenements/[id]/page.tsx`
- Create: `components/events/event-form.tsx`

### Admin events list page
Server component showing:
- Stats cards: total events, published, draft, total tickets sold
- Table of events: title, date, status badge, capacity, tickets sold
- Filters: status dropdown
- "Creer un evenement" button → /admin/evenements/nouveau
- Click row → /admin/evenements/[id]

### Event form component
Client component ('use client') for creating/editing events:
- Fields: title, description, location, startDate (datetime-local), endDate, capacity (number), coverImage (URL), accessLevel (select), waitlistEnabled (checkbox)
- Dynamic pricing section: add rows with targetRole + price + currency
- Default: 4 price rows (PUBLIC, FREE, PREMIUM, BUSINESS)
- Calls createEvent or updateEvent server action
- Toast on success, redirect

### Admin event detail page
Server component showing:
- Event info (title, dates, location, capacity, status)
- Action buttons: Publish (if DRAFT), Cancel
- Pricing table
- Tickets list (attendee name, status, payment)

- [ ] **Commit**

```bash
git add app/(admin)/admin/evenements/ components/events/event-form.tsx
git commit -m "feat: add admin events pages — list, create, detail with pricing"
```

---

## Task 4: Public Events Pages

**Files:**
- Create: `app/(public)/evenements/page.tsx`, `app/(public)/evenements/[slug]/page.tsx`
- Create: `components/events/event-card.tsx`, `components/events/event-pricing.tsx`

### Event card component
Props: event data. Shows:
- Cover image (or placeholder)
- Title, date, location
- Access level badge
- Price starting from (cheapest price)
- "Voir" link

### Event pricing component
Props: prices array + current user role (or 'PUBLIC')
Shows all prices with the user's price highlighted:
- "Votre prix: 25$" (emphasized)
- Other prices shown muted with role labels
- Creates "valeur percue" effect

### Public events listing
Server component:
- Fetch published events (PUBLIC access level)
- Grid of event cards
- No auth required

### Public event detail
Server component:
- Fetch event by slug
- Show full event info, pricing
- CTA: "Reserver" → if not logged in, redirect to login with callbackUrl
- If logged in as member, show member pricing

- [ ] **Commit**

```bash
git add app/(public)/evenements/ components/events/event-card.tsx components/events/event-pricing.tsx
git commit -m "feat: add public events pages with pricing display"
```

---

## Task 5: Member Events + Booking + Tickets

**Files:**
- Create: `app/(member)/evenements/page.tsx`, `app/(member)/evenements/[slug]/page.tsx`
- Create: `app/(member)/tickets/page.tsx`
- Create: `components/events/booking-button.tsx`, `components/events/ticket-card.tsx`

### Booking button component
Client component ('use client'):
- Shows price for member's tier
- "Reserver — X$" button
- Calls bookEvent server action
- On success: toast + redirect to /tickets
- On error: toast with error message
- Disabled if already booked or event full

### Ticket card component
Shows ticket info:
- Event title, date, location
- QR code (use `qrcode` npm package or display the code as text for MVP)
- Ticket status badge
- Payment amount

For QR: Install `qrcode` package for generation, or for MVP just display the hex code. The admin can scan it manually.

### Member events listing
Server component:
- Fetch published events accessible to member's tier
- Show member pricing (highlighted)
- Grid of event cards with booking availability

### Member event detail
Server component:
- Fetch event by slug
- Show full event info with member-specific pricing
- Show booking button
- If already booked: show "Deja reserve" with link to tickets

### My tickets page
Server component:
- Fetch member's tickets
- List of ticket cards with QR codes
- Grouped: upcoming vs past

- [ ] **Install qrcode package (if using)**

For MVP, displaying the QR code string is sufficient. If you want to generate actual QR images:
```bash
npm install qrcode @types/qrcode
```

- [ ] **Commit**

```bash
git add app/(member)/evenements/ app/(member)/tickets/ components/events/booking-button.tsx components/events/ticket-card.tsx
git commit -m "feat: add member events, booking, and tickets with QR codes"
```

---

## Task 6: Update Continuity Files

- [ ] **Update PROJECT_STATE.md and SESSION_LOG.md**

- [ ] **Commit**

```bash
git add PROJECT_STATE.md SESSION_LOG.md
git commit -m "docs: update project state after Plan 3A (Events)"
```

---

## Validation Criteria

| # | Criteria | How to verify |
|---|----------|---------------|
| 1 | Admin can create event with pricing | Login as admin, create event at /admin/evenements/nouveau |
| 2 | Admin can publish event | Click publish on draft event |
| 3 | Public events page shows published events | Visit /evenements (no auth) |
| 4 | Event detail shows pricing by role | Visit /evenements/[slug] |
| 5 | Member sees their price | Login as member, visit /evenements/[slug] |
| 6 | Member can book event | Click "Reserver", ticket created in DB |
| 7 | Member sees tickets | Visit /tickets, see QR code |
| 8 | Duplicate booking prevented | Try booking same event twice |
| 9 | Capacity enforced | Book until full, next attempt fails |
| 10 | Access level enforced | Premium-only event not bookable by Free member |

## Commit Strategy

```
feat: add events domain — CRUD, pricing, queries, admin queries
feat: add tickets domain — booking, QR generation, scanning
feat: add admin events pages — list, create, detail with pricing
feat: add public events pages with pricing display
feat: add member events, booking, and tickets with QR codes
docs: update project state after Plan 3A (Events)
```
