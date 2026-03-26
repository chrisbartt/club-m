'use client'

import Link from 'next/link'

interface OrderRow {
  id: string
  buyerName: string
  buyerPhone: string | null
  buyerCommune: string | null
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
      return { label: status, classes: 'bg-muted text-muted-foreground border-border' }
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
          <tr className="border-b border-border">
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Client
            </th>
            <th className="hidden pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
              Commune
            </th>
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Montant
            </th>
            <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Statut
            </th>
            <th className="hidden pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            return (
              <tr key={order.id} className="group transition-colors hover:bg-muted/50">
                <td className="py-3 pr-4">
                  <Link
                    href={`/mon-business/commandes/${order.id}`}
                    className="block"
                  >
                    <p className="font-medium text-foreground group-hover:text-purple-400 transition-colors">
                      {order.buyerName}
                    </p>
                    {order.buyerPhone && (
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        {order.buyerPhone}
                      </p>
                    )}
                  </Link>
                </td>
                <td className="hidden py-3 pr-4 sm:table-cell">
                  {order.buyerCommune ? (
                    <span className="text-[12px] text-muted-foreground">
                      {order.buyerCommune}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-foreground">--</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/mon-business/commandes/${order.id}`}
                    className="font-medium text-foreground"
                  >
                    {formatCurrency(order.amount)}
                  </Link>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusConfig.classes}`}
                  >
                    {statusConfig.label}
                  </span>
                </td>
                <td className="hidden py-3 pr-4 text-[13px] text-muted-foreground md:table-cell">
                  {order.date}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
