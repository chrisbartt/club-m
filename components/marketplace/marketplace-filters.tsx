'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

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

const selectClass = 'w-full md:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'

export default function MarketplaceFilters({ categories }: MarketplaceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

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
  const activeCount = [activeCategory, activePrice, activeCommune].filter(Boolean).length

  const filterSelects = (
    <>
      <select
        value={activeCategory}
        onChange={(e) => updateParam('category', e.target.value)}
        className={selectClass}
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
        className={selectClass}
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
        className={selectClass}
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
        className={`${selectClass} md:ml-auto`}
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop filters */}
      <div className="hidden md:flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtres</span>
        </div>
        {filterSelects}
      </div>

      {/* Mobile: filter button + sort */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-foreground"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {activeCount > 0 && (
            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        <select
          value={activeSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-foreground">Filtres</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              {filterSelects}
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      {hasFilters && (
        <button
          onClick={() => {
            const params = new URLSearchParams()
            const tab = searchParams.get('tab')
            if (tab) params.set('tab', tab)
            router.push(`/marketplace?${params.toString()}`)
          }}
          className="self-start text-sm text-primary hover:underline font-medium"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  )
}
