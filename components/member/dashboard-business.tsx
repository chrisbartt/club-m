import Link from 'next/link'
import type { getMemberProfile, getMemberStats } from '@/domains/members/profile-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardProps {
  profile: NonNullable<Awaited<ReturnType<typeof getMemberProfile>>>
  stats: Awaited<ReturnType<typeof getMemberStats>>
}

export function DashboardBusiness({ profile, stats }: DashboardProps) {
  const isVerified = profile.verificationStatus === 'VERIFIED'
  const business = profile.businessProfile

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Bonjour, {profile.firstName} !</h1>
        <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          Membre Business
        </span>
        {isVerified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Profil verifie
          </span>
        )}
      </div>

      {business && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mon business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">{business.businessName}</p>
            <p className="text-sm text-muted-foreground">
              Type : {business.profileType === 'STORE' ? 'Boutique' : 'Vitrine'}
            </p>
            {business.isApproved ? (
              <p className="text-sm text-green-600">Business approuve</p>
            ) : (
              <p className="text-sm text-muted-foreground">En attente d&apos;approbation</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.ticketCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.orderCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-start gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Gerer mon business</p>
            <p className="text-sm text-muted-foreground">
              Produits, commandes et outils business.
            </p>
          </div>
          <Button asChild>
            <Link href="/mon-business">Acceder</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
