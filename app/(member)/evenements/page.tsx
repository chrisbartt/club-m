import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPublishedEvents } from '@/domains/events/queries'
import { hasMinTier } from '@/lib/permissions'
import { EventCard } from '@/components/events/event-card'
import type { MemberTier, EventAccessLevel } from '@/lib/generated/prisma/client'

function canAccessEvent(accessLevel: EventAccessLevel, tier: MemberTier): boolean {
  if (accessLevel === 'PUBLIC') return true
  if (accessLevel === 'MEMBERS_ONLY') return true
  if (accessLevel === 'PREMIUM_ONLY') return hasMinTier(tier, 'PREMIUM')
  if (accessLevel === 'BUSINESS_ONLY') return tier === 'BUSINESS'
  return false
}

export const metadata = {
  title: 'Evenements | Club M',
}

export default async function MemberEventsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })
  if (!user?.member) redirect('/')

  const allEvents = await getPublishedEvents()
  const events = allEvents.filter((e) => canAccessEvent(e.accessLevel, user.member!.tier))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Evenements</h1>
        <p className="text-muted-foreground">
          Decouvrez et reservez les evenements accessibles avec votre abonnement
        </p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Aucun evenement disponible pour le moment
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
