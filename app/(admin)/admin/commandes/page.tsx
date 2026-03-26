import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { getAdminOrders } from '@/domains/orders/queries'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { OrderStatus } from '@/lib/generated/prisma/client'

interface Props {
  searchParams: Promise<{ status?: string }>
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  PAID: 'Payee',
  SHIPPED: 'Expediee',
  DELIVERED: 'Livree',
  COMPLETED: 'Completee',
  CANCELLED: 'Annulee',
  REFUNDED: 'Remboursee',
  DISPUTED: 'Litige',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAID: 'bg-green-50 text-green-700 border-green-200',
  SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
  DELIVERED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-orange-50 text-orange-700 border-orange-200',
  DISPUTED: 'bg-rose-50 text-rose-700 border-rose-200',
}

const FILTER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'PAID', label: 'Payees' },
  { value: 'SHIPPED', label: 'Expediees' },
  { value: 'COMPLETED', label: 'Completees' },
]

const VALID_STATUSES: OrderStatus[] = [
  'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'DISPUTED',
]

export default async function AdminCommandesPage({ searchParams }: Props) {
  const params = await searchParams
  const statusFilter = VALID_STATUSES.includes(params.status as OrderStatus)
    ? (params.status as OrderStatus)
    : undefined

  const orders = await getAdminOrders(statusFilter ? { status: statusFilter } : undefined)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Supervision Commandes</h1>
          <p className="text-muted-foreground">
            {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="rounded-md bg-muted p-2 text-muted-foreground">
          <ShoppingBag className="h-6 w-6" />
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/admin/commandes">
          <Badge
            variant="outline"
            className={!statusFilter ? 'bg-primary text-primary-foreground' : 'cursor-pointer'}
          >
            Tous
          </Badge>
        </Link>
        {FILTER_STATUSES.map((s) => (
          <Link key={s.value} href={`/admin/commandes?status=${s.value}`}>
            <Badge
              variant="outline"
              className={
                statusFilter === s.value
                  ? 'bg-primary text-primary-foreground'
                  : `cursor-pointer ${STATUS_COLORS[s.value]}`
              }
            >
              {s.label}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Acheteur</TableHead>
              <TableHead>Boutique</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucune commande trouvee.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const buyerName = order.member
                  ? `${order.member.firstName} ${order.member.lastName}`
                  : order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : 'Inconnu'

                const symbol = CURRENCY_SYMBOLS[order.currency] ?? order.currency

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{buyerName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.business.businessName}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(order.totalAmount).toLocaleString('fr-FR')} {symbol}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_COLORS[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
