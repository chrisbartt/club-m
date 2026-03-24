import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { OrderForBuyer } from '@/domains/orders/types'
import type { Currency, OrderStatus } from '@/lib/generated/prisma/client'

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'En attente', variant: 'secondary' },
  PAID: { label: 'Payee', variant: 'default' },
  SHIPPED: { label: 'Expediee', variant: 'outline' },
  DELIVERED: { label: 'Livree', variant: 'default' },
  COMPLETED: { label: 'Terminee', variant: 'default' },
  CANCELLED: { label: 'Annulee', variant: 'destructive' },
  REFUNDED: { label: 'Remboursee', variant: 'destructive' },
  DISPUTED: { label: 'Litige', variant: 'destructive' },
}

interface OrderCardProps {
  order: OrderForBuyer
}

export function OrderCard({ order }: OrderCardProps) {
  const symbol = CURRENCY_SYMBOLS[order.currency as Currency] ?? '$'
  const statusConfig = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING
  const productNames = order.items.map((item) => item.product.name).join(', ')
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const showCode = order.status === 'PAID' || order.status === 'SHIPPED'
  const isCompleted = order.status === 'COMPLETED'

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="font-medium leading-tight truncate">{productNames}</p>
          <Link
            href={`/annuaire/${order.business.slug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {order.business.businessName}
          </Link>
        </div>
        <Badge variant={statusConfig.variant} className="shrink-0">
          {statusConfig.label}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{orderDate}</span>
        <span className="font-semibold">
          {symbol}{Number(order.totalAmount).toLocaleString('fr-FR')}
        </span>
      </div>

      {/* Confirmation code for active orders */}
      {showCode && order.confirmationCode && (
        <div className="rounded-md bg-primary/5 border border-primary/20 p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Code de confirmation
          </p>
          <p className="text-2xl font-bold font-mono tracking-widest text-center">
            {order.confirmationCode}
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Donnez ce code au vendeur/livreur lors de la reception
          </p>
          {order.codeExpiresAt && (
            <p className="text-xs text-muted-foreground text-center">
              Expire le{' '}
              {new Date(order.codeExpiresAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      )}

      {/* Completed success message */}
      {isCompleted && (
        <div className="rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3">
          <p className="text-sm font-medium text-green-700 dark:text-green-400 text-center">
            Livraison confirmee
          </p>
        </div>
      )}
    </div>
  )
}
