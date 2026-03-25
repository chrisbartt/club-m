import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  getBusinessDashboardStats,
  getBusinessRevenueByMonth,
} from '@/domains/business/dashboard-queries'
import { KpiCard } from '@/components/business/kpi-card'
import { RevenueChart } from '@/components/business/revenue-chart'
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react'

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
  title: 'Revenus | Club M',
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Revenus</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suivez l&apos;evolution de votre chiffre d&apos;affaires
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Chiffre d'affaires"
          value={`${stats.totalRevenue.toLocaleString('fr-FR')}$`}
          icon={<DollarSign className="h-5 w-5" />}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-400"
        />
        <KpiCard
          label="Moyenne / mois"
          value={`${Math.round(avgPerMonth).toLocaleString('fr-FR')}$`}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
        />
        <KpiCard
          label="Total commandes"
          value={String(stats.totalOrders)}
          icon={<ShoppingCart className="h-5 w-5" />}
          iconBg="bg-purple-500/10"
          iconColor="text-purple-400"
        />
        <KpiCard
          label="Completees"
          value={String(stats.completedOrders)}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-400"
        />
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
        <h2 className="text-lg font-semibold text-white">
          Evolution du chiffre d&apos;affaires
        </h2>
        <div className="mt-4">
          <RevenueChart data={revenueByMonth} />
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
        <h2 className="text-lg font-semibold text-white">Detail par mois</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Mois
                </th>
                <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Revenu
                </th>
                <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Part du total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {revenueByMonth.map((entry) => {
                const [year, month] = entry.month.split('-')
                const pct =
                  stats.totalRevenue > 0
                    ? ((entry.revenue / stats.totalRevenue) * 100).toFixed(1)
                    : '0'
                return (
                  <tr
                    key={entry.month}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-3 font-medium text-white">
                      {MONTH_LABELS[month] ?? month} {year}
                    </td>
                    <td className="py-3 text-right font-semibold text-white">
                      {entry.revenue.toLocaleString('fr-FR')}$
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-[#8b5cf6]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
