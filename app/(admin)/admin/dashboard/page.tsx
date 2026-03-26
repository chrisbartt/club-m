import Link from 'next/link'
import { Users, Calendar, ShoppingCart, DollarSign, ShieldCheck, Crown, Briefcase, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import {
  getGlobalDashboardStats,
  getMemberGrowthByMonth,
  getRevenueByMonth,
} from '@/domains/admin-dashboard-queries'
import { MemberGrowthChart, RevenueChart } from '@/components/admin/admin-charts'

export default async function AdminDashboardPage() {
  const [stats, memberGrowth, revenueByMonth] = await Promise.all([
    getGlobalDashboardStats(),
    getMemberGrowthByMonth(),
    getRevenueByMonth(),
  ])

  const kpis = [
    { label: 'Total membres', value: stats.members.total, icon: Users, color: 'text-blue-500' },
    { label: 'Free', value: stats.members.free, icon: UserPlus, color: 'text-gray-500' },
    { label: 'Premium', value: stats.members.premium, icon: Crown, color: 'text-amber-500' },
    { label: 'Business', value: stats.members.business, icon: Briefcase, color: 'text-purple-500' },
    {
      label: 'Revenus totaux',
      value: `${CURRENCY_SYMBOLS.USD}${stats.revenue.toLocaleString('fr-FR')}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    { label: 'KYC en attente', value: stats.pendingKyc, icon: ShieldCheck, color: 'text-orange-500' },
  ]

  const quickActions = [
    { label: 'Voir les membres', href: '/admin/membres' },
    { label: `KYC en attente (${stats.pendingKyc})`, href: '/admin/kyc' },
    { label: 'Voir les commandes', href: '/admin/commandes' },
    { label: 'Voir les evenements', href: '/admin/evenements' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de la plateforme Club M</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des membres</CardTitle>
          </CardHeader>
          <CardContent>
            {memberGrowth.length > 0 ? (
              <MemberGrowthChart data={memberGrowth} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Pas encore de donnees
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByMonth.length > 0 ? (
              <RevenueChart data={revenueByMonth} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Pas encore de donnees
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Button key={action.href} variant="outline" asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Evenements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.events.published} publie(s) sur {stats.events.total} au total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.orders.completed} completee(s) sur {stats.orders.total} au total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
