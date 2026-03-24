import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import {
  getBusinessDashboardStats,
  getBusinessRecentOrders,
  getBusinessRevenueByMonth,
} from '@/domains/business/dashboard-queries'
import { TIER_LABELS, CURRENCY_SYMBOLS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BusinessProfileForm } from '@/components/directory/business-profile-form'
import { PublishToggle } from '@/components/directory/publish-toggle'
import { KpiCard } from '@/components/business/kpi-card'
import { RevenueChart } from '@/components/business/revenue-chart'
import { hasMinTier } from '@/lib/permissions'
import type { MemberTier, Currency } from '@/lib/generated/prisma/client'

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

  // Load dashboard data for STORE profiles
  const isStore = profile.profileType === 'STORE'
  const [stats, recentOrders, revenueByMonth] = isStore
    ? await Promise.all([
        getBusinessDashboardStats(profile.id),
        getBusinessRecentOrders(profile.id, 5),
        getBusinessRevenueByMonth(profile.id),
      ])
    : [null, null, null]

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

      {/* Dashboard section for STORE profiles */}
      {isStore && stats && recentOrders && revenueByMonth && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Chiffre d'affaires"
              value={`${stats.totalRevenue.toLocaleString('fr-FR')}$`}
            />
            <KpiCard
              label="Commandes"
              value={stats.totalOrders}
            />
            <KpiCard
              label="En cours"
              value={stats.pendingOrders}
            />
            <KpiCard
              label="Completees"
              value={stats.completedOrders}
            />
          </div>

          {/* Revenue chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenus (6 derniers mois)</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={revenueByMonth} />
            </CardContent>
          </Card>

          {/* Recent orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Commandes recentes</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/mon-business/commandes">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aucune commande pour le moment.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order) => {
                    const buyer = order.member ?? order.customer
                    const buyerName = buyer
                      ? `${buyer.firstName} ${buyer.lastName}`
                      : 'Client'
                    const itemNames = order.items
                      .map((i) => i.product.name)
                      .join(', ')
                    return (
                      <Link
                        key={order.id}
                        href={`/mon-business/commandes/${order.id}`}
                        className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                      >
                        <div>
                          <span className="font-medium">{buyerName}</span>
                          <span className="ml-2 text-muted-foreground">
                            {itemNames}
                          </span>
                        </div>
                        <span className="font-medium">
                          {Number(order.totalAmount).toLocaleString('fr-FR')}$
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick action links */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/mon-business/produits">Tous mes produits</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/mon-business/commandes">Toutes mes commandes</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/mon-business/clients">Mes clients</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/mon-business/revenus">Mes revenus</Link>
            </Button>
          </div>
        </>
      )}

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
