import { getPopularProducts, getFeaturedStores } from '@/domains/marketplace/queries'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, ShoppingBag } from 'lucide-react'
import type { Currency } from '@/lib/generated/prisma/client'

export default async function FeaturedSection() {
  const [popularProducts, featuredStores] = await Promise.all([
    getPopularProducts(6),
    getFeaturedStores(6),
  ])

  if (popularProducts.length === 0 && featuredStores.length === 0) {
    return null
  }

  return (
    <div className="space-y-10">
      {/* Popular products */}
      {popularProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#091626]">Produits populaires</h2>
            <Link
              href="/marketplace?tab=produits&sort=popular"
              className="text-sm font-semibold text-[#a55b46] hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {popularProducts.map((product) => {
              const price = typeof product.price === 'object' && product.price !== null && 'toNumber' in product.price
                ? (product.price as unknown as { toNumber(): number }).toNumber()
                : Number(product.price)
              const symbol = CURRENCY_SYMBOLS[product.currency as Currency] ?? '$'
              const image = product.images[0] ?? null
              const isService = product.type === 'SERVICE'

              return (
                <Link
                  key={product.id}
                  href={`/boutique/${product.business.slug}`}
                  className="flex-shrink-0 w-44 snap-start"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#a55b46]/20 to-[#091626]/20 flex items-center justify-center">
                          <span className="text-3xl font-bold text-[#a55b46]/30">
                            {product.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span
                        className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          isService ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {isService ? 'Service' : 'Produit'}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-[#091626] line-clamp-1">{product.name}</p>
                      <p className="text-sm font-bold text-[#091626]">
                        {isService && price === 0 ? 'Sur devis' : `${price.toLocaleString('fr-FR')}${symbol}`}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {product.business.businessName}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Featured stores */}
      {featuredStores.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#091626]">Boutiques a decouvrir</h2>
            <Link
              href="/marketplace?tab=boutiques"
              className="text-sm font-semibold text-[#a55b46] hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={`/boutique/${store.slug}`}
                className="flex-shrink-0 w-64 snap-start"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-28 bg-gradient-to-br from-[#a55b46]/20 to-[#091626]/10">
                    {store.coverImage ? (
                      <img
                        src={store.coverImage}
                        alt={store.businessName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#a55b46]/20 to-[#091626]/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/40">
                          {store.businessName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 -mt-6 border-2 border-white shadow-sm relative z-10">
                        {store.member.avatar ? (
                          <img src={store.member.avatar} alt="" className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full bg-[#a55b46] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{store.member.firstName.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-[#091626] text-sm truncate">{store.businessName}</h3>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <ShoppingBag className="w-3 h-3" />
                        {store._count.products} produit{store._count.products !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-semibold text-[#a55b46]">
                        Decouvrir →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
