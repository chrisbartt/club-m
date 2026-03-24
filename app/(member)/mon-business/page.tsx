import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import { TIER_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BusinessProfileForm } from '@/components/directory/business-profile-form'
import { PublishToggle } from '@/components/directory/publish-toggle'
import { hasMinTier } from '@/lib/permissions'
import type { MemberTier } from '@/lib/generated/prisma/client'

export const metadata = {
  title: 'Mon business | Club M',
}

export default async function MonBusinessPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/')

  const member = user.member

  // Tier check: PREMIUM or above required
  if (!hasMinTier(member.tier, 'PREMIUM')) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mon business</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="mb-2 text-lg font-semibold">
              Passez Premium pour creer votre fiche business
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Les membres {TIER_LABELS.PREMIUM} et {TIER_LABELS.BUSINESS} peuvent creer un profil
              dans l&apos;annuaire Club M.
            </p>
            <Button asChild>
              <Link href="/upgrade">Passer Premium</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = await getProfileByMemberId(member.id)

  // No profile yet — show creation form
  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mon business</h1>
        <BusinessProfileForm mode="create" />
      </div>
    )
  }

  // Has profile — show management view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mon business</h1>
        <PublishToggle
          profileId={profile.id}
          isPublished={profile.isPublished}
          isApproved={profile.isApproved}
        />
      </div>

      {/* Status summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statut du profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium">{profile.businessName}</span>
            <Badge variant="secondary">{profile.category}</Badge>
            <Badge variant="outline">
              {profile.profileType === 'STORE' ? 'Boutique' : 'Vitrine'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={profile.isApproved ? 'default' : 'secondary'}>
              {profile.isApproved ? 'Approuve' : 'En attente d\'approbation'}
            </Badge>
            <Badge variant={profile.isPublished ? 'default' : 'outline'}>
              {profile.isPublished ? 'Publie' : 'Non publie'}
            </Badge>
          </div>

          {!profile.isApproved && (
            <p className="text-sm text-muted-foreground">
              Votre profil est en cours de revision par l&apos;equipe Club M.
              Vous pourrez le publier une fois approuve.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Profile type info */}
      {profile.profileType === 'STORE' && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Mes produits</p>
              <p className="text-sm text-muted-foreground">
                {profile.products.length} produit{profile.products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/mon-business/produits">Gerer mes produits</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {profile.profileType === 'SHOWCASE' && (
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Votre profil est une vitrine.{' '}
              <Link href="/upgrade" className="text-primary hover:underline">
                Passez Business pour vendre.
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit form */}
      <BusinessProfileForm
        mode="edit"
        defaultValues={{
          id: profile.id,
          businessName: profile.businessName,
          description: profile.description,
          category: profile.category,
          phone: profile.phone,
          email: profile.email,
          website: profile.website,
          whatsapp: profile.whatsapp,
          address: profile.address,
          coverImage: profile.coverImage,
        }}
      />
    </div>
  )
}
