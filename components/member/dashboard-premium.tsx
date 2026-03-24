import Link from 'next/link'
import type { getMemberProfile, getMemberStats } from '@/domains/members/profile-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardProps {
  profile: NonNullable<Awaited<ReturnType<typeof getMemberProfile>>>
  stats: Awaited<ReturnType<typeof getMemberStats>>
}

export function DashboardPremium({ profile, stats }: DashboardProps) {
  const isVerified = profile.verificationStatus === 'VERIFIED'
  const showcase = profile.businessProfile?.profileType === 'SHOWCASE'
    ? profile.businessProfile
    : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Bonjour, {profile.firstName} !</h1>
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          Membre Premium
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

      {showcase && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Votre vitrine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{showcase.businessName}</p>
            {showcase.isApproved ? (
              <p className="text-sm text-green-600">Vitrine approuvee</p>
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
            <p className="font-semibold">Passez Business pour vendre vos produits</p>
            <p className="text-sm text-muted-foreground">
              Fiche business avancee, vente et systeme de paiement.
            </p>
          </div>
          <Button asChild>
            <Link href="/upgrade">Decouvrir</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
