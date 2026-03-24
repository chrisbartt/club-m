import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { OrderForSeller } from '@/domains/orders/types'
import type { Currency } from '@/lib/generated/prisma/client'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payee',
  SHIPPED: 'Expediee',
  DELIVERED: 'Livree',
  COMPLETED: 'Completee',
  CANCELLED: 'Annulee',
  REFUNDED: 'Remboursee',
  DISPUTED: 'Litige',
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  PAID: 'secondary',
  SHIPPED: 'default',
  DELIVERED: 'default',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
  DISPUTED: 'destructive',
}

interface SellerOrderCardProps {
  order: OrderForSeller
}

export function SellerOrderCard({ order }: SellerOrderCardProps) {
  const buyer = order.member ?? order.customer
  const buyerName = buyer
    ? `${buyer.firstName} ${buyer.lastName}`
    : 'Client inconnu'

  const symbol = CURRENCY_SYMBOLS[order.currency as Currency] ?? '$'
  const total = Number(order.totalAmount)

  return (
    <Link href={`/mon-business/commandes/${order.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{buyerName}</p>
              <Badge variant={STATUS_VARIANTS[order.status] ?? 'outline'}>
                {STATUS_LABELS[order.status] ?? order.status}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              {order.items.map((item) => (
                <span key={item.id}>
                  {item.product.name} x{item.quantity}
                </span>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-lg font-semibold">
              {total.toLocaleString('fr-FR')}{symbol}
            </p>

            {order.status === 'PAID' && (
              <span className="text-xs text-primary">
                Marquer comme expediee &rarr;
              </span>
            )}
            {order.status === 'SHIPPED' && (
              <span className="text-xs text-muted-foreground">
                En attente de confirmation
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
