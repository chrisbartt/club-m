'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Minus, Plus, Zap } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import type { Currency } from '@/lib/generated/prisma/client'

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
  business: {
    id: string
    name: string
    slug: string
  }
  outOfStock: boolean
}

export default function ProductDetailClient({
  product,
  business,
  outOfStock,
}: ProductDetailClientProps) {
  const router = useRouter()
  const { addItem, cart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const maxQty = product.stock !== null ? product.stock : 99

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleIncrement = () => {
    if (quantity < maxQty) setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    if (outOfStock) return

    if (cart.businessId && cart.businessId !== business.id && cart.items.length > 0) {
      setShowWarning(true)
      return
    }

    const success = addItem(
      {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] ?? null,
        price: product.price,
        currency: product.currency,
        quantity,
        type: product.type,
        stock: product.stock,
        variantId: null,
        variantLabel: null,
      },
      business,
    )

    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  const handleBuyNow = () => {
    if (outOfStock) return

    if (cart.businessId && cart.businessId !== business.id && cart.items.length > 0) {
      setShowWarning(true)
      return
    }

    const success = addItem(
      {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] ?? null,
        price: product.price,
        currency: product.currency,
        quantity,
        type: product.type,
        stock: product.stock,
        variantId: null,
        variantLabel: null,
      },
      business,
    )

    if (success) {
      router.push('/panier')
    }
  }

  return (
    <>
      {/* Quantity selector */}
      {!outOfStock && (
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
          {product.stock !== null && (
            <span className="text-xs text-gray-400">{product.stock} disponible{product.stock > 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors mb-3 ${
          added
            ? 'bg-emerald-500 text-white'
            : outOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#a55b46] text-white hover:bg-[#8f4d3b]'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Ajoute au panier !
          </>
        ) : outOfStock ? (
          'Rupture de stock'
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Ajouter au panier
          </>
        )}
      </button>

      {/* Buy now */}
      {!outOfStock && (
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
