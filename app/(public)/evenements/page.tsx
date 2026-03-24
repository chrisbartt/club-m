import Link from 'next/link'
import { getPublishedEvents } from '@/domains/events/queries'
import { EventCard } from '@/components/events/event-card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Evenements | Club M',
  description: 'Decouvrez les evenements Club M',
}

export default async function PublicEventsPage() {
  const allEvents = await getPublishedEvents()
  const events = allEvents.filter((e) => e.accessLevel === 'PUBLIC')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Evenements</h1>
        <p className="text-muted-foreground">
          Decouvrez nos prochains evenements et rejoignez la communaute
        </p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Aucun evenement pour le moment
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-lg bg-primary/5 border border-primary/20 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Acces exclusif aux evenements prives
        </h2>
        <p className="text-muted-foreground mb-4">
          Rejoignez Club M pour des prix exclusifs et des evenements reserves
          aux membres
        </p>
        <Button asChild>
          <Link href="/register">Rejoindre Club M</Link>
        </Button>
      </div>
    </div>
  )
}
