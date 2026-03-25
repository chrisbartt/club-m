import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  Package,
  Download,
  BadgeCheck,
  Truck,
  ShoppingBag,
} from 'lucide-react'
import { getProductById } from '@/domains/business/queries'
import { getProfileBySlug } from '@/domains/directory/queries'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/generated/prisma/client'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'
import ProductDetailClient from './product-detail-client'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string; productId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params
  const product = await getProductById(productId)
  if (!product) return { title: 'Produit — Club M' }
  return {
    title: `${product.name} — Club M`,
    description: product.description?.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, productId } = await params

  const product = await getProductById(productId)
  if (!product || !product.isActive) notFound()

  const profile = await getProfileBySlug(slug)
  if (!profile || product.businessId !== profile.id) notFound()
  if (!profile.isPublished || !profile.isApproved || profile.profileType !== 'STORE') notFound()

  const symbol = CURRENCY_SYMBOLS[product.currency as Currency] ?? '$'
  const price = typeof product.price === 'object' && product.price !== null && 'toNumber' in product.price
    ? (product.price as unknown as { toNumber(): number }).toNumber()
    : Number(product.price)

  const isPhysical = product.type === 'PHYSICAL'
  const isDigital = product.type === 'DIGITAL'

  const stockInfo = isPhysical && product.stock !== null
    ? product.stock > 5
      ? { text: 'En stock', color: 'bg-emerald-50 text-emerald-700' }
      : product.stock > 0
        ? { text: `${product.stock} restant${product.stock > 1 ? 's' : ''}`, color: 'bg-amber-50 text-amber-700' }
        : { text: 'Rupture de stock', color: 'bg-red-50 text-red-700' }
    : null

  const outOfStock = isPhysical && product.stock !== null && product.stock <= 0

  return (
    <AppContainerWebSite>
      <div className="bg-[#f8f8f8] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8 flex-wrap">
            <Link href="/marketplace" className="hover:text-[#a55b46] transition-colors">
              Marketplace
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/boutique/${slug}`} className="hover:text-[#a55b46] transition-colors">
              {profile.businessName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#091626] font-medium">{product.name}</span>
          </nav>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Images */}
            <div>
              {product.images.length > 0 ? (
                <div className="space-y-3">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.slice(1, 5).map((img, i) => (
                        <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-white">
                          <img
                            src={img}
                            alt={`${product.name} - ${i + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#a55b46]/10 to-[#a55b46]/5 flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-[#a55b46]/20" />
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                {/* Type badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 ${
                    isDigital ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {isDigital ? <Download className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                    {isDigital ? 'Produit digital' : 'Produit physique'}
                  </span>
                  {product.category && (
                    <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl lg:text-3xl font-bold text-[#091626] mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <p className="text-3xl font-bold text-[#091626] mb-4">
                  {price.toLocaleString('fr-FR')} {symbol}
                </p>

                {/* Stock badge */}
                {stockInfo && (
                  <div className="mb-4">
                    <span className={`inline-flex items-center text-xs font-semibold rounded-full px-3 py-1.5 ${stockInfo.color}`}>
                      {stockInfo.text}
                    </span>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-[#091626] uppercase tracking-wider mb-2">
                      Description
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* CTA Section (client) */}
                <div className="border-t border-gray-100 pt-6">
                  <ProductDetailClient
                    product={{
                      id: product.id,
                      name: product.name,
                      images: product.images,
                      price,
                      currency: product.currency as Currency,
                      type: product.type as 'PHYSICAL' | 'DIGITAL',
                      stock: product.stock,
                    }}
                    business={{
                      id: profile.id,
                      name: profile.businessName,
                      slug: profile.slug,
                    }}
                    outOfStock={outOfStock}
                  />
                </div>
              </div>

              {/* Business info card */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Vendu par
                </h3>
                <Link href={`/boutique/${slug}`} className="group">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      {profile.member.avatar ? (
                        <img
                          src={profile.member.avatar}
                          alt={profile.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#a55b46] flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {profile.businessName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute -right-0.5 -bottom-0.5 w-5 h-5 bg-[#a55b46] rounded-full flex items-center justify-center border-2 border-white">
                        <BadgeCheck className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#091626] group-hover:text-[#a55b46] transition-colors truncate">
                        {profile.businessName}
                      </p>
                      <p className="text-sm text-gray-500">{profile.category}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#a55b46] transition-colors flex-shrink-0" />
                  </div>
                </Link>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-3 py-1.5">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Certifie Club M
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-3 py-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Livraison Kinshasa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppContainerWebSite>
  )
}
