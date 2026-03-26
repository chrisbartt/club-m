import { redirect } from 'next/navigation'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'
import { getProfileBySlug } from '@/domains/directory/queries'
import { getBusinessAverageRating } from '@/domains/reviews/queries'
import StoreHero from '@/components/boutique/store-hero'
import StoreCatalog from '@/components/boutique/store-catalog'
import { StarDisplay } from '@/components/orders/star-display'
import type { Metadata } from 'next'

interface BoutiquePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BoutiquePageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile || !profile.isPublished || !profile.isApproved || profile.profileType !== 'STORE') {
    return { title: 'Boutique — Club M' }
  }

  return {
    title: `${profile.businessName} — Club M`,
    description: profile.description?.slice(0, 160),
  }
}

export default async function BoutiquePage({ params }: BoutiquePageProps) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  // Guard: only show published + approved STORE profiles
  if (!profile || !profile.isPublished || !profile.isApproved || profile.profileType !== 'STORE') {
    redirect('/marketplace')
  }

  const ratingInfo = await getBusinessAverageRating(profile.id)

  // Serialize products for client component (Decimal -> number)
  const serializedProducts = profile.products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: typeof p.price === 'object' && p.price !== null && 'toNumber' in p.price
      ? (p.price as unknown as { toNumber(): number }).toNumber()
      : Number(p.price),
    currency: p.currency,
    images: p.images,
    type: p.type,
    category: p.category,
    stock: p.stock,
  }))

  return (
    <AppContainerWebSite>
      <StoreHero
        business={{
          businessName: profile.businessName,
          category: profile.category,
          coverImage: profile.coverImage,
          address: profile.address,
          phone: profile.phone,
          email: profile.email,
          whatsapp: profile.whatsapp,
          member: {
            firstName: profile.member.firstName,
            lastName: profile.member.lastName,
            avatar: profile.member.avatar,
          },
        }}
      />

      {ratingInfo.count > 0 && (
        <div className="flex items-center gap-2 px-4 py-2">
          <StarDisplay rating={ratingInfo.average} />
          <span className="text-sm text-muted-foreground">
            {ratingInfo.average.toFixed(1)} ({ratingInfo.count} avis)
          </span>
        </div>
      )}

      <div className="mt-6">
        <StoreCatalog
          business={{
            id: profile.id,
            businessName: profile.businessName,
            slug: profile.slug,
            description: profile.description,
            category: profile.category,
            phone: profile.phone,
            email: profile.email,
            website: profile.website,
            whatsapp: profile.whatsapp,
            address: profile.address,
            createdAt: profile.createdAt.toISOString(),
            member: {
              firstName: profile.member.firstName,
              lastName: profile.member.lastName,
              avatar: profile.member.avatar,
              tier: profile.member.tier,
            },
          }}
          products={serializedProducts}
        />
      </div>
    </AppContainerWebSite>
  )
}
