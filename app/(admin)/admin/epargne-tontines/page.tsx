import { getAdminTontines, getTontineStats } from '@/domains/tontines/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { PiggyBank, Users, Clock, Plus } from 'lucide-react'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency, TontineStatus } from '@/lib/generated/prisma/client'

const STATUS_LABELS: Record<TontineStatus, string> = {
  DRAFT: 'Brouillon',
  OPEN: 'Ouverte',
  ACTIVE: 'Active',
  COMPLETED: 'Terminee',
  CANCELLED: 'Annulee',
}

const STATUS_COLORS: Record<TontineStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  OPEN: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default async function AdminTontinesPage() {
  const [tontines, stats] = await Promise.all([
    getAdminTontines(),
    getTontineStats(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Epargne / Tontines</h1>
        <Button asChild>
          <Link href="/admin/epargne-tontines/nouveau">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle tontine
          </Link>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total tontines</CardTitle>
            <PiggyBank className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ouvertes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membres actifs</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalMembers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paiements en attente</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Nom</th>
                  <th className="text-left p-4 font-medium">Montant/mois</th>
                  <th className="text-left p-4 font-medium">Duree</th>
                  <th className="text-left p-4 font-medium">Places</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Debut</th>
                </tr>
              </thead>
              <tbody>
                {tontines.map((t) => {
                  const symbol = CURRENCY_SYMBOLS[t.currency as Currency] ?? '$'
                  return (
                    <tr key={t.id} className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <Link href={`/admin/epargne-tontines/${t.id}`} className="font-medium hover:underline">
                          {t.name}
                        </Link>
                        {t.code && <span className="text-muted-foreground text-xs ml-2">({t.code})</span>}
                        {t.isPremium && <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>}
                      </td>
                      <td className="p-4">{Number(t.monthlyAmount).toLocaleString()} {symbol}</td>
                      <td className="p-4">{t.durationMonths} mois</td>
                      <td className="p-4">{t._count.members}/{t.totalSpots}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                          {STATUS_LABELS[t.status]}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {t.startDate.toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  )
                })}
                {tontines.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Aucune tontine pour le moment
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
