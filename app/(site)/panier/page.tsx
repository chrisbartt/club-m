'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  BadgeCheck,
  Truck,
  ArrowRight,
  Store,
} from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'
import type { Currency } from '@/lib/generated/prisma/client'

export default function PanierPage() {
  const router = useRouter()
  const { cart, removeItem, updateQuantity, clearCart, itemCount, total, currency, hydrated } = useCart()

  const symbol = CURRENCY_SYMBOLS[currency as Currency] ?? '$'

  if (!hydrated) {
    return (
      <AppContainerWebSite>
        <div className="bg-muted min-h-[70vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppContainerWebSite>
    )
  }

  if (cart.items.length === 0) {
    return (
      <AppContainerWebSite>
        <div className="bg-[#f8f8f8] min-h-[70vh] flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-[#091626] mb-2">
              Votre panier est vide
            </h1>
            <p className="text-gray-500 mb-8">
              Decouvrez les produits et services de nos entrepreneures.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#a55b46] text-white font-semibold hover:bg-[#8f4d3b] transition-colors"
            >
              Decouvrir nos produits
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AppContainerWebSite>
    )
  }

  return (
    <AppContainerWebSite>
      <div className="bg-[#f8f8f8] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#091626]">Mon panier</h1>
              <p className="text-sm text-gray-500 mt-1">
                {itemCount} article{itemCount > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Vider le panier
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const itemSymbol = CURRENCY_SYMBOLS[item.currency as Currency] ?? '$'
                const lineTotal = item.price * item.quantity
                const maxQty = item.stock !== null ? item.stock : 99

                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-2xl p-4 lg:p-6 flex gap-4"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-200">
                            {item.productName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[#091626] text-sm lg:text-base truncate">
                            {item.productName}
                            {item.variantLabel && (
                              <span className="text-muted-foreground font-normal"> — {item.variantLabel}</span>
                            )}
                          </h3>
                          {cart.businessName && cart.businessSlug && (
                            <Link
                              href={`/boutique/${cart.businessSlug}`}
                              className="text-xs text-gray-500 hover:text-[#a55b46] transition-colors"
                            >
                              {cart.businessName}
                            </Link>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#091626]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            disabled={item.quantity >= maxQty}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {item.price.toLocaleString('fr-FR')} {itemSymbol} x {item.quantity}
                          </p>
                          <p className="font-bold text-[#091626]">
                            {lineTotal.toLocaleString('fr-FR')} {itemSymbol}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Boutique info */}
              {cart.businessName && cart.businessSlug && (
                <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#a55b46]/10 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 text-[#a55b46]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">
                      Tous vos articles proviennent de{' '}
                      <Link
                        href={`/boutique/${cart.businessSlug}`}
                        className="font-semibold text-[#091626] hover:text-[#a55b46] transition-colors"
                      >
                        {cart.businessName}
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-[#091626] mb-6">
                  Recapitulatif
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sous-total</span>
                    <span className="font-medium text-[#091626]">
                      {total.toLocaleString('fr-FR')} {symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Livraison</span>
                    <span className="text-gray-400 text-xs">A definir avec la vendeuse</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#091626]">Total</span>
                      <span className="text-xl font-bold text-[#091626]">
                        {total.toLocaleString('fr-FR')} {symbol}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold bg-[#a55b46] text-white hover:bg-[#8f4d3b] transition-colors mb-6"
                >
                  Commander
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust icons */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: ShieldCheck, label: 'Paiement securise' },
                    { icon: BadgeCheck, label: 'Certifie Club M' },
                    { icon: Truck, label: 'Livraison Kinshasa' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-[10px] text-gray-400 font-medium leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppContainerWebSite>
  )
}
