import Link from 'next/link'
import type { getMemberProfile, getMemberStats } from '@/domains/members/profile-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardProps {
  profile: NonNullable<Awaited<ReturnType<typeof getMemberProfile>>>
  stats: Awaited<ReturnType<typeof getMemberStats>>
}

export function DashboardFree({ profile, stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {profile.firstName} !</h1>
        <span className="mt-1 inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
          Membre Free
        </span>
      </div>

      {profile.verificationStatus === 'DECLARED' && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Votre profil n&apos;est pas encore verifie.{' '}
              <Link href="/kyc" className="font-medium underline">
                Soumettez vos documents
              </Link>{' '}
              pour debloquer plus de fonctionnalites.
            </p>
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
            <p className="font-semibold">Passez Premium pour plus d&apos;avantages</p>
            <p className="text-sm text-muted-foreground">
              Visibilite, networking et evenements exclusifs.
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
