import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getBusinessClients } from '@/domains/business/dashboard-queries'
import { Users, UserCheck, ShoppingCart, Crown, Search, Eye, Phone } from 'lucide-react'

export const metadata = {
  title: 'Clients | Club M',
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-violet-500/15 text-violet-400',
    'bg-rose-500/15 text-rose-400',
    'bg-amber-500/15 text-amber-400',
    'bg-emerald-500/15 text-emerald-400',
    'bg-cyan-500/15 text-cyan-400',
    'bg-pink-500/15 text-pink-400',
    'bg-indigo-500/15 text-indigo-400',
    'bg-orange-500/15 text-orange-400',
    'bg-teal-500/15 text-teal-400',
    'bg-fuchsia-500/15 text-fuchsia-400',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function relativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `Il y a ${weeks} sem.`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `Il y a ${months} mois`
  }
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })
  if (!user?.member) redirect('/')

  const profile = await db.businessProfile.findUnique({
    where: { memberId: user.member.id },
  })

  if (!profile || profile.profileType !== 'STORE') {
    redirect('/mon-business')
  }

  const clients = await getBusinessClients(profile.id)
  const { q } = await searchParams

  // Search filter
  const filtered = q
    ? clients.filter((c) => {
        const search = q.toLowerCase()
        return (
          c.name.toLowerCase().includes(search) ||
          (c.phone && c.phone.includes(search)) ||
          (c.email && c.email.toLowerCase().includes(search))
        )
      })
    : clients

  // Stats
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const totalClients = clients.length
  const activeClients = clients.filter(
    (c) => c.lastOrder >= thirtyDaysAgo,
  ).length
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgBasket =
    totalClients > 0 ? Math.round(totalRevenue / clients.reduce((sum, c) => sum + c.orderCount, 0)) : 0
  const bestClient = clients.length > 0 ? clients[0] : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Clients</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {totalClients}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez votre base client
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total clients
              </p>
              <p className="text-lg font-bold text-foreground">{totalClients}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserCheck className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Clients actifs
              </p>
              <p className="text-lg font-bold text-foreground">{activeClients}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              <ShoppingCart className="h-4.5 w-4.5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Panier moyen
              </p>
              <p className="text-lg font-bold text-foreground">
                {avgBasket.toLocaleString('fr-FR')}$
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10">
              <Crown className="h-4.5 w-4.5 text-rose-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Meilleur client
              </p>
              <p className="truncate text-sm font-bold text-foreground">
                {bestClient ? bestClient.name : '-'}
              </p>
              {bestClient && (
                <p className="text-[11px] text-muted-foreground">
                  {bestClient.totalSpent.toLocaleString('fr-FR')}$
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <form>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Rechercher par nom, telephone, email..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </form>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
          <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {q ? 'Aucun client ne correspond a votre recherche.' : 'Aucun client pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Client
                </th>
                <th className="hidden px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                  Commune
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Commandes
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Total depense
                </th>
                <th className="hidden px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                  Derniere commande
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((client) => {
                const initials = client.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
                const avatarColor = getAvatarColor(client.name)

                return (
                  <tr
                    key={`${client.type}:${client.id}`}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {client.name}
                          </p>
                          {client.phone && (
                            <a
                              href={`tel:${client.phone}`}
                              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Phone className="h-2.5 w-2.5" />
                              {client.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-muted-foreground md:table-cell">
                      {client.commune ?? '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right text-foreground">
                      {client.orderCount}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-foreground">
                      {client.totalSpent.toLocaleString('fr-FR')}$
                    </td>
                    <td className="hidden px-5 py-3.5 text-right text-muted-foreground lg:table-cell">
                      {relativeDate(client.lastOrder)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/mon-business/clients/${client.type}_${client.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Voir
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
