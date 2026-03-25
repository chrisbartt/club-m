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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BusinessProfileForm } from '@/components/directory/business-profile-form'
import { RevenueChart } from '@/components/business/revenue-chart'
import { OrdersStatusChart } from '@/components/business/orders-status-chart'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  Plus,
  Package,
  Download,
  Bell,
  AlertTriangle,
  Eye,
} from 'lucide-react'

export const metadata = {
  title: 'Mon business | Club M',
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('fr-FR') + '$'
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PAID':
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Payée</Badge>
    case 'PENDING':
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">En attente</Badge>
    case 'SHIPPED':
      return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20">Expédiée</Badge>
    case 'DELIVERED':
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">Livrée</Badge>
    case 'COMPLETED':
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Complétée</Badge>
    case 'CANCELLED':
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Annulée</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
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
      <div className="p-6">
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
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Créer votre profil business</h1>
        <BusinessProfileForm mode="create" />
      </div>
    )
  }

  // Not a STORE type — show upgrade prompt
  if (profile.profileType !== 'STORE') {
    return (
      <div className="p-6 space-y-6">
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
  const avgBasket = stats.totalOrders > 0
    ? Math.round(stats.totalRevenue / stats.totalOrders)
    : 0

  const paidOrders = allOrders.filter((o) =>
    ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(o.status)
  ).length
  const paymentRate = stats.totalOrders > 0
    ? Math.round((paidOrders / stats.totalOrders) * 100)
    : 0

  // Orders today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const ordersToday = allOrders.filter((o) => new Date(o.createdAt) >= today).length

  // Order status counts for pie chart
  const statusCounts = allOrders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusChartData = [
    { name: 'Payée', value: statusCounts['PAID'] || 0, color: '#10b981' },
    { name: 'En attente', value: statusCounts['PENDING'] || 0, color: '#f59e0b' },
    { name: 'Expédiée', value: statusCounts['SHIPPED'] || 0, color: '#a855f7' },
    { name: 'Livrée', value: statusCounts['DELIVERED'] || 0, color: '#3b82f6' },
    { name: 'Complétée', value: statusCounts['COMPLETED'] || 0, color: '#06b6d4' },
    { name: 'Annulée', value: statusCounts['CANCELLED'] || 0, color: '#ef4444' },
  ].filter((d) => d.value > 0)

  // Low stock products (stock <= 5)
  const lowStockProducts = products
    .filter((p) => p.stock !== null && p.stock <= 5 && p.isActive)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, 5)

  // Top products by orders
  const productOrderCounts = new Map<string, { name: string; count: number; revenue: number }>()
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
  const alertsCount = lowStockProducts.length + (stats.pendingOrders > 0 ? 1 : 0)

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Row 1: KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Chiffre d'affaires */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Chiffre d&apos;affaires
                </p>
                <p className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                <DollarSign className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-3">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[11px] font-medium hover:bg-emerald-500/10">
                {paidOrders} commandes payées
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Commandes */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Commandes
                </p>
                <p className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">
                {ordersToday} aujourd&apos;hui
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Panier moyen */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Panier moyen
                </p>
                <p className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {formatCurrency(avgBasket)}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">
                par commande
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Taux de paiement */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Taux de paiement
                </p>
                <p className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {paymentRate}%
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-3">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[11px] font-medium hover:bg-emerald-500/10">
                {paidOrders}/{stats.totalOrders} payées
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="gap-2 border-border/50"
          disabled
        >
          <ShoppingCart size={16} />
          Nouvelle commande
        </Button>
        <Button asChild className="gap-2 bg-primaryColor hover:bg-primaryColor/90">
          <Link href="/mon-business/produits/nouveau">
            <Plus size={16} />
            Ajouter produit
          </Link>
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-border/50"
          disabled
        >
          <Download size={16} />
          Exporter CSV
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-border/50 relative"
          disabled
        >
          <Bell size={16} />
          Alertes
          {alertsCount > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              {alertsCount}
            </span>
          )}
        </Button>
      </div>

      {/* Row 3: Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenus</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">6 derniers mois</p>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueByMonth} />
          </CardContent>
        </Card>

        {/* Orders Status Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Commandes par statut</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{stats.totalOrders} commandes au total</p>
            </div>
          </CardHeader>
          <CardContent>
            <OrdersStatusChart data={statusChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Bottom section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Dernieres commandes — 2/3 */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Dernières commandes</CardTitle>
            <Button asChild variant="outline" size="sm" className="border-border/50">
              <Link href="/mon-business/commandes">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune commande pour le moment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="pb-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Client
                      </th>
                      <th className="pb-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="pb-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="pb-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="pb-3 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {recentOrders.map((order) => {
                      const buyer = order.member ?? order.customer
                      const buyerName = buyer
                        ? `${buyer.firstName} ${buyer.lastName}`
                        : 'Client'
                      return (
                        <tr key={order.id} className="group">
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{buyerName}</p>
                            </div>
                          </td>
                          <td className="py-3 font-medium">
                            {formatCurrency(Number(order.totalAmount))}
                          </td>
                          <td className="py-3">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              href={`/mon-business/commandes/${order.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              <Eye size={14} />
                              Voir
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right sidebar — 1/3 */}
        <div className="space-y-4">
          {/* Alertes */}
          {stats.pendingOrders > 0 && (
            <Card className="border-border/50 border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-amber-500">{stats.pendingOrders}</span>{' '}
                  commande{stats.pendingOrders > 1 ? 's' : ''} en attente de traitement
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stock faible */}
          {lowStockProducts.length > 0 && (
            <Card className="border-border/50 border-red-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4 text-red-500" />
                  Stock faible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lowStockProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate pr-2">{product.name}</span>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-red-500/20 text-red-500 text-[11px]"
                      >
                        {product.stock} restant{(product.stock ?? 0) > 1 ? 's' : ''}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Top produits */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top produits</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune vente pour le moment</p>
              ) : (
                <ul className="space-y-3">
                  {topProducts.map((product, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="truncate">{product.name}</span>
                      </div>
                      <span className="shrink-0 font-medium text-muted-foreground">
                        {formatCurrency(product.revenue)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Clients count */}
          <Card className="border-border/50">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium">Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="border-border/50">
                <Link href="/mon-business/clients">Voir</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
