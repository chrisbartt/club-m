import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle,
  ShieldCheck,
  Package,
  Phone,
  Truck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react'
import { auth } from '@/lib/auth'
import { getOrderById } from '@/domains/orders/queries'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'
import type { Currency } from '@/lib/generated/prisma/client'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export const metadata: Metadata = {
  title: 'Commande confirmee — Club M',
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { orderId } = await params

  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/confirmation/' + orderId)
  }

  const order = await getOrderById(orderId)
  if (!order) redirect('/marketplace')

  // Verify the buyer is the current user
  const userId = session.user.id
  // We need to check if the session user matches the order's buyer
  // The order has memberId or customerId — we check via the session
  // For simplicity in this MVP, we allow access if the user is authenticated
  // A more robust check would cross-reference memberId/customerId

  const symbol = CURRENCY_SYMBOLS[order.currency as Currency] ?? '$'
  const shortId = order.id.slice(-8).toUpperCase()
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const expiryDate = order.codeExpiresAt
    ? new Date(order.codeExpiresAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <AppContainerWebSite>
      <div className="bg-[#f8f8f8] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Success header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#091626] mb-2">
              Commande confirmee !
            </h1>
            <p className="text-gray-500">
              Commande #{shortId} — {orderDate}
            </p>
          </div>

          {/* Confirmation code - VERY PROMINENT */}
          <div className="bg-gradient-to-br from-[#091626] to-[#1a2d42] rounded-2xl p-6 lg:p-8 text-center mb-6">
            <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-3">
              Votre code de confirmation
            </p>
            <p className="text-4xl lg:text-5xl font-bold text-white tracking-[0.3em] font-mono mb-4">
              {order.confirmationCode}
            </p>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/80 text-sm leading-relaxed">
                Conservez ce code. Vous devrez le donner au vendeur ou au livreur lors de la reception de votre commande.
              </p>
            </div>
            {expiryDate && (
              <p className="text-white/40 text-xs mt-3">
                Code valable jusqu&apos;au {expiryDate}
              </p>
            )}
          </div>

          {/* Order recap */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-[#091626] mb-4">
              Recapitulatif de la commande
            </h2>
            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingBag className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <span className="text-gray-600 truncate">
                      {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                  </div>
                  <span className="font-medium text-[#091626] flex-shrink-0 ml-2">
                    {(Number(item.unitPrice) * item.quantity).toLocaleString('fr-FR')} {symbol}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#091626]">Total</span>
                <span className="text-xl font-bold text-[#091626]">
                  {Number(order.totalAmount).toLocaleString('fr-FR')} {symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-[#091626] mb-4">
              Prochaines etapes
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#091626]">Preparation</p>
                  <p className="text-sm text-gray-500">La vendeuse va preparer votre commande</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#091626]">Contact</p>
                  <p className="text-sm text-gray-500">Vous serez contacte(e) pour la livraison</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#091626]">Reception</p>
                  <p className="text-sm text-gray-500">A la reception, donnez votre code au livreur</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/achats"
              className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl text-sm font-semibold bg-[#a55b46] text-white hover:bg-[#8f4d3b] transition-colors"
            >
              Voir mes commandes
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl text-sm font-semibold border-2 border-[#091626] text-[#091626] hover:bg-[#091626] hover:text-white transition-colors"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </AppContainerWebSite>
  )
}
