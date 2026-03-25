'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/cart-context'

export default function CartIcon({ scrolled }: { scrolled?: boolean }) {
  const { itemCount } = useCart()

  if (itemCount === 0) return null

  return (
    <Link
      href="/panier"
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
        scrolled
          ? 'text-[#091626] hover:bg-black/5'
          : 'text-white hover:bg-white/10'
      }`}
      aria-label={`Panier (${itemCount} article${itemCount > 1 ? 's' : ''})`}
    >
      <ShoppingBag className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#a55b46] rounded-full leading-none">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    </Link>
  )
}
