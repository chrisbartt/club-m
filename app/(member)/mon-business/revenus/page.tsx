import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  getBusinessDashboardStats,
  getBusinessRevenueByMonth,
} from '@/domains/business/dashboard-queries'
import { KpiCard } from '@/components/business/kpi-card'
import { RevenueChart } from '@/components/business/revenue-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const MONTH_LABELS: Record<string, string> = {
  '01': 'Janvier',
  '02': 'Fevrier',
  '03': 'Mars',
  '04': 'Avril',
  '05': 'Mai',
  '06': 'Juin',
  '07': 'Juillet',
  '08': 'Aout',
  '09': 'Septembre',
  '10': 'Octobre',
  '11': 'Novembre',
  '12': 'Decembre',
}

export const metadata = {
  title: 'Mes revenus | Club M',
}

export default async function RevenusPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })
  if (!user?.member) redirect('/')

  const profile = await db.businessProfile.findUnique({
    where: { memberId: user.member.id },
  })

  if (!profile || profile.profileType !== 'STORE') {
    redirect('/mon-business')
  }

  const [stats, revenueByMonth] = await Promise.all([
    getBusinessDashboardStats(profile.id),
    getBusinessRevenueByMonth(profile.id),
  ])

  const avgPerMonth =
    revenueByMonth.length > 0
      ? stats.totalRevenue / revenueByMonth.length
      : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes revenus</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard
          label="Chiffre d'affaires total"
          value={`${stats.totalRevenue.toLocaleString('fr-FR')}$`}
        />
        <KpiCard
          label="Moyenne par mois"
          value={`${Math.round(avgPerMonth).toLocaleString('fr-FR')}$`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolution du chiffre d&apos;affaires</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={revenueByMonth} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detail par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mois</TableHead>
                <TableHead className="text-right">Revenu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueByMonth.map((entry) => {
                const [year, month] = entry.month.split('-')
                return (
                  <TableRow key={entry.month}>
                    <TableCell className="font-medium">
                      {MONTH_LABELS[month] ?? month} {year}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.revenue.toLocaleString('fr-FR')}$
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
