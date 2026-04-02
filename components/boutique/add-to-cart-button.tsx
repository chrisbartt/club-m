'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import type { Currency } from '@/lib/generated/prisma/client'

interface AddToCartButtonProps {
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
}

export default function AddToCartButton({ product, business }: AddToCartButtonProps) {
  const { addItem, cart } = useCart()
  const [added, setAdded] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const outOfStock = product.stock !== null && product.stock <= 0

  const handleClick = () => {
    if (outOfStock) return

    // Different boutique check
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
        quantity: 1,
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

  return (
    <>
      <button
        onClick={handleClick}
        disabled={outOfStock}
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          added
            ? 'bg-emerald-500 text-white'
            : outOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
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

      {/* Warning modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-foreground text-lg mb-2">
              Boutique differente
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Votre panier contient des articles d&apos;une autre boutique. Vous ne pouvez
              commander que dans une seule boutique a la fois.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-foreground hover:bg-gray-50"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  )
}
