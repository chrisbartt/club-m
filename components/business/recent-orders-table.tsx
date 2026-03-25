'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'

interface OrderRow {
  id: string
  buyerName: string
  buyerEmail: string | null
  amount: number
  status: string
  date: string
}

interface RecentOrdersTableProps {
  orders: OrderRow[]
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('fr-FR') + ' $US'
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'PAID':
      return { label: 'Payée', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
    case 'PENDING':
      return { label: 'En attente', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    case 'SHIPPED':
      return { label: 'Expédiée', classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
    case 'DELIVERED':
      return { label: 'Livrée', classes: 'bg-green-500/10 text-green-400 border-green-500/20' }
    case 'COMPLETED':
      return { label: 'Complétée', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
    case 'CANCELLED':
      return { label: 'Annulée', classes: 'bg-red-500/10 text-red-400 border-red-500/20' }
    default:
      return { label: status, classes: 'bg-white/5 text-muted-foreground border-white/10' }
  }
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aucune commande pour le moment.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Client
            </th>
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Montant
            </th>
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Statut
            </th>
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Date
            </th>
            <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            return (
              <tr key={order.id} className="group transition-colors hover:bg-white/[0.02]">
                <td className="py-3 pr-4">
                  <p className="font-medium text-white">{order.buyerName}</p>
                  {order.buyerEmail && (
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {order.buyerEmail}
                    </p>
                  )}
                </td>
                <td className="py-3 pr-4 font-medium text-white">
                  {formatCurrency(order.amount)}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusConfig.classes}`}
                  >
                    {statusConfig.label}
                  </span>
                </td>
                <td className="py-3 pr-4 text-[13px] text-muted-foreground">
                  {order.date}
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/mon-business/commandes/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-purple-400 transition-colors hover:text-purple-300"
                  >
                    <Eye size={14} />
                    Voir
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
