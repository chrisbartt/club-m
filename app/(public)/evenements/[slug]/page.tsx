import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getEventBySlug, getAvailableSeats } from '@/domains/events/queries'
import { EventPricing } from '@/components/events/event-pricing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

export default async function PublicEventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const event = await getEventBySlug(slug)

  if (!event || event.status !== 'PUBLISHED') {
    redirect('/evenements')
  }

  const availableSeats = await getAvailableSeats(event.id)
  const isFull = availableSeats <= 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Cover image */}
      {event.coverImage && (
        <div className="relative aspect-[2/1] overflow-hidden rounded-xl mb-8">
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
            <EventPricing prices={event.prices} userRole="PUBLIC" />

            <div className="text-sm">
              {isFull ? (
                <Badge variant="destructive">Complet</Badge>
              ) : (
                <p className="text-muted-foreground">
                  {availableSeats} places restantes
                </p>
              )}
            </div>

            <Button asChild className="w-full" disabled={isFull}>
              <Link
                href={`/login?callbackUrl=/evenements/${slug}`}
              >
                Connectez-vous pour reserver
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
