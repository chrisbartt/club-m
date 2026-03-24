import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getMemberTickets } from '@/domains/tickets/queries'
import { TicketCard } from '@/components/events/ticket-card'

export const metadata = {
  title: 'Mes tickets | Club M',
}

export default async function TicketsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })
  if (!user?.member) redirect('/')

  const tickets = await getMemberTickets(user.member.id)

  const now = new Date()
  const upcoming = tickets.filter((t) => new Date(t.event.startDate) > now)
  const past = tickets.filter((t) => new Date(t.event.startDate) <= now)

  if (tickets.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes tickets</h1>
          <p className="text-muted-foreground">
            Retrouvez vos reservations ici
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Vous n&apos;avez pas encore de tickets
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mes tickets</h1>
        <p className="text-muted-foreground">
          Retrouvez vos reservations ici
        </p>
      </div>

      {upcoming.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">A venir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Passes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
