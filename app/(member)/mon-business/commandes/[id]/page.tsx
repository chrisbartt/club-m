import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getOrderById } from '@/domains/orders/queries'
import { CURRENCY_SYMBOLS, COMMISSION_RATE } from '@/lib/constants'
import { ShipOrderButton } from '@/components/orders/ship-order-button'
import { ConfirmDeliveryForm } from '@/components/orders/confirm-delivery-form'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Truck,
} from 'lucide-react'
import type { Currency } from '@/lib/generated/prisma/client'

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

const STATUS_ORDER = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED']

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

  const statusCfg = STATUS_CONFIG[order.status] ?? {
    label: order.status,
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
  }

  // Timeline step index
  const currentStep = STATUS_ORDER.indexOf(order.status)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="space-y-1">
        <Link
          href="/mon-business/commandes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Commandes
        </Link>
        <h1 className="text-2xl font-bold text-white">Detail commande</h1>
      </div>

      {/* Top two-column layout */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recapitulatif - 2/3 */}
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Recapitulatif</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                ID commande
              </span>
              <span className="font-mono text-sm text-white">
                #{order.id.slice(-8)}
              </span>
            </div>
            <div className="border-t border-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-sm font-semibold text-white">
                {total.toLocaleString('fr-FR')}
                {symbol}
              </span>
            </div>
            <div className="border-t border-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Commission ({(COMMISSION_RATE * 100).toFixed(0)}%)
              </span>
              <span className="text-sm text-muted-foreground">
                -{commission.toLocaleString('fr-FR')}
                {symbol}
              </span>
            </div>
            <div className="border-t border-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Montant net
              </span>
              <span className="text-sm font-semibold text-emerald-400">
                {netAmount.toLocaleString('fr-FR')}
                {symbol}
              </span>
            </div>
            <div className="border-t border-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Statut</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusCfg.bg} ${statusCfg.text}`}
              >
                {statusCfg.label}
              </span>
            </div>
            <div className="border-t border-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm text-white">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="border-t border-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Code confirmation
              </span>
              <span className="font-mono text-sm text-white">
                {order.confirmationCode}
              </span>
            </div>
          </div>
        </div>

        {/* Client - 1/3 */}
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
          <h2 className="text-lg font-semibold text-white">Client</h2>
          <div className="mt-4 space-y-2">
            <p className="font-medium text-white">{buyerName}</p>
            {buyerEmail && (
              <p className="text-sm text-muted-foreground">{buyerEmail}</p>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
        <h2 className="text-lg font-semibold text-white">Articles</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Produit
                </th>
                <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Qte
                </th>
                <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Prix unit.
                </th>
                <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {order.items.map((item) => {
                const unitPrice = Number(item.unitPrice)
                return (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-white">
                      {item.product.name}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      {unitPrice.toLocaleString('fr-FR')}
                      {symbol}
                    </td>
                    <td className="py-3 text-right font-medium text-white">
                      {(unitPrice * item.quantity).toLocaleString('fr-FR')}
                      {symbol}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status actions */}
      {order.status === 'PAID' && (
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
          <h2 className="text-lg font-semibold text-white">
            Marquer comme expediee
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Confirmez que cette commande a ete expediee au client.
          </p>
          <div className="mt-4">
            <ShipOrderButton orderId={order.id} />
          </div>
        </div>
      )}

      {order.status === 'SHIPPED' && (
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
          <h2 className="text-lg font-semibold text-white">
            Confirmer la livraison
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entrez le code de confirmation fourni par l&apos;acheteur pour
            finaliser la livraison.
          </p>
          <div className="mt-4">
            <ConfirmDeliveryForm orderId={order.id} />
          </div>
        </div>
      )}

      {order.status === 'COMPLETED' && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <p className="text-sm font-medium text-emerald-400">
            Livraison confirmee — Cette commande est terminee.
          </p>
        </div>
      )}

      {/* Timeline / Historique */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
        <h2 className="text-lg font-semibold text-white">Historique</h2>
        <div className="mt-4 space-y-0">
          {STATUS_ORDER.map((step, idx) => {
            const isCompleted = idx <= currentStep
            const isCurrent = idx === currentStep
            const stepCfg = STATUS_CONFIG[step]
            const icons = [Clock, CheckCircle2, Truck, Package, CheckCircle2]
            const Icon = icons[idx] ?? Circle
            const labels = [
              'Commande creee',
              'Paiement recu',
              'Commande expediee',
              'Commande livree',
              'Commande completee',
            ]

            return (
              <div key={step} className="flex gap-3">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      isCompleted
                        ? isCurrent
                          ? `${stepCfg?.bg ?? 'bg-white/10'} ${stepCfg?.text ?? 'text-white'}`
                          : 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-white/[0.04] text-muted-foreground/40'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {idx < STATUS_ORDER.length - 1 && (
                    <div
                      className={`h-6 w-px ${
                        idx < currentStep
                          ? 'bg-emerald-500/30'
                          : 'bg-white/[0.06]'
                      }`}
                    />
                  )}
                </div>
                {/* Label */}
                <div className="pt-1">
                  <p
                    className={`text-sm ${
                      isCompleted
                        ? 'font-medium text-white'
                        : 'text-muted-foreground/50'
                    }`}
                  >
                    {labels[idx]}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
