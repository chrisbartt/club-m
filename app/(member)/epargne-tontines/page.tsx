import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getMemberTontines, getOpenTontines } from '@/domains/tontines/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/generated/prisma/client'
import { PiggyBank, Users, Calendar } from 'lucide-react'
import { JoinTontineButton } from './join-tontine-button'

export const metadata = {
  title: 'Epargne Intelligente | Club M',
}

export default async function MemberTontinesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/login')

  const [myTontines, openTontines] = await Promise.all([
    getMemberTontines(user.member.id),
    getOpenTontines(),
  ])

  // Filter out tontines the member already joined
  const myTontineIds = new Set(myTontines.map((t) => t.tontineId))
  const availableTontines = openTontines.filter((t) => !myTontineIds.has(t.id))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Epargne Intelligente</h1>
        <p className="text-muted-foreground">Rejoins des tontines digitales securisees</p>
      </div>

      {/* My tontines */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PiggyBank className="w-5 h-5" />
          Mes tontines ({myTontines.length})
        </h2>

        {myTontines.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {myTontines.map((membership) => {
              const t = membership.tontine
              const symbol = CURRENCY_SYMBOLS[t.currency as Currency] ?? '$'
              const nextPayment = membership.payments[0]
              return (
                <Card key={membership.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      {t.isPremium && <Badge variant="secondary">Premium</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Montant mensuel</span>
                      <span className="font-medium">{Number(t.monthlyAmount).toLocaleString()} {symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Membres</span>
                      <span className="font-medium">{t._count.members}/{t.totalSpots}</span>
                    </div>
                    {nextPayment && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Prochain paiement</span>
                        <span className="font-medium text-orange-600">
                          {nextPayment.dueDate.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Vous n&apos;etes inscrit a aucune tontine pour le moment.
            </CardContent>
          </Card>
        )}
      </section>

      {/* Available tontines */}
      {availableTontines.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tontines disponibles ({availableTontines.length})
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {availableTontines.map((t) => {
              const symbol = CURRENCY_SYMBOLS[t.currency as Currency] ?? '$'
              const spotsLeft = t.totalSpots - t._count.members
              return (
                <Card key={t.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      {t.isPremium && <Badge variant="secondary">Premium</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Montant mensuel</span>
                      <span className="font-medium">{Number(t.monthlyAmount).toLocaleString()} {symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duree</span>
                      <span className="font-medium">{t.durationMonths} mois</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Debut
                      </span>
                      <span className="font-medium">{t.startDate.toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Places restantes</span>
                      <span className={`font-medium ${spotsLeft <= 3 ? 'text-red-600' : ''}`}>
                        {spotsLeft}/{t.totalSpots}
                      </span>
                    </div>
                    {t.description && (
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    )}
                    <JoinTontineButton tontineId={t.id} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
