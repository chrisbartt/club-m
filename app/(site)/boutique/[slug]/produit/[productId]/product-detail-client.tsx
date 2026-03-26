'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Minus, Plus, Zap } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { VariantSelector } from '@/components/orders/variant-selector'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/generated/prisma/client'

interface Variant {
  id: string
  label: string
  price: number | null
  stock: number
  isActive: boolean
}

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    images: string[]
    price: number
    currency: Currency
    type: 'PHYSICAL' | 'DIGITAL'
    stock: number | null
  }
  variants: Variant[]
  business: {
    id: string
    name: string
    slug: string
  }
  outOfStock: boolean
}

export default function ProductDetailClient({
  product,
  variants,
  business,
  outOfStock,
}: ProductDetailClientProps) {
  const router = useRouter()
  const { addItem, cart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  const activeVariants = variants.filter((v) => v.isActive)
  const hasVariants = activeVariants.length > 0
  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId) ?? null

  const effectivePrice = selectedVariant?.price ?? product.price
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock
  const maxQty = effectiveStock !== null ? effectiveStock : 99
  const isEffectivelyOutOfStock = hasVariants
    ? !selectedVariant || selectedVariant.stock === 0
    : outOfStock
  const needsVariantSelection = hasVariants && !selectedVariantId

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleIncrement = () => {
    if (quantity < maxQty) setQuantity(quantity + 1)
  }

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId)
    setQuantity(1) // Reset quantity when switching variant
  }

  const handleAddToCart = () => {
    if (isEffectivelyOutOfStock || needsVariantSelection) return

    if (cart.businessId && cart.businessId !== business.id && cart.items.length > 0) {
      setShowWarning(true)
      return
    }

    const success = addItem(
      {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] ?? null,
        price: effectivePrice,
        currency: product.currency,
        quantity,
        type: product.type,
        stock: effectiveStock,
        variantId: selectedVariantId,
        variantLabel: selectedVariant?.label ?? null,
      },
      business,
    )

    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  const handleBuyNow = () => {
    if (isEffectivelyOutOfStock || needsVariantSelection) return

    if (cart.businessId && cart.businessId !== business.id && cart.items.length > 0) {
      setShowWarning(true)
      return
    }

    const success = addItem(
      {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] ?? null,
        price: effectivePrice,
        currency: product.currency,
        quantity,
        type: product.type,
        stock: effectiveStock,
        variantId: selectedVariantId,
        variantLabel: selectedVariant?.label ?? null,
      },
      business,
    )

    if (success) {
      router.push('/panier')
    }
  }

  return (
    <>
      {/* Variant selector */}
      {hasVariants && (
        <div className="mb-6">
          <VariantSelector
            variants={variants}
            basePrice={product.price}
            currency={CURRENCY_SYMBOLS[product.currency] ?? '$'}
            selectedVariantId={selectedVariantId}
            onSelect={handleVariantSelect}
          />
          {selectedVariant && (
            <p className="mt-3 text-2xl font-bold text-[#091626]">
              {effectivePrice.toLocaleString('fr-FR')} {CURRENCY_SYMBOLS[product.currency] ?? '$'}
            </p>
          )}
          {selectedVariant && effectiveStock !== null && (
            <div className="mt-2">
              <span className={`inline-flex items-center text-xs font-semibold rounded-full px-3 py-1.5 ${
                effectiveStock > 5
                  ? 'bg-emerald-50 text-emerald-700'
                  : effectiveStock > 0
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'
              }`}>
                {effectiveStock > 5
                  ? 'En stock'
                  : effectiveStock > 0
                    ? `${effectiveStock} restant${effectiveStock > 1 ? 's' : ''}`
                    : 'Rupture de stock'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Quantity selector */}
      {!isEffectivelyOutOfStock && !needsVariantSelection && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium text-[#091626]">Quantite</span>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold text-[#091626]">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= maxQty}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {effectiveStock !== null && (
            <span className="text-xs text-gray-400">{effectiveStock} disponible{effectiveStock > 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={isEffectivelyOutOfStock || needsVariantSelection}
        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors mb-3 ${
          added
            ? 'bg-emerald-500 text-white'
            : isEffectivelyOutOfStock || needsVariantSelection
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#a55b46] text-white hover:bg-[#8f4d3b]'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Ajoute au panier !
          </>
        ) : needsVariantSelection ? (
          'Choisir une option'
        ) : isEffectivelyOutOfStock ? (
          'Rupture de stock'
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Ajouter au panier
          </>
        )}
      </button>

      {/* Buy now */}
      {!isEffectivelyOutOfStock && !needsVariantSelection && (
        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold border-2 border-[#091626] text-[#091626] hover:bg-[#091626] hover:text-white transition-colors"
        >
          <Zap className="w-4 h-4" />
          Acheter maintenant
        </button>
      )}

      {/* Mono-boutique warning */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-[#091626] text-lg mb-2">
              Boutique differente
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Votre panier contient des articles d&apos;une autre boutique. Vous ne pouvez
              commander que dans une seule boutique a la fois.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-[#091626] hover:bg-gray-50"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  )
}
