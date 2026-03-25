import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getSellerOrders } from '@/domains/orders/queries'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { Eye, Package, Search } from 'lucide-react'
import type { OrderStatus, Currency } from '@/lib/generated/prisma/client'

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
  const orders = await getSellerOrders(profile.id, statusFilter)

  // Client-side search filter
  const filtered = q
    ? orders.filter((o) => {
        const search = q.toLowerCase()
        const buyer = o.member ?? o.customer
        const buyerName = buyer
          ? `${buyer.firstName} ${buyer.lastName}`.toLowerCase()
          : ''
        return (
          o.id.toLowerCase().includes(search) || buyerName.includes(search)
        )
      })
    : orders

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Commandes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suivez et gerez toutes les commandes
        </p>
      </div>

      {/* Filter bar */}
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="ID, nom du client..."
            className="h-10 w-full rounded-lg border border-white/[0.06] bg-[#1a1a24] pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:border-[#8b5cf6]/50 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? ''}
          className="h-10 rounded-lg border border-white/[0.06] bg-[#1a1a24] px-3 text-sm text-white focus:border-[#8b5cf6]/50 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50"
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

      {/* Orders table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#1a1a24] py-16">
          <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Aucune commande pour le moment.
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
                const symbol =
                  CURRENCY_SYMBOLS[order.currency as Currency] ?? '$'
                const total = Number(order.totalAmount)
                const cfg = STATUS_CONFIG[order.status] ?? {
                  label: order.status,
                  bg: 'bg-gray-500/10',
                  text: 'text-gray-400',
                }

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-white">
                        {buyerName}
                      </span>
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
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
