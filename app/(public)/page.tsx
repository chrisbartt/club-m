import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { getPublishedEvents } from '@/domains/events/queries'
import { getPublicProfiles } from '@/domains/directory/queries'
import { EventCard } from '@/components/events/event-card'
import { BusinessCard } from '@/components/directory/business-card'

export default async function HomePage() {
  const [membersCount, eventsCount, businessCount, events, profiles] = await Promise.all([
    db.member.count(),
    db.event.count({ where: { status: 'PUBLISHED' } }),
    db.businessProfile.count({ where: { isPublished: true, isApproved: true } }),
    getPublishedEvents(),
    getPublicProfiles(),
  ])

  const featuredEvents = events.slice(0, 3)
  const featuredProfiles = profiles.slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center md:py-32">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Club M</h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            La communaute des femmes entrepreneures a Kinshasa. Rejoignez un reseau de femmes
            ambitieuses qui transforment le paysage entrepreneurial.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Rejoindre Club M</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/annuaire">Decouvrir</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50 py-16">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">{membersCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Membres</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">{eventsCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Evenements</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">{businessCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Entreprises</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="container py-16 md:py-24">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Evenements a venir</h2>
              <p className="mt-2 text-muted-foreground">
                Participez a nos prochains evenements
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/evenements">Voir tout</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Businesses */}
      {featuredProfiles.length > 0 && (
        <section className="container py-16 md:py-24 border-t">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Annuaire</h2>
              <p className="mt-2 text-muted-foreground">
                Decouvrez les entreprises de nos membres
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/annuaire">Voir tout</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProfiles.map((profile) => (
              <BusinessCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t bg-muted/50 py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Rejoignez la communaute
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Faites partie d&apos;un reseau dynamique de femmes entrepreneures. Acces aux
            evenements, a l&apos;annuaire et aux opportunites d&apos;affaires.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/register">Creer mon compte</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
