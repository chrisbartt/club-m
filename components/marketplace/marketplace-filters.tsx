'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { SlidersHorizontal } from 'lucide-react'

const COMMUNES = [
  'Gombe', 'Limete', 'Ngaliema', 'Bandalungwa', 'Barumbu',
  'Kalamu', 'Kasa-Vubu', 'Kintambo', 'Kinshasa', 'Lemba',
  'Lingwala', 'Makala', 'Maluku', 'Masina', 'Matete',
  'Mont-Ngafula', 'Ndjili', 'Ngaba', 'Ngiri-Ngiri', 'Nsele',
  'Selembao',
]

const PRICE_RANGES = [
  { label: 'Tous les prix', value: '' },
  { label: 'Moins de 20$', value: '0-20' },
  { label: '20$ - 50$', value: '20-50' },
  { label: '50$ - 100$', value: '50-100' },
  { label: 'Plus de 100$', value: '100-' },
]

const SORT_OPTIONS = [
  { label: 'Les plus recents', value: 'newest' },
  { label: 'Les plus populaires', value: 'popular' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix decroissant', value: 'price_desc' },
]

interface MarketplaceFiltersProps {
  categories: { id: string; name: string; slug: string }[]
}

export default function MarketplaceFilters({ categories }: MarketplaceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('offset')
      router.push(`/marketplace?${params.toString()}`)
    },
    [searchParams, router],
  )

  const activeCategory = searchParams.get('category') ?? ''
  const activePrice = searchParams.get('price') ?? ''
  const activeCommune = searchParams.get('commune') ?? ''
  const activeSort = searchParams.get('sort') ?? 'newest'

  const hasFilters = activeCategory || activePrice || activeCommune

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#091626]">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtres</span>
        </div>

        <select
          value={activeCategory}
          onChange={(e) => updateParam('category', e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#091626] focus:outline-none focus:ring-2 focus:ring-[#a55b46]/30"
        >
          <option value="">Toutes les categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={activePrice}
          onChange={(e) => updateParam('price', e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#091626] focus:outline-none focus:ring-2 focus:ring-[#a55b46]/30"
        >
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <select
          value={activeCommune}
          onChange={(e) => updateParam('commune', e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#091626] focus:outline-none focus:ring-2 focus:ring-[#a55b46]/30"
        >
          <option value="">Toutes les communes</option>
          {COMMUNES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={activeSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#091626] focus:outline-none focus:ring-2 focus:ring-[#a55b46]/30 ml-auto"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            const params = new URLSearchParams()
            const tab = searchParams.get('tab')
            if (tab) params.set('tab', tab)
            router.push(`/marketplace?${params.toString()}`)
          }}
          className="self-start text-sm text-[#a55b46] hover:underline font-medium"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  )
}
