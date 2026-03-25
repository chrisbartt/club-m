'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowRight, BadgeCheck } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { useState } from 'react'
import type { Currency } from '@/lib/generated/prisma/client'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number | { toNumber(): number } | string
    currency: Currency
    images: string[]
    type: 'PHYSICAL' | 'SERVICE' | 'DIGITAL'
    category: string | null
    stock: number | null
  }
  business: {
    id: string
    businessName: string
    slug: string
    coverImage: string | null
    member: {
      firstName: string
      lastName: string
      avatar: string | null
    }
  }
}

export default function ProductCard({ product, business }: ProductCardProps) {
  const { addItem, cart } = useCart()
  const [showWarning, setShowWarning] = useState(false)
  const [added, setAdded] = useState(false)

  const isService = product.type === 'SERVICE'
  const price = typeof product.price === 'object' && product.price !== null && 'toNumber' in product.price
    ? (product.price as { toNumber(): number }).toNumber()
    : Number(product.price)
  const currencySymbol = CURRENCY_SYMBOLS[product.currency] ?? '$'
  const image = product.images[0] ?? null

  const handleAddToCart = () => {
    // Check if different business in cart
    if (cart.businessId && cart.businessId !== business.id && cart.items.length > 0) {
      setShowWarning(true)
      return
    }

    const success = addItem(
      {
        productId: product.id,
        productName: product.name,
        productImage: image,
        price,
        currency: product.currency,
        quantity: 1,
        type: product.type as 'PHYSICAL' | 'DIGITAL',
        stock: product.stock,
      },
      { id: business.id, name: business.businessName, slug: business.slug },
    )

    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl font-bold text-gray-200">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium ${
            isService
              ? 'bg-purple-50 text-purple-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          {isService ? 'Service' : 'Produit'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#091626] text-sm leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Price */}
        <p className="font-bold text-[#091626] text-lg mb-2">
          {isService && price === 0
            ? 'Sur devis'
            : `${price.toLocaleString('fr-FR')}${currencySymbol}`}
        </p>

        {/* Business info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {business.member.avatar ? (
              <Image
                src={business.member.avatar}
                alt=""
                width={20}
                height={20}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-[#a55b46]/20 flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#a55b46]">
                  {business.member.firstName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 truncate">{business.businessName}</span>
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        </div>

        {/* CTA */}
        {isService ? (
          <Link
            href={`/boutique/${business.slug}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-[#a55b46] bg-[#a55b46]/5 hover:bg-[#a55b46]/10 transition-colors"
          >
            Contacter
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock !== null && product.stock <= 0}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              added
                ? 'bg-emerald-500 text-white'
                : product.stock !== null && product.stock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#a55b46] text-white hover:bg-[#8f4d3b]'
            }`}
          >
            {added ? (
              'Ajoute !'
            ) : product.stock !== null && product.stock <= 0 ? (
              'Rupture de stock'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Ajouter au panier
              </>
            )}
          </button>
        )}
      </div>

      {/* Different boutique warning modal */}
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
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-[#091626] hover:bg-gray-50"
              >
                Fermer
              </button>
              <Link
                href={`/boutique/${business.slug}`}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center bg-[#a55b46] text-white hover:bg-[#8f4d3b]"
              >
                Voir la boutique
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
