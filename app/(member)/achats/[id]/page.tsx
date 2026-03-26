import { requireMember } from '@/lib/auth-guards'
import { getOrderForBuyer, getOrderTimeline } from '@/domains/orders/queries'
import { getReviewByOrder } from '@/domains/reviews/queries'
import { notFound } from 'next/navigation'
import { formatOrderNumber } from '@/lib/server-utils'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { OrderTimeline } from '@/components/orders/order-timeline'
import { ReviewForm } from '@/components/orders/review-form'
import { ReviewCard } from '@/components/orders/review-card'
import { ConfirmationCodeDisplay } from '@/components/orders/confirmation-code-display'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import type { Currency } from '@/lib/generated/prisma/client'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'En attente', className: 'bg-gray-100 text-gray-700' },
  PAID: { label: 'Payee', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expediee', className: 'bg-orange-100 text-orange-700' },
  DELIVERED: { label: 'Livree', className: 'bg-green-100 text-green-700' },
  COMPLETED: { label: 'Terminee', className: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulee', className: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Remboursee', className: 'bg-red-100 text-red-700' },
  DISPUTED: { label: 'Litige', className: 'bg-red-100 text-red-700' },
}

export default async function AchatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { member } = await requireMember()
  const order = await getOrderForBuyer(id, member.id)

  if (!order) notFound()

  const [timeline, review] = await Promise.all([
    getOrderTimeline(order.id),
    getReviewByOrder(order.id),
  ])
  const timelineEntries = timeline.map(entry => ({
    id: entry.id,
    status: entry.status,
    note: entry.note,
    createdAt: entry.createdAt.toISOString(),
  }))

  const symbol = CURRENCY_SYMBOLS[order.currency as Currency] ?? '$'
  const badge = STATUS_BADGE[order.status] ?? STATUS_BADGE.PENDING
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const hasDeliveryAddress =
    order.deliveryCommune || order.deliveryQuartier || order.deliveryAvenue

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      {/* Back link */}
      <Link
        href="/achats"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Mes achats
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{formatOrderNumber(order.id)}</h1>
          <p className="text-sm text-muted-foreground">{orderDate}</p>
        </div>
        <Badge className={badge.className}>{badge.label}</Badge>
      </div>

      {/* Confirmation code */}
      {order.confirmationCode && (
        <ConfirmationCodeDisplay
          code={order.confirmationCode}
          expiresAt={order.codeExpiresAt.toISOString()}
          status={order.status}
        />
      )}

      {/* Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {order.items.map((item) => {
              const image = (item.product.images as string[])?.[0]
              return (
                <div key={item.id} className="flex items-center gap-4 py-3">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover h-16 w-16"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                      Photo
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.product.name}
                      {item.variantLabel && (
                        <span className="text-muted-foreground font-normal"> — {item.variantLabel}</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {symbol}{Number(item.unitPrice).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <p className="font-semibold shrink-0">
                    {symbol}{(Number(item.unitPrice) * item.quantity).toLocaleString('fr-FR')}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>
                {symbol}{(Number(order.totalAmount) - Number(order.commission)).toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission</span>
              <span>{symbol}{Number(order.commission).toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-base">
              <span>Total</span>
              <span>
                {symbol}{Number(order.totalAmount).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery address */}
      {hasDeliveryAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Adresse de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {order.deliveryCommune && (
                <p>
                  <span className="text-muted-foreground">Commune :</span> {order.deliveryCommune}
                </p>
              )}
              {order.deliveryQuartier && (
                <p>
                  <span className="text-muted-foreground">Quartier :</span> {order.deliveryQuartier}
                </p>
              )}
              {order.deliveryAvenue && (
                <p>
                  <span className="text-muted-foreground">Avenue :</span> {order.deliveryAvenue}
                </p>
              )}
              {order.deliveryRepere && (
                <p>
                  <span className="text-muted-foreground">Repere :</span> {order.deliveryRepere}
                </p>
              )}
              {order.deliveryPhone && (
                <p>
                  <span className="text-muted-foreground">Telephone :</span> {order.deliveryPhone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seller info */}
      <Card>
        <CardHeader>
          <CardTitle>Vendeur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link
              href={`/boutique/${order.business.slug}`}
              className="text-sm font-medium hover:text-primary transition-colors underline underline-offset-4"
            >
              {order.business.businessName}
            </Link>
            <div className="flex gap-3">
              {order.business.whatsapp && (
                <a
                  href={`https://wa.me/${order.business.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </a>
              )}
              {order.business.phone && (
                <a
                  href={`tel:${order.business.phone}`}
                  className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  {order.business.phone}
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline timeline={timelineEntries} />
        </CardContent>
      </Card>

      {/* Review */}
      {order.status === 'DELIVERED' && !review && (
        <ReviewForm orderId={order.id} />
      )}
      {review && (
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">Votre avis</h2>
          <ReviewCard review={JSON.parse(JSON.stringify(review))} />
        </div>
      )}
    </div>
  )
}
