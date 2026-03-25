'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'

interface MarketplaceHeroProps {
  categories: string[]
  stats: { totalProducts: number; totalStores: number; totalCategories: number }
}

export default function MarketplaceHero({ categories, stats }: MarketplaceHeroProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams(searchParams.toString())
      if (search.trim()) {
        params.set('search', search.trim())
      } else {
        params.delete('search')
      }
      params.delete('offset')
      router.push(`/marketplace?${params.toString()}`)
    },
    [search, searchParams, router],
  )

  const handleCategoryClick = useCallback(
    (cat: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (params.get('category') === cat) {
        params.delete('category')
      } else {
        params.set('category', cat)
      }
      params.delete('offset')
      router.push(`/marketplace?${params.toString()}`)
    },
    [searchParams, router],
  )

  const activeCategory = searchParams.get('category')

  return (
    <section className="relative bg-gradient-to-br from-[#091626] via-[#122240] to-[#091626] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#a55b46] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#a55b46] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Marketplace Club M
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Decouvrez les produits et services de nos entrepreneures
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit, un service, une boutique..."
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white text-[#091626] placeholder:text-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#a55b46] shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#a55b46] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#8f4d3b] transition-colors"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#a55b46] text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
          <span>{stats.totalProducts} produits</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{stats.totalStores} boutiques</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{stats.totalCategories} categories</span>
        </div>
      </div>
    </section>
  )
}
