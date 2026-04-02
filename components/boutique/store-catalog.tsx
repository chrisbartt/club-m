'use client'

import { useState } from 'react'
import { LayoutGrid, ShoppingBag, Briefcase, User, MapPin, Phone, Mail, Globe, BadgeCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import AddToCartButton from './add-to-cart-button'
import ServiceContactButton from './service-contact-button'
import type { Currency, ProductType } from '@/lib/generated/prisma/client'

interface ProductData {
  id: string
  name: string
  description: string
  price: number
  currency: Currency
  images: string[]
  type: ProductType
  category: string | null
  stock: number | null
}

interface StoreCatalogProps {
  business: {
    id: string
    businessName: string
    slug: string
    description: string
    category: string
    phone: string | null
    email: string | null
    website: string | null
    whatsapp: string | null
    address: string | null
    createdAt: string
    member: {
      firstName: string
      lastName: string
      avatar: string | null
      tier: string
    }
  }
  products: ProductData[]
}

const TABS = [
  { key: 'tous', label: 'Tous', icon: LayoutGrid },
  { key: 'produits', label: 'Produits', icon: ShoppingBag },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'apropos', label: 'A propos', icon: User },
] as const

export default function StoreCatalog({ business, products }: StoreCatalogProps) {
  const [activeTab, setActiveTab] = useState<string>('tous')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const physicalProducts = products.filter((p) => p.type === 'PHYSICAL' || p.type === 'DIGITAL')
  const services = products.filter((p) => p.type === 'SERVICE')

  const tabProducts =
    activeTab === 'produits'
      ? physicalProducts
      : activeTab === 'services'
        ? services
        : activeTab === 'tous'
          ? products
          : []

  // Extract unique categories from current tab's products
  const categories = [...new Set(tabProducts.filter((p) => p.category).map((p) => p.category as string))]

  // Reset category filter when switching tabs if category no longer exists
  const displayProducts = selectedCategory && categories.includes(selectedCategory)
    ? tabProducts.filter((p) => p.category === selectedCategory)
    : tabProducts

  const memberSince = new Date(business.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      {/* Info bar */}
      <div className="bg-muted border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              {physicalProducts.length} produit{physicalProducts.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-gray-400" />
              {services.length} service{services.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              Membre depuis {memberSince}
            </span>
            {business.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                Livraison: Kinshasa
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl overflow-x-auto mb-8">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === key
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-gray-500 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Category filter pills */}
        {activeTab !== 'apropos' && categories.length >= 2 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-3 py-1 rounded-full text-sm',
                !selectedCategory || !categories.includes(selectedCategory)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Toutes
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm',
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {activeTab !== 'apropos' ? (
          displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <CatalogProductCard
                  key={product.id}
                  product={product}
                  business={business}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                {activeTab === 'services' ? (
                  <Briefcase className="w-6 h-6 text-gray-300" />
                ) : (
                  <ShoppingBag className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {activeTab === 'services'
                  ? 'Aucun service disponible pour le moment'
                  : activeTab === 'produits'
                    ? 'Aucun produit disponible pour le moment'
                    : 'Aucun article disponible pour le moment'}
              </p>
            </div>
          )
        ) : (
          <AboutTab business={business} memberSince={memberSince} />
        )}
      </div>

      {/* Trust footer */}
      <div className="bg-muted mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🔒', label: 'Paiement securise' },
              { icon: '✓', label: 'Certifie par Club M' },
              { icon: '🚚', label: 'Livraison a Kinshasa' },
              { icon: '💬', label: 'Service client disponible' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CatalogProductCard({
  product,
  business,
}: {
  product: ProductData
  business: StoreCatalogProps['business']
}) {
  const isService = product.type === 'SERVICE'
  const currencySymbol = CURRENCY_SYMBOLS[product.currency] ?? '$'
  const image = product.images[0] ?? null

  // Stock display
  const stockLabel =
    !isService && product.stock !== null
      ? product.stock > 5
        ? { text: 'En stock', color: 'text-emerald-600 bg-emerald-50' }
        : product.stock > 0
          ? { text: `${product.stock} restant${product.stock > 1 ? 's' : ''}`, color: 'text-amber-600 bg-amber-50' }
          : { text: 'Rupture', color: 'text-red-600 bg-red-50' }
      : null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#a55b46]/20 to-[#091626]/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary/30">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium ${
            isService ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
          }`}
        >
          {isService ? 'Service' : 'Produit'}
        </span>

        {/* Stock badge */}
        {stockLabel && (
          <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${stockLabel.color}`}>
            {stockLabel.text}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {isService && product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.description}</p>
        )}

        <p className="font-bold text-foreground text-lg mb-3">
          {isService && product.price === 0
            ? 'Sur devis'
            : isService
              ? `A partir de ${product.price.toLocaleString('fr-FR')}${currencySymbol}`
              : `${product.price.toLocaleString('fr-FR')}${currencySymbol}`}
        </p>

        {/* CTA */}
        {isService ? (
          <ServiceContactButton
            serviceName={product.name}
            whatsapp={business.whatsapp}
            phone={business.phone}
            hasPrice={product.price > 0}
          />
        ) : (
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              images: product.images,
              price: product.price,
              currency: product.currency,
              type: product.type as 'PHYSICAL' | 'DIGITAL',
              stock: product.stock,
            }}
            business={{
              id: business.id,
              name: business.businessName,
              slug: business.slug,
            }}
          />
        )}
      </div>
    </div>
  )
}

function AboutTab({
  business,
  memberSince,
}: {
  business: StoreCatalogProps['business']
  memberSince: string
}) {
  return (
    <div className="max-w-2xl space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">A propos</h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {business.description}
        </p>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Contact</h3>
        <div className="space-y-3">
          {business.phone && (
            <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-foreground">
              <Phone className="w-4 h-4 text-gray-400" />
              {business.phone}
            </a>
          )}
          {business.email && (
            <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-foreground">
              <Mail className="w-4 h-4 text-gray-400" />
              {business.email}
            </a>
          )}
          {business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-600 hover:text-foreground"
            >
              <span className="w-4 h-4 text-gray-400 text-center text-xs">WA</span>
              {business.whatsapp}
            </a>
          )}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-600 hover:text-foreground"
            >
              <Globe className="w-4 h-4 text-gray-400" />
              {business.website}
            </a>
          )}
          {business.address && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {business.address}
            </div>
          )}
        </div>
      </div>

      {/* Member info */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Fondatrice</h3>
        <div className="flex items-center gap-4 bg-muted rounded-2xl p-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {business.member.avatar ? (
              <img
                src={business.member.avatar}
                alt=""
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {business.member.firstName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {business.member.firstName} {business.member.lastName}
            </p>
            <p className="text-sm text-gray-500">
              Membre {business.member.tier === 'BUSINESS' ? 'Business' : 'Premium'} depuis {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Trust */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Garanties</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-emerald-50 text-emerald-700 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4" />
            Certifie Club M
          </span>
          <span className="bg-emerald-50 text-emerald-700 rounded-full px-4 py-2 text-sm font-medium">
            Profil verifie
          </span>
        </div>
      </div>
    </div>
  )
}
