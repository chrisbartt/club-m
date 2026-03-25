import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CURRENCY_SYMBOLS, COMMISSION_RATE, CONFIRMATION_CODE_EXPIRY_DAYS } from '@/lib/constants'
import { ShipOrderButton } from '@/components/orders/ship-order-button'
import { ConfirmDeliveryForm } from '@/components/orders/confirm-delivery-form'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Truck,
  XCircle,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import type { Currency } from '@/lib/generated/prisma/client'

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
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

const TIMELINE_LABELS = [
  'Commande creee',
  'Paiement confirme',
  'Commande expediee',
  'Commande livree',
  'Commande completee',
]

const TIMELINE_ICONS = [Clock, CheckCircle2, Truck, Package, CheckCircle2]

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

  // Fetch order with all relations
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      member: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          user: { select: { email: true } },
        },
      },
      customer: {
        include: {
          user: { select: { email: true } },
          address: true,
        },
      },
      payment: true,
      business: { select: { memberId: true } },
    },
  })

  if (!order) notFound()

  // Verify ownership
  if (order.business.memberId !== user.member.id) {
    redirect('/mon-business/commandes')
  }

  const buyer = order.member ?? order.customer
  const buyerName = buyer
    ? `${buyer.firstName} ${buyer.lastName}`
    : 'Client inconnu'
  const buyerEmail = buyer?.user?.email ?? null
  const buyerPhone = buyer?.phone ?? null
  const buyerAddress = order.customer?.address ?? null

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
  const isCancelled = order.status === 'CANCELLED'

  // WhatsApp link
  const whatsappNumber = buyerPhone
    ? buyerPhone.replace(/^\+/, '').replace(/\s/g, '')
    : null

  // Format date helper
  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) +
    ' ' +
    date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })

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
        <h1 className="text-2xl font-bold text-white">
          Commande{' '}
          <span className="font-mono text-muted-foreground">
            #{order.id.slice(-8).toUpperCase()}
          </span>
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-8">
          {/* Recapitulatif */}
          <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recapitulatif
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  ID commande
                </span>
                <span className="font-mono text-sm text-white">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="border-t border-white/[0.04]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-white">
                  {total.toLocaleString('fr-FR')}
                  {symbol}
                </span>
              </div>
              <div className="border-t border-white/[0.04]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Commission Club M ({(COMMISSION_RATE * 100).toFixed(0)}%)
                </span>
                <span className="text-sm text-muted-foreground">
                  -{commission.toLocaleString('fr-FR')}
                  {symbol}
                </span>
              </div>
              <div className="border-t border-white/[0.04]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Net vendeuse
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
                  {formatDate(new Date(order.createdAt))}
                </span>
              </div>
              <div className="border-t border-white/[0.04]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Code de confirmation
                </span>
                <span className="inline-flex items-center rounded-lg bg-white/[0.06] px-4 py-2 font-mono text-2xl font-bold tracking-widest text-white">
                  {order.confirmationCode}
                </span>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Articles</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Produit
                    </th>
                    <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Quantite
                    </th>
                    <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Prix unitaire
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
                <tfoot>
                  <tr className="border-t border-white/[0.06]">
                    <td
                      colSpan={3}
                      className="pt-3 text-right text-sm font-medium text-muted-foreground"
                    >
                      Sous-total
                    </td>
                    <td className="pt-3 text-right text-sm font-semibold text-white">
                      {total.toLocaleString('fr-FR')}
                      {symbol}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Actions card */}
          {order.status === 'PAID' && (
            <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Actions
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Confirmez que cette commande a ete expediee au client.
              </p>
              <ShipOrderButton orderId={order.id} />
            </div>
          )}

          {order.status === 'SHIPPED' && (
            <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Actions
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Entrez le code de confirmation fourni par l&apos;acheteur pour
                finaliser la livraison.
              </p>
              <ConfirmDeliveryForm orderId={order.id} />
            </div>
          )}

          {order.status === 'COMPLETED' && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-400">
                Livraison confirmee — Cette commande est terminee.
              </p>
            </div>
          )}

          {order.status === 'CANCELLED' && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
              <XCircle className="h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm font-medium text-red-400">
                Cette commande a ete annulee.
              </p>
            </div>
          )}

          {/* Historique / Timeline */}
          <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Historique
            </h2>
            <div className="space-y-0">
              {STATUS_ORDER.map((step, idx) => {
                const isCompleted = !isCancelled && idx <= currentStep
                const isCurrent = !isCancelled && idx === currentStep
                const stepCfg = STATUS_CONFIG[step]
                const Icon = TIMELINE_ICONS[idx] ?? Circle

                return (
                  <div key={step} className="flex gap-3">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted
                            ? isCurrent
                              ? `${stepCfg?.bg ?? 'bg-white/10'} ${stepCfg?.text ?? 'text-white'}`
                              : 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-white/[0.04] text-muted-foreground/30'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {idx < STATUS_ORDER.length - 1 && (
                        <div
                          className={`h-6 w-px ${
                            !isCancelled && idx < currentStep
                              ? 'bg-emerald-500/30'
                              : 'bg-white/[0.06]'
                          }`}
                        />
                      )}
                    </div>
                    {/* Label + date */}
                    <div className="pt-1.5">
                      <p
                        className={`text-sm ${
                          isCompleted
                            ? 'font-medium text-white'
                            : 'text-muted-foreground/40'
                        }`}
                      >
                        {TIMELINE_LABELS[idx]}
                      </p>
                      {isCompleted && idx === 0 && (
                        <p className="mt-0.5 text-xs text-muted-foreground/60">
                          {formatDate(new Date(order.createdAt))}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5 lg:col-span-4">
          {/* Client card */}
          <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Client</h2>
            <div className="space-y-4">
              <p className="text-lg font-bold text-white">{buyerName}</p>

              {buyerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-white">{buyerPhone}</span>
                </div>
              )}

              {buyerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {buyerEmail}
                  </span>
                </div>
              )}

              {buyerAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <p>{buyerAddress.street}</p>
                    {buyerAddress.commune && <p>{buyerAddress.commune}</p>}
                    <p>{buyerAddress.city}</p>
                  </div>
                </div>
              )}

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contacter sur WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Livraison card */}
          <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Livraison
            </h2>
            <div className="space-y-4">
              {/* Confirmation code - prominent display */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Code de confirmation
                </p>
                <div className="flex items-center justify-center rounded-lg bg-white/[0.06] px-4 py-4">
                  <span className="font-mono text-2xl font-bold tracking-widest text-white">
                    {order.confirmationCode}
                  </span>
                </div>
              </div>

              {/* Expiration */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Expiration
                </span>
                <span className="text-sm text-white">
                  {new Date(order.codeExpiresAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Code status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                {order.codeUsed ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Code utilise
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    En attente
                  </span>
                )}
              </div>

              {/* Instructions */}
              <div className="rounded-lg bg-white/[0.03] p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Le client doit donner ce code au livreur pour confirmer la
                  reception de la commande.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
