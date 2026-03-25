import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Briefcase,
  BadgeCheck,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
} from 'lucide-react'
import { getProductById } from '@/domains/business/queries'
import { getProfileBySlug } from '@/domains/directory/queries'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/generated/prisma/client'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string; productId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params
  const product = await getProductById(productId)
  if (!product) return { title: 'Service — Club M' }
  return {
    title: `${product.name} — Club M`,
    description: product.description?.slice(0, 160),
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
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

  const whatsappNumber = profile.whatsapp?.replace(/\D/g, '') ?? ''
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis interessee par votre service "${product.name}". Pouvez-vous me donner plus d'informations ?`
  )

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
            {/* Left: Image */}
            <div>
              {product.images.length > 0 ? (
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.slice(1, 5).map((img, i) => (
                        <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-white">
                          <Image
                            src={img}
                            alt={`${product.name} - ${i + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 25vw, 12vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  <Briefcase className="w-20 h-20 text-purple-200" />
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col gap-6">
              {/* Service info card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                {/* Type badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 bg-purple-50 text-purple-700">
                    <Briefcase className="w-3.5 h-3.5" />
                    Service
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
                <div className="mb-6">
                  {price > 0 ? (
                    <p className="text-2xl font-bold text-[#091626]">
                      A partir de {price.toLocaleString('fr-FR')} {symbol}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-[#091626]">Sur devis</p>
                  )}
                </div>

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
              </div>

              {/* Service details card */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-[#091626] uppercase tracking-wider mb-4">
                  Details du service
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#091626]">Mode de prestation</p>
                      <p className="text-sm text-gray-500">Sur place / A domicile</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#091626]">Zone desservie</p>
                      <p className="text-sm text-gray-500">
                        {profile.address ? 'Kinshasa' : 'A convenir'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#091626]">Delai</p>
                      <p className="text-sm text-gray-500">A convenir</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-[#091626] uppercase tracking-wider mb-4">
                  Contacter la prestataire
                </h3>
                <div className="space-y-3">
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Contacter sur WhatsApp
                    </a>
                  )}

                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold border-2 border-[#091626] text-[#091626] hover:bg-[#091626] hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler
                    </a>
                  )}

                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent(`Demande d'information: ${product.name}`)}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Envoyer un email
                    </a>
                  )}
                </div>
              </div>

              {/* Business info card */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Prestataire
                </h3>
                <Link href={`/boutique/${slug}`} className="group">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      {profile.member.avatar ? (
                        <Image
                          src={profile.member.avatar}
                          alt={profile.businessName}
                          fill
                          className="object-cover"
                          sizes="56px"
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
