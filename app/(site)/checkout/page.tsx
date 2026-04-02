'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  LogIn,
  ShoppingCart,
} from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { createCartOrder } from '@/domains/orders/actions'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'
import CouponInput from '@/components/orders/coupon-input'
import { PaymentPending } from '@/components/checkout/payment-pending'
import type { Currency } from '@/lib/generated/prisma/client'

const COMMUNES = [
  'Bandalungwa',
  'Barumbu',
  'Gombe',
  'Kalamu',
  'Kasa-Vubu',
  'Kimbanseke',
  'Kinshasa',
  'Kintambo',
  'Kisenso',
  'Lemba',
  'Limete',
  'Lingwala',
  'Makala',
  'Maluku',
  'Masina',
  'Matete',
  'Mont-Ngafula',
  'Ndjili',
  'Ngaba',
  'Ngaliema',
  'Ngiri-Ngiri',
  'Nsele',
  'Selembao',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { cart, total, currency, clearCart, itemCount } = useCart()

  const [phone, setPhone] = useState('')
  const [commune, setCommune] = useState('')
  const [quartier, setQuartier] = useState('')
  const [instructions, setInstructions] = useState('')
  const [paymentProvider, setPaymentProvider] = useState<'MPESA' | 'AIRTEL' | 'ORANGE'>('MPESA')
  const [paymentPhone, setPaymentPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [pendingPayment, setPendingPayment] = useState<{ transactionId: string; orderId: string } | null>(null)

  const symbol = CURRENCY_SYMBOLS[currency as Currency] ?? '$'

  // Loading auth
  if (status === 'loading') {
    return (
      <AppContainerWebSite>
        <div className="bg-muted min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppContainerWebSite>
    )
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <AppContainerWebSite>
        <div className="bg-muted min-h-[70vh] flex items-center justify-center">
          <div className="text-center px-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Connectez-vous pour continuer
            </h1>
            <p className="text-gray-500 mb-8">
              Vous devez avoir un compte pour passer commande.
            </p>
            <Link
              href={`/login?callbackUrl=/checkout`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Se connecter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AppContainerWebSite>
    )
  }

  // Empty cart
  if (cart.items.length === 0) {
    return (
      <AppContainerWebSite>
        <div className="bg-muted min-h-[70vh] flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Votre panier est vide
            </h1>
            <p className="text-gray-500 mb-8">
              Ajoutez des articles avant de passer commande.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Decouvrir nos produits
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AppContainerWebSite>
    )
  }

  // Show payment pending screen
  if (pendingPayment) {
    return (
      <AppContainerWebSite>
        <div className="bg-muted min-h-[70vh] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <PaymentPending
              transactionId={pendingPayment.transactionId}
              orderId={pendingPayment.orderId}
              provider={paymentProvider}
              onFailed={() => {
                setPendingPayment(null)
                setError('Le paiement a echoue. Veuillez reessayer.')
              }}
            />
          </div>
        </div>
      </AppContainerWebSite>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!phone.trim()) {
      setError('Le numero de telephone est requis.')
      return
    }
    if (!commune) {
      setError('Veuillez selectionner votre commune.')
      return
    }
    if (!paymentPhone.trim() || paymentPhone.trim().length < 10) {
      setError('Veuillez entrer un numero de telephone valide pour le paiement.')
      return
    }
    if (!cart.businessId) {
      setError('Erreur: boutique non identifiee.')
      return
    }

    setSubmitting(true)

    try {
      const result = await createCartOrder({
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          ...(item.variantId ? { variantId: item.variantId, variantLabel: item.variantLabel ?? undefined } : {}),
        })),
        businessId: cart.businessId,
        deliveryAddress: {
          phone: phone.trim(),
          commune,
          quartier: quartier.trim() || undefined,
        },
        ...(couponCode ? { couponCode } : {}),
        payment: {
          provider: paymentProvider,
          walletId: paymentPhone.trim(),
        },
      })

      if (result.success) {
        clearCart()
        setPendingPayment({
          transactionId: result.data.transactionId,
          orderId: result.data.orderId,
        })
      } else {
        const errorMessages: Record<string, string> = {
          INVALID_INPUT: 'Donnees invalides. Veuillez verifier votre formulaire.',
          RESOURCE_NOT_FOUND: 'Un produit n\'est plus disponible.',
          PRODUCTS_MIXED_BUSINESSES: 'Les produits doivent provenir de la meme boutique.',
          PRODUCT_INACTIVE: 'Un produit n\'est plus disponible.',
          INSUFFICIENT_STOCK: 'Stock insuffisant pour un des produits.',
          NOT_AUTHENTICATED: 'Veuillez vous reconnecter.',
          'Code promo introuvable': 'Code promo invalide ou expire.',
        }
        setError(errorMessages[result.error] ?? 'Une erreur est survenue. Veuillez reessayer.')
      }
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppContainerWebSite>
      <div className="bg-muted min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
            Finaliser la commande
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
              {/* Left: Delivery form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl p-6 lg:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-6">
                    Livraison
                  </h2>

                  <div className="space-y-5">
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Telephone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+243 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Commune */}
                    <div>
                      <label
                        htmlFor="commune"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Commune <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="commune"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none bg-white"
                      >
                        <option value="">Selectionnez votre commune</option>
                        {COMMUNES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quartier / Reference */}
                    <div>
                      <label
                        htmlFor="quartier"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Quartier / Avenue / Repere
                      </label>
                      <input
                        id="quartier"
                        type="text"
                        placeholder="Avenue X, a cote de Y"
                        value={quartier}
                        onChange={(e) => setQuartier(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Instructions */}
                    <div>
                      <label
                        htmlFor="instructions"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Instructions de livraison{' '}
                        <span className="text-gray-400 font-normal">(optionnel)</span>
                      </label>
                      <textarea
                        id="instructions"
                        rows={3}
                        placeholder="Instructions particulieres pour la livraison..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 mt-6">
                  <h2 className="text-lg font-bold text-foreground mb-6">
                    Paiement Mobile Money
                  </h2>

                  <div className="space-y-5">
                    {/* Provider selection */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Operateur <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {([
                          { id: 'MPESA' as const, label: 'M-Pesa', sub: 'Vodacom' },
                          { id: 'AIRTEL' as const, label: 'Airtel Money', sub: 'Airtel' },
                          { id: 'ORANGE' as const, label: 'Orange Money', sub: 'Orange' },
                        ]).map((op) => (
                          <button
                            key={op.id}
                            type="button"
                            onClick={() => setPaymentProvider(op.id)}
                            className={`p-3 rounded-xl border-2 text-center transition-colors ${
                              paymentProvider === op.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-sm font-semibold text-foreground">{op.label}</span>
                            <span className="block text-xs text-gray-400">{op.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment phone */}
                    <div>
                      <label
                        htmlFor="paymentPhone"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Numero de paiement <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="paymentPhone"
                        type="tel"
                        placeholder="+243 9XX XXX XXX"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Vous recevrez une demande de confirmation sur ce numero.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Order summary */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-6 lg:sticky lg:top-24">
                  <h2 className="text-lg font-bold text-foreground mb-6">
                    Votre commande
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {cart.items.map((item) => {
                      const itemSymbol = CURRENCY_SYMBOLS[item.currency as Currency] ?? '$'
                      return (
                        <div key={item.productId} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 truncate mr-2">
                            {item.productName}
                            {item.variantLabel && (
                              <span className="text-muted-foreground"> — {item.variantLabel}</span>
                            )}
                            {' '}<span className="text-gray-400">x{item.quantity}</span>
                          </span>
                          <span className="font-medium text-foreground flex-shrink-0">
                            {(item.price * item.quantity).toLocaleString('fr-FR')} {itemSymbol}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})</span>
                      <span className="font-medium text-foreground">
                        {total.toLocaleString('fr-FR')} {symbol}
                      </span>
                    </div>

                    {/* Coupon input */}
                    {cart.businessId && (
                      <div className="pt-1">
                        <CouponInput
                          businessId={cart.businessId}
                          cartTotal={total}
                          cartCurrency={currency}
                          onApply={(code, disc) => {
                            setCouponCode(code)
                            setDiscount(disc)
                          }}
                          onRemove={() => {
                            setCouponCode(null)
                            setDiscount(0)
                          }}
                        />
                      </div>
                    )}

                    {/* Discount line */}
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Reduction</span>
                        <span className="font-medium text-green-700">
                          -{discount.toLocaleString('fr-FR')} {symbol}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">
                          {(total - discount).toLocaleString('fr-FR')} {symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 mb-4">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    {submitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    Paiement securise. Vos donnees sont protegees.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppContainerWebSite>
  )
}
