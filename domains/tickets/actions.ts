'use server'

import crypto from 'crypto'
import { db } from '@/lib/db'
import { requireAuth, requireAdmin } from '@/lib/auth-guards'
import { hasMinTier } from '@/lib/permissions'
import { createAuditLog } from '@/domains/audit/actions'
import { getEventBySlug, getAvailableSeats } from '@/domains/events/queries'
import { sendTicketConfirmationEmail } from '@/lib/email'
import { hasTicketForEvent } from './queries'
import type { MemberTier, PricingRole, EventPrice } from '@/lib/generated/prisma/client'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function resolvePrice(
  prices: EventPrice[],
  userRole: PricingRole
): EventPrice | null {
  const exact = prices.find((p) => p.targetRole === userRole)
  if (exact) return exact
  return prices.find((p) => p.targetRole === 'PUBLIC') ?? null
}

function tierToPricingRole(tier: MemberTier): PricingRole {
  return tier as PricingRole // FREE, PREMIUM, BUSINESS map directly
}

function canAccessEvent(
  accessLevel: string,
  memberTier: MemberTier | null
): boolean {
  if (accessLevel === 'PUBLIC') return true
  if (!memberTier) return false
  if (accessLevel === 'MEMBERS_ONLY') return true
  if (accessLevel === 'PREMIUM_ONLY') return hasMinTier(memberTier, 'PREMIUM')
  if (accessLevel === 'BUSINESS_ONLY') return memberTier === 'BUSINESS'
  return false
}

export async function bookEvent(
  eventSlug: string
): Promise<ActionResult<{ ticketId: string; qrCode: string }>> {
  try {
    const user = await requireAuth()

    const event = await getEventBySlug(eventSlug)
    if (!event || event.status !== 'PUBLISHED') {
      return { success: false, error: 'EVENT_NOT_BOOKABLE' }
    }

    // Determine user's tier and pricing role
    const memberTier = user.member?.tier ?? null
    const pricingRole: PricingRole = memberTier
      ? tierToPricingRole(memberTier)
      : 'PUBLIC'

    // Access check
    if (!canAccessEvent(event.accessLevel, memberTier)) {
      return { success: false, error: 'INSUFFICIENT_TIER' }
    }

    // Available seats
    const seats = await getAvailableSeats(event.id)
    if (seats <= 0) {
      return { success: false, error: 'EVENT_FULL' }
    }

    // Duplicate check for members
    if (user.member) {
      const alreadyBooked = await hasTicketForEvent(user.member.id, event.id)
      if (alreadyBooked) {
        return { success: false, error: 'ALREADY_BOOKED' }
      }
    }

    // Price resolution
    const priceRecord = resolvePrice(event.prices, pricingRole)
    if (!priceRecord) {
      return { success: false, error: 'NO_PRICE_AVAILABLE' }
    }

    const qrCode = crypto.randomBytes(16).toString('hex')

    // Create ticket + payment in transaction
    const ticket = await db.$transaction(async (tx) => {
      const newTicket = await tx.ticket.create({
        data: {
          eventId: event.id,
          memberId: user.member?.id ?? null,
          customerId: user.customer?.id ?? null,
          qrCode,
          status: 'PAID', // MVP: simulated payment
        },
      })

      await tx.payment.create({
        data: {
          amount: priceRecord.price,
          currency: priceRecord.currency,
          status: 'SUCCESS',
          provider: 'LOCAL_FINTECH',
          ticketId: newTicket.id,
        },
      })

      return newTicket
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TICKET_BOOKED',
      entity: 'Ticket',
      entityId: ticket.id,
      details: {
        eventId: event.id,
        eventTitle: event.title,
      },
    })

    // Send ticket confirmation email
    try {
      const buyerName = user.member?.firstName ?? user.customer?.firstName ?? 'Participant'
      await sendTicketConfirmationEmail(user.email, buyerName, {
        title: event.title,
        date: event.startDate.toLocaleDateString('fr-FR', { dateStyle: 'long' }),
        location: event.location,
      })
    } catch (e) {
      console.error('Ticket confirmation email failed:', e)
    }

    return { success: true, data: { ticketId: ticket.id, qrCode } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function scanTicket(
  qrCode: string
): Promise<ActionResult<{ attendeeName: string; eventTitle: string }>> {
  try {
    const { user } = await requireAdmin()

    const ticket = await db.ticket.findUnique({
      where: { qrCode },
      include: {
        event: { select: { title: true } },
        member: { select: { firstName: true, lastName: true } },
        customer: { select: { firstName: true, lastName: true } },
      },
    })

    if (!ticket) {
      return { success: false, error: 'TICKET_NOT_FOUND' }
    }

    if (ticket.status === 'USED') {
      return { success: false, error: 'TICKET_ALREADY_USED' }
    }

    if (ticket.status !== 'PAID') {
      return { success: false, error: 'TICKET_NOT_VALID' }
    }

    await db.ticket.update({
      where: { id: ticket.id },
      data: { status: 'USED', scannedAt: new Date() },
    })

    const attendee = ticket.member ?? ticket.customer
    const attendeeName = attendee
      ? `${attendee.firstName} ${attendee.lastName}`
      : 'Inconnu'

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'TICKET_SCANNED',
      entity: 'Ticket',
      entityId: ticket.id,
      details: {
        eventTitle: ticket.event.title,
        attendeeName,
      },
    })

    return {
      success: true,
      data: { attendeeName, eventTitle: ticket.event.title },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
