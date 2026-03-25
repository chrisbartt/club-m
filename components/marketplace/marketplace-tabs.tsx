'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { ShoppingBag, Briefcase, Store, LayoutGrid } from 'lucide-react'

const TABS = [
  { key: 'tous', label: 'Tous', icon: LayoutGrid },
  { key: 'produits', label: 'Produits', icon: ShoppingBag },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'boutiques', label: 'Boutiques', icon: Store },
] as const

export default function MarketplaceTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'tous'

  const handleTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (tab === 'tous') {
        params.delete('tab')
      } else {
        params.set('tab', tab)
      }
      params.delete('offset')
      router.push(`/marketplace?${params.toString()}`)
    },
    [searchParams, router],
  )

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl overflow-x-auto">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => handleTabChange(key)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === key
              ? 'bg-white text-[#091626] shadow-sm'
              : 'text-gray-500 hover:text-[#091626]'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
