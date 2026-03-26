import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getBusinessClientDetail } from '@/domains/business/dashboard-queries'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Star,
  Eye,
  Package,
} from 'lucide-react'

export const metadata = {
  title: 'Detail client | Club M',
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'En attente', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  PAID: { label: 'Payee', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  SHIPPED: { label: 'Expediee', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  DELIVERED: { label: 'Livree', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  COMPLETED: { label: 'Completee', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  CANCELLED: { label: 'Annulee', bg: 'bg-red-500/10', text: 'text-red-400' },
  REFUNDED: { label: 'Remboursee', bg: 'bg-gray-500/10', text: 'text-gray-400' },
  DISPUTED: { label: 'Litige', bg: 'bg-orange-500/10', text: 'text-orange-400' },
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

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
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

  const { id: rawId } = await params

  // Parse the composite ID: "member_xxx" or "customer_xxx"
  const underscoreIdx = rawId.indexOf('_')
  if (underscoreIdx === -1) notFound()

  const clientType = rawId.slice(0, underscoreIdx) as 'member' | 'customer'
  const clientId = rawId.slice(underscoreIdx + 1)

  if (clientType !== 'member' && clientType !== 'customer') notFound()

  const client = await getBusinessClientDetail(profile.id, clientId, clientType)
  if (!client) notFound()

  const initials = client.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const avatarColor = getAvatarColor(client.name)

  // WhatsApp link
  const whatsappPhone = client.phone
    ? client.phone.replace(/[^0-9+]/g, '').replace(/^\+/, '')
    : null
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}`
    : null

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/mon-business/clients"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Clients
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-sm font-medium text-foreground">{client.name}</span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-8">
          {/* Order history card */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Historique des commandes
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {client.orderCount} commande{client.orderCount !== 1 ? 's' : ''}
              </span>
            </div>

            {client.orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Aucune commande.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Commande
                      </th>
                      <th className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Produits
                      </th>
                      <th className="px-5 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Montant
                      </th>
                      <th className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Statut
                      </th>
                      <th className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Date
                      </th>
                      <th className="px-5 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">

                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {client.orders.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] ?? {
                        label: order.status,
                        bg: 'bg-gray-500/10',
                        text: 'text-gray-400',
                      }
                      const productSummary = order.items
                        .map(
                          (item) =>
                            `${item.product.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`,
                        )
                        .join(', ')

                      return (
                        <tr
                          key={order.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="px-5 py-3">
                            <span className="font-mono text-xs text-muted-foreground">
                              #{order.id.slice(-8)}
                            </span>
                          </td>
                          <td className="max-w-[200px] truncate px-5 py-3 text-foreground">
                            {productSummary}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold text-foreground">
                            {order.totalAmount.toLocaleString('fr-FR')}$
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}
                            >
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(
                              'fr-FR',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              href={`/mon-business/commandes/${order.id}`}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Eye className="h-3 w-3" />
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

          {/* Statistics card */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Statistiques</h2>
            </div>

            <div className="grid grid-cols-2 gap-px bg-muted/50 sm:grid-cols-4">
              <div className="bg-card p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Panier moyen
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {client.averageBasket.toLocaleString('fr-FR')}$
                </p>
              </div>
              <div className="bg-card p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Frequence d&apos;achat
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {client.avgDaysBetweenOrders !== null
                    ? `${client.avgDaysBetweenOrders}j`
                    : '-'}
                </p>
                {client.avgDaysBetweenOrders !== null && (
                  <p className="text-[11px] text-muted-foreground">
                    entre commandes
                  </p>
                )}
              </div>
              <div className="bg-card p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Premiere commande
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {new Date(client.firstOrder).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="bg-card p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Derniere commande
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {new Date(client.lastOrder).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Favorite products */}
            {client.favoriteProducts.length > 0 && (
              <div className="border-t border-border px-5 py-4">
                <div className="mb-3 flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Produits preferes
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {client.favoriteProducts.map((product) => (
                    <span
                      key={product.name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs text-foreground"
                    >
                      {product.name}
                      <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        x{product.count}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-4">
          {/* Client info card */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                Informations client
              </h2>
            </div>
            <div className="px-5 py-5">
              {/* Avatar + Name */}
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColor}`}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {client.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Client {clientType === 'member' ? 'membre' : 'externe'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <a
                      href={`tel:${client.phone}`}
                      className="text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <a
                      href={`mailto:${client.email}`}
                      className="truncate text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {client.email}
                    </a>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-sm text-foreground">{client.address}</p>
                  </div>
                )}
              </div>

              {/* WhatsApp button */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-emerald-500"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contacter sur WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Summary card */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Resume</h2>
            </div>
            <div className="px-5 py-5">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Total depense
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-foreground">
                    {client.totalSpent.toLocaleString('fr-FR')}$
                  </p>
                </div>

                <div className="h-px bg-muted" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Commandes
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-foreground">
                      {client.orderCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Panier moyen
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-foreground">
                      {client.averageBasket.toLocaleString('fr-FR')}$
                    </p>
                  </div>
                </div>

                <div className="h-px bg-muted" />

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Derniere commande
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {new Date(client.lastOrder).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Client depuis
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {new Date(client.firstOrder).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
