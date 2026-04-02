import { notFound } from 'next/navigation'
import { getTontineById, getLateMembers } from '@/domains/tontines/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/generated/prisma/client'
import { TontineDetailActions } from './tontine-detail-actions'

export default async function AdminTontineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [tontine, lateMembers] = await Promise.all([
    getTontineById(id),
    getLateMembers(id),
  ])

  if (!tontine) notFound()

  const symbol = CURRENCY_SYMBOLS[tontine.currency as Currency] ?? '$'
  const lateCount = lateMembers.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tontine.name}</h1>
          {tontine.code && <p className="text-muted-foreground">Code : {tontine.code}</p>}
        </div>
        <TontineDetailActions tontineId={tontine.id} status={tontine.status} />
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Montant mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Number(tontine.monthlyAmount).toLocaleString()} {symbol}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duree</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tontine.durationMonths} mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tontine._count.members} / {tontine.totalSpots}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En retard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${lateCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {lateCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {tontine.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tontine.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Members table */}
      <Card>
        <CardHeader>
          <CardTitle>Membres ({tontine.members.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Membre</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Inscrit le</th>
                  <th className="text-left p-4 font-medium">Paiements</th>
                </tr>
              </thead>
              <tbody>
                {tontine.members.map((m) => {
                  const paidCount = m.payments.filter((p) => p.status === 'SUCCESS').length
                  const totalPayments = m.payments.length
                  return (
                    <tr key={m.id} className="border-b">
                      <td className="p-4 font-medium">
                        {m.member.firstName} {m.member.lastName}
                        {m.member.phone && <span className="text-muted-foreground text-xs ml-2">{m.member.phone}</span>}
                      </td>
                      <td className="p-4">
                        <Badge variant={m.role === 'ADMIN' ? 'default' : 'secondary'}>{m.role}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={m.status === 'ACTIVE' ? 'default' : 'destructive'}>{m.status}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{m.joinedAt.toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">{paidCount}/{totalPayments}</td>
                    </tr>
                  )
                })}
                {tontine.members.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Aucun membre inscrit
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
