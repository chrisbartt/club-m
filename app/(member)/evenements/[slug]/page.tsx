import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getEventBySlug, getAvailableSeats } from '@/domains/events/queries'
import { hasTicketForEvent } from '@/domains/tickets/queries'
import { hasMinTier } from '@/lib/permissions'
import { EventPricing } from '@/components/events/event-pricing'
import { BookingButton } from '@/components/events/booking-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MemberTier, EventAccessLevel, PricingRole, EventPrice } from '@/lib/generated/prisma/client'

function canAccessEvent(accessLevel: EventAccessLevel, tier: MemberTier): boolean {
  if (accessLevel === 'PUBLIC') return true
  if (accessLevel === 'MEMBERS_ONLY') return true
  if (accessLevel === 'PREMIUM_ONLY') return hasMinTier(tier, 'PREMIUM')
  if (accessLevel === 'BUSINESS_ONLY') return tier === 'BUSINESS'
  return false
}

function tierToPricingRole(tier: MemberTier): PricingRole {
  return tier as PricingRole
}

function resolvePrice(prices: EventPrice[], role: PricingRole): EventPrice | null {
  return prices.find((p) => p.targetRole === role) ?? prices.find((p) => p.targetRole === 'PUBLIC') ?? null
}

function requiredTierLabel(accessLevel: EventAccessLevel): string {
  if (accessLevel === 'PREMIUM_ONLY') return 'Premium'
  if (accessLevel === 'BUSINESS_ONLY') return 'Business'
  return ''
}

function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(new Date(date))
    .replace(':', 'h')
}

export default async function MemberEventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })
  if (!user?.member) redirect('/')

  const event = await getEventBySlug(slug)
  if (!event || event.status !== 'PUBLISHED') {
    redirect('/evenements')
  }

  const member = user.member
  const hasAccess = canAccessEvent(event.accessLevel, member.tier)

  // If no access, show upgrade prompt
  if (!hasAccess) {
    const label = requiredTierLabel(event.accessLevel)
    return (
      <div className="mx-auto max-w-2xl space-y-6 text-center py-12">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="text-muted-foreground">
          Cet evenement est reserve aux membres {label}
        </p>
        <Button asChild>
          <Link href="/upgrade">Passer a {label}</Link>
        </Button>
      </div>
    )
  }

  const pricingRole = tierToPricingRole(member.tier)
  const memberPrice = resolvePrice(event.prices, pricingRole)
  const availableSeats = await getAvailableSeats(event.id)
  const isFull = availableSeats <= 0
  const alreadyBooked = await hasTicketForEvent(member.id, event.id)

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Cover image */}
      {event.coverImage && (
        <div className="relative aspect-[2/1] overflow-hidden rounded-xl">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{formatDateFr(event.startDate)}</span>
              {event.endDate && (
                <>
                  <span>—</span>
                  <span>{formatDateFr(event.endDate)}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Lieu :</span>
            <span className="text-muted-foreground">{event.location}</span>
          </div>

          {event.description && (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {event.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Capacite :</span>
            <span className="text-muted-foreground">
              {event.capacity} places
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border p-6 space-y-4">
            <EventPricing prices={event.prices} userRole={pricingRole} />

            <div className="text-sm">
              {isFull ? (
                <Badge variant="destructive">Complet</Badge>
              ) : (
                <p className="text-muted-foreground">
                  {availableSeats} places restantes
                </p>
              )}
            </div>

            {alreadyBooked ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-600 text-center">
                  Vous avez deja reserve
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/tickets">Voir mes tickets</Link>
                </Button>
              </div>
            ) : memberPrice ? (
              <BookingButton
                eventSlug={event.slug}
                price={Number(memberPrice.price)}
                currency={memberPrice.currency}
                disabled={isFull}
                disabledReason={isFull ? 'Cet evenement est complet' : undefined}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Aucun tarif disponible
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
