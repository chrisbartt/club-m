import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getOrderById } from '@/domains/orders/queries'
import { CURRENCY_SYMBOLS, COMMISSION_RATE } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShipOrderButton } from '@/components/orders/ship-order-button'
import { ConfirmDeliveryForm } from '@/components/orders/confirm-delivery-form'
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

export const metadata = {
  title: 'Detail commande | Club M',
}

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: orderId } = await params

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
  if (!profile) redirect('/mon-business')

  const order = await getOrderById(orderId)
  if (!order) notFound()

  // Verify ownership
  if (order.businessId !== profile.id) {
    redirect('/mon-business/commandes')
  }

  // Get buyer info separately
  const fullOrder = await db.order.findUnique({
    where: { id: orderId },
    include: {
      member: {
        select: {
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
      customer: {
        select: {
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
    },
  })

  const buyer = fullOrder?.member ?? fullOrder?.customer
  const buyerName = buyer
    ? `${buyer.firstName} ${buyer.lastName}`
    : 'Client inconnu'
  const buyerEmail = buyer?.user.email ?? null

  const symbol = CURRENCY_SYMBOLS[order.currency as Currency] ?? '$'
  const total = Number(order.totalAmount)
  const commission = Number(order.commission)
  const netAmount = total - commission

  return (
    <div className="space-y-6">
      <Link
        href="/mon-business/commandes"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Mes commandes
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Commande</h1>
        <Badge variant="outline">
          {STATUS_LABELS[order.status] ?? order.status}
        </Badge>
      </div>

      {/* Buyer info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acheteur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-medium">{buyerName}</p>
          {buyerEmail && (
            <p className="text-sm text-muted-foreground">{buyerEmail}</p>
          )}
        </CardContent>
      </Card>

      {/* Items table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Quantite</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Sous-total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => {
                const unitPrice = Number(item.unitPrice)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {unitPrice.toLocaleString('fr-FR')}{symbol}
                    </TableCell>
                    <TableCell className="text-right">
                      {(unitPrice * item.quantity).toLocaleString('fr-FR')}{symbol}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="mt-4 space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{total.toLocaleString('fr-FR')}{symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Commission Club M ({(COMMISSION_RATE * 100).toFixed(0)}%)
              </span>
              <span className="text-muted-foreground">
                -{commission.toLocaleString('fr-FR')}{symbol}
              </span>
            </div>
            <div className="flex justify-between border-t pt-1 font-semibold">
              <span>Montant net</span>
              <span>{netAmount.toLocaleString('fr-FR')}{symbol}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline / Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statut</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Commande passee le{' '}
            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          {order.status === 'PAID' && (
            <div className="pt-2">
              <ShipOrderButton orderId={order.id} />
            </div>
          )}

          {order.status === 'SHIPPED' && (
            <div className="pt-2">
              <p className="mb-3 text-sm">
                Commande expediee. Entrez le code de confirmation de l&apos;acheteur
                pour finaliser la livraison.
              </p>
              <ConfirmDeliveryForm orderId={order.id} />
            </div>
          )}

          {order.status === 'COMPLETED' && (
            <div className="rounded-lg bg-green-500/10 px-4 py-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Livraison confirmee
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
