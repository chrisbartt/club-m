import Link from 'next/link'
import { ArrowRight, BadgeCheck, ShoppingBag } from 'lucide-react'

interface StoreCardProps {
  store: {
    id: string
    businessName: string
    slug: string
    coverImage: string | null
    category: string
    description?: string | null
    member: {
      firstName: string
      lastName: string
      avatar: string | null
    }
    _count: { products: number }
  }
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/boutique/${store.slug}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow block"
    >
      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-br from-[#a55b46]/20 to-[#091626]/10">
        {store.coverImage ? (
          <img
            src={store.coverImage}
            alt={store.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#a55b46]/20 to-[#091626]/20 flex items-center justify-center">
            <span className="text-5xl font-bold text-white/40">
              {store.businessName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-[#091626]">
          {store.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 -mt-8 border-2 border-white shadow-sm relative z-10">
            {store.member.avatar ? (
              <img
                src={store.member.avatar}
                alt=""
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-[#a55b46] flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {store.member.firstName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[#091626] text-base truncate">
                {store.businessName}
              </h3>
              <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-500">
              {store.member.firstName} {store.member.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <ShoppingBag className="w-3.5 h-3.5" />
            {store._count.products} produit{store._count.products !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-[#a55b46] group-hover:gap-2 transition-all">
            Voir la boutique
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
