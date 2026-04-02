import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import {
  getBusinessDashboardStats,
  getBusinessRecentOrders,
  getBusinessRevenueByMonth,
  getBusinessClients,
} from '@/domains/business/dashboard-queries'
import { getProductsByBusiness } from '@/domains/business/queries'
import { getSellerOrders } from '@/domains/orders/queries'
import { hasMinTier } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BusinessProfileForm } from '@/components/directory/business-profile-form'
import { KpiCard } from '@/components/business/kpi-card'
import { RevenueChart } from '@/components/business/revenue-chart'
import { OrdersStatusChart } from '@/components/business/orders-status-chart'
import { RecentOrdersTable } from '@/components/business/recent-orders-table'
import { QuickActions } from '@/components/business/quick-actions'
import { AlertsSidebar } from '@/components/business/alerts-sidebar'
import { ActivityFeed } from '@/components/business/activity-feed'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Users,
  Clock,
  Truck,
  CalendarDays,
  Activity,
} from 'lucide-react'

export const metadata = {
  title: 'Mon business | Club M',
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('fr-FR') + ' $US'
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export default async function MonBusinessPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/')

  const member = user.member

  if (!hasMinTier(member.tier, 'PREMIUM')) {
    return (
      <div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="mb-2 text-lg font-semibold">
              Passez Premium pour accéder à votre espace business
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Les membres Premium et Business peuvent gérer leur commerce en ligne.
            </p>
            <Button asChild>
              <Link href="/upgrade">Passer Premium</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = await getProfileByMemberId(member.id)

  // No profile yet — show creation form
  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Créer votre profil business</h1>
        <BusinessProfileForm mode="create" />
      </div>
    )
  }

  // Not a STORE type — show upgrade prompt
  if (profile.profileType !== 'STORE') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Votre profil est une vitrine.{' '}
              <Link href="/upgrade" className="text-primary hover:underline">
                Passez Business pour vendre en ligne.
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Load all dashboard data in parallel
  const [stats, recentOrders, revenueByMonth, clients, products, allOrders] =
    await Promise.all([
      getBusinessDashboardStats(profile.id),
      getBusinessRecentOrders(profile.id, 5),
      getBusinessRevenueByMonth(profile.id),
      getBusinessClients(profile.id),
      getProductsByBusiness(profile.id),
      getSellerOrders(profile.id),
    ])

  // Calculate KPIs
  const avgBasket =
    stats.totalOrders > 0
      ? Math.round(stats.totalRevenue / stats.totalOrders)
      : 0

  const paidOrders = allOrders.filter((o) =>
    ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(o.status),
  ).length
  const paymentRate =
    stats.totalOrders > 0
      ? Math.round((paidOrders / stats.totalOrders) * 100)
      : 0

  // Orders today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const ordersToday = allOrders.filter(
    (o) => new Date(o.createdAt) >= today,
  )
  const revenueToday = ordersToday
    .filter((o) =>
      ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(o.status),
    )
    .reduce((sum, o) => sum + Number(o.totalAmount), 0)

  // Orders this week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  weekAgo.setHours(0, 0, 0, 0)
  const ordersThisWeek = allOrders.filter(
    (o) => new Date(o.createdAt) >= weekAgo,
  )
  const revenueThisWeek = ordersThisWeek
    .filter((o) =>
      ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(o.status),
    )
    .reduce((sum, o) => sum + Number(o.totalAmount), 0)

  // Actionable counts
  const pendingActionCount = allOrders.filter((o) => o.status === 'PAID').length
  const shippedCount = allOrders.filter((o) => o.status === 'SHIPPED').length

  // Order status counts for pie chart
  const statusCounts = allOrders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusChartData = [
    { name: 'Livrée', value: statusCounts['DELIVERED'] || 0, color: '#22c55e' },
    { name: 'Payée', value: statusCounts['PAID'] || 0, color: '#4ade80' },
    { name: 'En attente', value: statusCounts['PENDING'] || 0, color: '#f59e0b' },
    { name: 'Expédiée', value: statusCounts['SHIPPED'] || 0, color: '#8b5cf6' },
    { name: 'Complétée', value: statusCounts['COMPLETED'] || 0, color: '#06b6d4' },
    { name: 'Annulée', value: statusCounts['CANCELLED'] || 0, color: '#ef4444' },
  ].filter((d) => d.value > 0)

  // Low stock products (stock < 5)
  const lowStockProducts = products
    .filter((p) => p.stock !== null && p.stock < 5 && p.isActive)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, 5)

  // Top products by orders
  const productOrderCounts = new Map<
    string,
    { name: string; count: number; revenue: number }
  >()
  for (const order of allOrders) {
    for (const item of order.items) {
      const existing = productOrderCounts.get(item.productId)
      const itemRevenue = Number(item.unitPrice) * item.quantity
      if (existing) {
        existing.count += item.quantity
        existing.revenue += itemRevenue
      } else {
        productOrderCounts.set(item.productId, {
          name: item.product.name,
          count: item.quantity,
          revenue: itemRevenue,
        })
      }
    }
  }
  const topProducts = Array.from(productOrderCounts.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Alerts count
  const alertsCount =
    lowStockProducts.length + (stats.pendingOrders > 0 ? 1 : 0)

  // Prepare orders for table component
  const tableOrders = recentOrders.map((order) => {
    const buyer = order.member ?? order.customer
    const buyerName = buyer
      ? `${buyer.firstName} ${buyer.lastName}`
      : 'Client'
    const buyerPhone = buyer?.phone ?? null
    const buyerCommune =
      order.customer?.address?.commune ?? null
    return {
      id: order.id,
      buyerName,
      buyerPhone,
      buyerCommune,
      amount: Number(order.totalAmount),
      status: order.status,
      date: formatDate(order.createdAt),
    }
  })

  // Activity feed: last 8 orders sorted by date
  const activityItems = allOrders
    .slice(0, 8)
    .map((order) => {
      const buyer = order.member ?? order.customer
      return {
        id: order.id,
        type: order.status,
        buyerName: buyer
          ? `${buyer.firstName} ${buyer.lastName}`
          : 'Client',
        amount: Number(order.totalAmount),
        date: order.createdAt,
      }
    })

  return (
    <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Vue d&apos;ensemble de votre activité commerciale
          </p>
        </div>

        {/* Row 1: Main KPI Cards */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <KpiCard
            label="Chiffre d'affaires"
            value={formatCurrency(stats.totalRevenue)}
            subtitle={`${paidOrders} commandes payées`}
            icon={<DollarSign className="h-5 w-5" />}
            iconBg="bg-purple-500/10"
            iconColor="text-purple-500"
            href="/mon-business/revenus"
            trend={
              paidOrders > 0
                ? { value: `${paidOrders} payées`, positive: true }
                : undefined
            }
          />

          <KpiCard
            label="Commandes"
            value={String(stats.totalOrders)}
            subtitle={`${ordersToday.length} aujourd'hui`}
            icon={<ShoppingCart className="h-5 w-5" />}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-500"
            href="/mon-business/commandes"
          />

          <KpiCard
            label="Panier moyen"
            value={formatCurrency(avgBasket)}
            subtitle="par commande"
            icon={<TrendingUp className="h-5 w-5" />}
            iconBg="bg-orange-500/10"
            iconColor="text-orange-500"
            href="/mon-business/revenus"
          />

          <KpiCard
            label="Taux de paiement"
            value={`${paymentRate}%`}
            subtitle={`${paidOrders}/${stats.totalOrders} payées`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-500"
            trend={
              paymentRate > 0
                ? { value: `${paymentRate}%`, positive: paymentRate >= 50 }
                : undefined
            }
          />
        </div>

        {/* Row 2: Actionable KPI Cards */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <KpiCard
            label="CA aujourd'hui"
            value={formatCurrency(revenueToday)}
            subtitle={`${ordersToday.length} commande${ordersToday.length > 1 ? 's' : ''}`}
            icon={<CalendarDays className="h-5 w-5" />}
            iconBg="bg-cyan-500/10"
            iconColor="text-cyan-500"
            href="/mon-business/commandes"
          />

          <KpiCard
            label="CA cette semaine"
            value={formatCurrency(revenueThisWeek)}
            subtitle={`${ordersThisWeek.length} commande${ordersThisWeek.length > 1 ? 's' : ''}`}
            icon={<TrendingUp className="h-5 w-5" />}
            iconBg="bg-indigo-500/10"
            iconColor="text-indigo-500"
            href="/mon-business/revenus"
          />

          <KpiCard
            label="Commandes en attente"
            value={String(pendingActionCount)}
            subtitle="a traiter"
            icon={<Clock className="h-5 w-5" />}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-500"
            href="/mon-business/commandes?status=PAID"
            trend={
              pendingActionCount > 0
                ? {
                    value: `${pendingActionCount} en attente`,
                    positive: false,
                  }
                : undefined
            }
          />

          <KpiCard
            label="Commandes a livrer"
            value={String(shippedCount)}
            subtitle="en cours de livraison"
            icon={<Truck className="h-5 w-5" />}
            iconBg="bg-purple-500/10"
            iconColor="text-purple-500"
            href="/mon-business/commandes?status=SHIPPED"
            trend={
              shippedCount > 0
                ? { value: `${shippedCount} expediée${shippedCount > 1 ? 's' : ''}`, positive: true }
                : undefined
            }
          />
        </div>

        {/* Row 3: Quick Actions */}
        <QuickActions alertsCount={alertsCount} />

        {/* Row 4: Charts */}
        <div className="grid gap-3 md:gap-4 lg:grid-cols-12">
          {/* Revenue Chart */}
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-7">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground">Revenus</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                6 derniers mois
              </p>
            </div>
            <RevenueChart data={revenueByMonth} />
          </div>

          {/* Orders Status Chart */}
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Commandes par statut
              </h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Répartition actuelle
              </p>
            </div>
            <OrdersStatusChart
              data={statusChartData}
              total={stats.totalOrders}
            />
          </div>
        </div>

        {/* Row 5: Recent Orders + Activity Feed */}
        <div className="grid gap-3 md:gap-4 lg:grid-cols-12">
          {/* Recent Orders Table */}
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Dernières commandes
                </h2>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  Les 5 plus récentes
                </p>
              </div>
              <Link
                href="/mon-business/commandes"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-purple-400 transition-colors hover:text-purple-300"
              >
                Voir toutes
                <ArrowRight size={14} />
              </Link>
            </div>
            <RecentOrdersTable orders={tableOrders} />
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-4">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <h2 className="text-base font-semibold text-foreground">
                Activité récente
              </h2>
            </div>
            <ActivityFeed activities={activityItems} />
          </div>
        </div>

        {/* Row 6: Alerts Sidebar + Clients */}
        <div className="grid gap-3 md:gap-4 lg:grid-cols-12">
          {/* Alerts Sidebar */}
          <div className="lg:col-span-8">
            <AlertsSidebar
              pendingOrders={stats.pendingOrders}
              lowStockProducts={lowStockProducts.map((p) => ({
                id: p.id,
                name: p.name,
                stock: p.stock,
              }))}
              topProducts={topProducts}
            />
          </div>

          {/* Clients card */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Clients
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {clients.length}
                    </p>
                  </div>
                </div>
                <Link
                  href="/mon-business/clients"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-purple-400 transition-colors hover:text-purple-300"
                >
                  Voir
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
