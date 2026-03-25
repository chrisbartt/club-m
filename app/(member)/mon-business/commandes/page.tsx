import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import {
  Eye,
  Package,
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
} from 'lucide-react'
import type { OrderStatus, Currency } from '@/lib/generated/prisma/client'

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  PENDING: {
    label: 'En attente',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  PAID: {
    label: 'Payee',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  SHIPPED: {
    label: 'Expediee',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
  },
  DELIVERED: {
    label: 'Livree',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  COMPLETED: {
    label: 'Completee',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  CANCELLED: {
    label: 'Annulee',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
  },
  REFUNDED: {
    label: 'Remboursee',
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
  },
  DISPUTED: {
    label: 'Litige',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
  },
}

export const metadata = {
  title: 'Commandes | Club M',
}

export default async function SellerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
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

  const { status, q } = await searchParams
  const statusFilter = status as OrderStatus | undefined

  // Fetch orders with phone/commune info for display
  const orders = await db.order.findMany({
    where: {
      businessId: profile.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, images: true, type: true },
          },
        },
      },
      payment: true,
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: { select: { commune: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Search filter
  const filtered = q
    ? orders.filter((o) => {
        const search = q.toLowerCase()
        const buyer = o.member ?? o.customer
        const buyerName = buyer
          ? `${buyer.firstName} ${buyer.lastName}`.toLowerCase()
          : ''
        const phone = buyer?.phone?.toLowerCase() ?? ''
        return (
          o.id.toLowerCase().includes(search) ||
          buyerName.includes(search) ||
          phone.includes(search)
        )
      })
    : orders

  // Compute stats from ALL orders (not filtered)
  const allOrders = await db.order.groupBy({
    by: ['status'],
    where: { businessId: profile.id },
    _count: true,
  })

  const totalCount = allOrders.reduce((sum, g) => sum + g._count, 0)
  const pendingCount =
    allOrders.find((g) => g.status === 'PENDING')?._count ?? 0
  const shippedCount =
    (allOrders.find((g) => g.status === 'SHIPPED')?._count ?? 0) +
    (allOrders.find((g) => g.status === 'PAID')?._count ?? 0)
  const completedCount =
    allOrders.find((g) => g.status === 'COMPLETED')?._count ?? 0

  const stats = [
    {
      label: 'Total commandes',
      value: totalCount,
      icon: ShoppingBag,
      color: 'text-white',
      bgIcon: 'bg-white/[0.06]',
      filterValue: '',
    },
    {
      label: 'En attente',
      value: pendingCount,
      icon: Clock,
      color: 'text-amber-400',
      bgIcon: 'bg-amber-500/10',
      filterValue: 'PENDING',
    },
    {
      label: 'A livrer',
      value: shippedCount,
      icon: Truck,
      color: 'text-purple-400',
      bgIcon: 'bg-purple-500/10',
      filterValue: 'SHIPPED',
    },
    {
      label: 'Completees',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgIcon: 'bg-emerald-500/10',
      filterValue: 'COMPLETED',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Commandes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suivez et gerez vos commandes
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isActive = (status ?? '') === stat.filterValue
          return (
            <Link
              key={stat.label}
              href={
                stat.filterValue
                  ? `/mon-business/commandes?status=${stat.filterValue}`
                  : '/mon-business/commandes'
              }
              className={`group relative rounded-xl border p-4 transition-all hover:border-white/[0.12] ${
                isActive
                  ? 'border-[#8b5cf6]/40 bg-[#8b5cf6]/5'
                  : 'border-white/[0.06] bg-[#1a1a24]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgIcon}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-4">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Rechercher par ID, client, telephone..."
              className="h-10 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:border-[#8b5cf6]/50 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50"
            />
          </div>
          <select
            name="status"
            defaultValue={status ?? ''}
            className="h-10 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white focus:border-[#8b5cf6]/50 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="PAID">Payee</option>
            <option value="SHIPPED">Expediee</option>
            <option value="DELIVERED">Livree</option>
            <option value="COMPLETED">Completee</option>
            <option value="CANCELLED">Annulee</option>
          </select>
          <button
            type="submit"
            className="h-10 rounded-lg bg-[#8b5cf6] px-5 text-sm font-medium text-white transition-colors hover:bg-[#7c3aed]"
          >
            Filtrer
          </button>
        </form>
      </div>

      {/* Orders table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#1a1a24] py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
            <Package className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Aucune commande
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {q || status
              ? 'Essayez de modifier vos filtres'
              : 'Vos commandes apparaitront ici'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#1a1a24]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Commande
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Client
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Montant
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((order) => {
                const buyer = order.member ?? order.customer
                const buyerName = buyer
                  ? `${buyer.firstName} ${buyer.lastName}`
                  : 'Client inconnu'
                const buyerPhone = buyer?.phone ?? null
                const buyerCommune =
                  order.customer?.address?.commune ?? null
                const symbol =
                  CURRENCY_SYMBOLS[order.currency as Currency] ?? '$'
                const total = Number(order.totalAmount)
                const cfg = STATUS_CONFIG[order.status] ?? {
                  label: order.status,
                  bg: 'bg-gray-500/10',
                  text: 'text-gray-400',
                }
                const date = new Date(order.createdAt)

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-white">{buyerName}</p>
                        {buyerPhone && (
                          <p className="text-xs text-muted-foreground">
                            {buyerPhone}
                          </p>
                        )}
                        {buyerCommune && (
                          <p className="text-[11px] text-muted-foreground/60">
                            {buyerCommune}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-semibold text-white">
                        {total.toLocaleString('fr-FR')}
                        {symbol}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {date.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}{' '}
                      <span className="text-muted-foreground/60">
                        {date.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/mon-business/commandes/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-white"
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
