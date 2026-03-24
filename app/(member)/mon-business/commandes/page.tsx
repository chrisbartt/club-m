import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getSellerOrders } from '@/domains/orders/queries'
import { SellerOrderCard } from '@/components/orders/seller-order-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { OrderStatus } from '@/lib/generated/prisma/client'

export const metadata = {
  title: 'Mes commandes | Club M',
}

export default async function SellerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
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

  const { status } = await searchParams
  const statusFilter = status as OrderStatus | undefined
  const orders = await getSellerOrders(profile.id, statusFilter)

  const paidOrders = orders.filter((o) => o.status === 'PAID')
  const shippedOrders = orders.filter((o) => o.status === 'SHIPPED')
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes commandes</h1>

      <Tabs defaultValue={status ?? 'all'}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <a href="/mon-business/commandes">
              Tous ({orders.length})
            </a>
          </TabsTrigger>
          <TabsTrigger value="PAID" asChild>
            <a href="/mon-business/commandes?status=PAID">
              En attente ({paidOrders.length})
            </a>
          </TabsTrigger>
          <TabsTrigger value="SHIPPED" asChild>
            <a href="/mon-business/commandes?status=SHIPPED">
              Expediees ({shippedOrders.length})
            </a>
          </TabsTrigger>
          <TabsTrigger value="COMPLETED" asChild>
            <a href="/mon-business/commandes?status=COMPLETED">
              Completees ({completedOrders.length})
            </a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={status ?? 'all'} className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Aucune commande pour le moment.
            </p>
          ) : (
            orders.map((order) => (
              <SellerOrderCard key={order.id} order={order} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
