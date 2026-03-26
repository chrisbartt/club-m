import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'
import {
  getMarketplaceProducts,
  getMarketplaceStores,
  getProductCategories,
  getMarketplaceStats,
} from '@/domains/marketplace/queries'
import MarketplaceHero from '@/components/marketplace/marketplace-hero'
import MarketplaceTabs from '@/components/marketplace/marketplace-tabs'
import MarketplaceFilters from '@/components/marketplace/marketplace-filters'
import FeaturedSection from '@/components/marketplace/featured-section'
import ProductCard from '@/components/marketplace/product-card'
import StoreCard from '@/components/marketplace/store-card'
import { PackageSearch } from 'lucide-react'
import Link from 'next/link'

const PAGE_SIZE = 12

function parsePriceRange(price: string | undefined) {
  if (!price) return {}
  const [min, max] = price.split('-')
  const result: { minPrice?: number; maxPrice?: number } = {}
  if (min) result.minPrice = Number(min)
  if (max) result.maxPrice = Number(max)
  return result
}

export const metadata = {
  title: 'Marketplace — Club M',
  description: 'Decouvrez les produits et services de nos entrepreneures a Kinshasa.',
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const tab = (params.tab as string) ?? 'tous'
  const search = params.search as string | undefined
  const category = params.category as string | undefined
  const price = params.price as string | undefined
  const commune = params.commune as string | undefined
  const sort = (params.sort as string) ?? 'newest'
  const offset = Number(params.offset ?? 0)

  const [categories, stats] = await Promise.all([
    getProductCategories(),
    getMarketplaceStats(),
  ])

  const priceRange = parsePriceRange(price)

  // Determine what to fetch based on tab
  const isStoresTab = tab === 'boutiques'
  const typeFilter =
    tab === 'produits'
      ? ('PHYSICAL' as const)
      : tab === 'services'
        ? ('SERVICE' as const)
        : undefined

  let products: Awaited<ReturnType<typeof getMarketplaceProducts>> | null = null
  let stores: Awaited<ReturnType<typeof getMarketplaceStores>> | null = null

  if (isStoresTab) {
    stores = await getMarketplaceStores({ category, search, limit: PAGE_SIZE })
  } else {
    products = await getMarketplaceProducts({
      type: typeFilter,
      search,
      category,
      commune,
      sort: sort as 'newest' | 'price_asc' | 'price_desc' | 'popular',
      limit: PAGE_SIZE,
      offset,
      ...priceRange,
    })
  }

  const showFeatured = tab === 'tous' && !search && !category && !price && !commune && offset === 0

  return (
    <AppContainerWebSite>
      {/* Hero */}
      <MarketplaceHero categories={categories} stats={stats} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <MarketplaceTabs />
        </div>

        {/* Filters */}
        {!isStoresTab && (
          <div className="mb-8">
            <MarketplaceFilters categories={categories} />
          </div>
        )}

        {/* Featured section (only on "Tous" tab without filters) */}
        {showFeatured && (
          <div className="mb-12">
            <FeaturedSection />
          </div>
        )}

        {/* Main grid — Products */}
        {!isStoresTab && products && (
          <>
            {products.products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: Number(product.price),
                        currency: product.currency,
                        images: product.images,
                        type: product.type,
                        category: product.category?.name ?? null,
                        stock: product.stock,
                      }}
                      business={{
                        id: product.business.id,
                        businessName: product.business.businessName,
                        slug: product.business.slug,
                        coverImage: product.business.coverImage,
                        member: product.business.member,
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {products.total > offset + PAGE_SIZE && (
                  <div className="flex justify-center mt-10">
                    <Link
                      href={(() => {
                        const p = new URLSearchParams()
                        if (tab !== 'tous') p.set('tab', tab)
                        if (search) p.set('search', search)
                        if (category) p.set('category', category)
                        if (price) p.set('price', price)
                        if (commune) p.set('commune', commune)
                        if (sort !== 'newest') p.set('sort', sort)
                        p.set('offset', String(offset + PAGE_SIZE))
                        return `/marketplace?${p.toString()}`
                      })()}
                      className="px-8 py-3 rounded-xl bg-[#a55b46] text-white font-semibold hover:bg-[#8f4d3b] transition-colors"
                    >
                      Voir plus
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {/* Main grid — Stores */}
        {isStoresTab && stores && (
          <>
            {stores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </div>
    </AppContainerWebSite>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <PackageSearch className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-[#091626] mb-1">
        Aucun resultat pour votre recherche
      </h3>
      <p className="text-sm text-gray-500">
        Essayez avec d&apos;autres filtres
      </p>
    </div>
  )
}
