import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  getBusinessRevenueStats,
  getBusinessRevenueByMonthFiltered,
} from '@/domains/business/dashboard-queries'
import { KpiCard } from '@/components/business/kpi-card'
import { RevenueChart } from '@/components/business/revenue-chart'
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
  BarChart3,
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

const PERIOD_OPTIONS = [
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
  { value: '3m', label: '3 mois' },
  { value: '6m', label: '6 mois' },
  { value: 'all', label: 'Tout' },
]

const TYPE_LABELS: Record<string, string> = {
  PHYSICAL: 'Physique',
  SERVICE: 'Service',
  DIGITAL: 'Numérique',
}

const TYPE_COLORS: Record<string, string> = {
  PHYSICAL: 'bg-purple-500',
  SERVICE: 'bg-blue-500',
  DIGITAL: 'bg-cyan-500',
}

function getDateRange(period: string): { from: Date; to: Date } {
  const to = new Date()
  const from = new Date()
  switch (period) {
    case '7d':
      from.setDate(from.getDate() - 7)
      break
    case '30d':
      from.setDate(from.getDate() - 30)
      break
    case '3m':
      from.setMonth(from.getMonth() - 3)
      break
    case '6m':
      from.setMonth(from.getMonth() - 6)
      break
    default:
      from.setFullYear(2020)
      break
  }
  return { from, to }
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('fr-FR') + ' $US'
}

export const metadata = {
  title: 'Revenus | Club M',
}

export default async function RevenusPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
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

  const params = await searchParams
  const period = params.period ?? '6m'
  const { from, to } = getDateRange(period)

  const [revenueStats, revenueByMonth] = await Promise.all([
    getBusinessRevenueStats(profile.id, from, to),
    getBusinessRevenueByMonthFiltered(profile.id, from, to),
  ])

  const totalProductRevenue = revenueStats.revenueByProduct.reduce(
    (sum, p) => sum + p.revenue,
    0,
  )
  const totalTypeRevenue = revenueStats.revenueByType.reduce(
    (sum, t) => sum + t.revenue,
    0,
  )

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Revenus</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Suivez l&apos;evolution de votre chiffre d&apos;affaires
            </p>
          </div>

          {/* Period filter pills */}
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={`/mon-business/revenus?period=${opt.value}`}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  period === opt.value
                    ? 'bg-primary text-foreground'
                    : 'border border-border text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Chiffre d'affaires"
            value={formatCurrency(revenueStats.totalRevenue)}
            subtitle={`${revenueStats.paidOrdersCount} commandes payées`}
            icon={<DollarSign className="h-5 w-5" />}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-400"
            trend={
              revenueStats.revenueChange !== 0
                ? {
                    value: `${revenueStats.revenueChange > 0 ? '+' : ''}${revenueStats.revenueChange}%`,
                    positive: revenueStats.revenueChange > 0,
                  }
                : undefined
            }
          />
          <KpiCard
            label="Commandes"
            value={String(revenueStats.totalOrders)}
            icon={<ShoppingCart className="h-5 w-5" />}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-400"
            trend={
              revenueStats.ordersChange !== 0
                ? {
                    value: `${revenueStats.ordersChange > 0 ? '+' : ''}${revenueStats.ordersChange}%`,
                    positive: revenueStats.ordersChange > 0,
                  }
                : undefined
            }
          />
          <KpiCard
            label="Panier moyen"
            value={formatCurrency(revenueStats.avgBasket)}
            subtitle="par commande payée"
            icon={<TrendingUp className="h-5 w-5" />}
            iconBg="bg-purple-500/10"
            iconColor="text-purple-400"
          />
          <KpiCard
            label="Taux de complétion"
            value={`${revenueStats.completionRate}%`}
            subtitle={`${revenueStats.completedOrders} complétées / ${revenueStats.totalOrders} total`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-400"
            trend={
              revenueStats.completionRate > 0
                ? {
                    value: `${revenueStats.completionRate}%`,
                    positive: revenueStats.completionRate >= 50,
                  }
                : undefined
            }
          />
        </div>

        {/* Revenue chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Evolution du chiffre d&apos;affaires
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Période sélectionnée
          </p>
          <div className="mt-4">
            <RevenueChart data={revenueByMonth} />
          </div>
        </div>

        {/* Revenue breakdown grid */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Revenue by product */}
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-7">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <h2 className="text-base font-semibold text-foreground">
                Par produit
              </h2>
            </div>
            {revenueStats.revenueByProduct.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-muted-foreground">
                Aucune vente sur cette période
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Produit
                      </th>
                      <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Ventes
                      </th>
                      <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Revenu
                      </th>
                      <th className="pb-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        % du total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {revenueStats.revenueByProduct.map((product, idx) => {
                      const pct =
                        totalProductRevenue > 0
                          ? (
                              (product.revenue / totalProductRevenue) *
                              100
                            ).toFixed(1)
                          : '0'
                      return (
                        <tr
                          key={idx}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="py-3 pr-4">
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {TYPE_LABELS[product.type] ?? product.type}
                            </p>
                          </td>
                          <td className="py-3 text-right text-[13px] text-muted-foreground">
                            {product.sales}
                          </td>
                          <td className="py-3 text-right font-semibold text-foreground">
                            {formatCurrency(product.revenue)}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{
                                    width: `${pct}%`,
                                  }}
                                />
                              </div>
                              <span className="w-10 text-right text-[12px] text-muted-foreground">
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
            )}
          </div>

          {/* Right column: by type + orders ratio */}
          <div className="space-y-4 lg:col-span-5">
            {/* Revenue by type */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Par type</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Répartition du chiffre d&apos;affaires
              </p>
              {revenueStats.revenueByType.length === 0 ? (
                <p className="mt-4 text-[13px] text-muted-foreground">
                  Aucune donnée
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {revenueStats.revenueByType.map((item) => {
                    const pct =
                      totalTypeRevenue > 0
                        ? ((item.revenue / totalTypeRevenue) * 100).toFixed(1)
                        : '0'
                    return (
                      <div key={item.type}>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="font-medium text-foreground">
                            {TYPE_LABELS[item.type] ?? item.type}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {formatCurrency(item.revenue)}
                            </span>
                            <span className="text-[11px] text-muted-foreground/60">
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${TYPE_COLORS[item.type] ?? 'bg-gray-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Orders completion ratio */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Commandes</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Complétées vs Annulées
              </p>
              <div className="mt-5 space-y-4">
                {/* Completed bar */}
                <div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-emerald-400">
                      Complétées / Livrées
                    </span>
                    <span className="text-muted-foreground">
                      {revenueStats.completedOrders}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width:
                          revenueStats.totalOrders > 0
                            ? `${(revenueStats.completedOrders / revenueStats.totalOrders) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Cancelled bar */}
                <div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-red-400">Annulées</span>
                    <span className="text-muted-foreground">
                      {revenueStats.cancelledOrders}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all"
                      style={{
                        width:
                          revenueStats.totalOrders > 0
                            ? `${(revenueStats.cancelledOrders / revenueStats.totalOrders) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <span className="text-[12px] text-muted-foreground">
                    Taux de complétion
                  </span>
                  <span
                    className={`text-[13px] font-bold ${
                      revenueStats.completionRate >= 50
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {revenueStats.completionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly breakdown table */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">Détail par mois</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
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
              <tbody className="divide-y divide-border">
                {revenueByMonth.map((entry) => {
                  const [year, month] = entry.month.split('-')
                  const totalMonthlyRevenue = revenueByMonth.reduce(
                    (s, e) => s + e.revenue,
                    0,
                  )
                  const pct =
                    totalMonthlyRevenue > 0
                      ? ((entry.revenue / totalMonthlyRevenue) * 100).toFixed(1)
                      : '0'
                  return (
                    <tr
                      key={entry.month}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3 font-medium text-foreground">
                        {MONTH_LABELS[month] ?? month} {year}
                      </td>
                      <td className="py-3 text-right font-semibold text-foreground">
                        {entry.revenue.toLocaleString('fr-FR')} $US
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
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
