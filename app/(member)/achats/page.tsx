import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getBuyerOrders } from '@/domains/orders/queries'
import { OrderCard } from '@/components/orders/order-card'
import { getMemberProfile } from '@/domains/members/profile-queries'
import Link from 'next/link'

export default async function AchatsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const member = await getMemberProfile(session.user.id)
  if (!member) redirect('/')

  const orders = await getBuyerOrders(member.id)

  const activeOrders = orders.filter(
    (o) => o.status === 'PAID' || o.status === 'SHIPPED',
  )
  const completedOrders = orders.filter(
    (o) => o.status === 'COMPLETED' || o.status === 'DELIVERED',
  )
  const otherOrders = orders.filter(
    (o) =>
      o.status !== 'PAID' &&
      o.status !== 'SHIPPED' &&
      o.status !== 'COMPLETED' &&
      o.status !== 'DELIVERED',
  )

  const hasOrders = orders.length > 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Mes achats</h1>

      {!hasOrders && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Vous n&apos;avez pas encore effectue d&apos;achat
        </div>
      )}

      {activeOrders.length > 0 && (
        <section className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold">En cours</h2>
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <Link key={order.id} href={`/achats/${order.id}`} className="block hover:ring-2 hover:ring-primary/20 rounded-lg transition-shadow">
                <OrderCard order={order} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {completedOrders.length > 0 && (
        <section className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold">Termines</h2>
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <Link key={order.id} href={`/achats/${order.id}`} className="block hover:ring-2 hover:ring-primary/20 rounded-lg transition-shadow">
                <OrderCard order={order} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {otherOrders.length > 0 && (
        <section className="space-y-4">
          <div className="space-y-4">
            {otherOrders.map((order) => (
              <Link key={order.id} href={`/achats/${order.id}`} className="block hover:ring-2 hover:ring-primary/20 rounded-lg transition-shadow">
                <OrderCard order={order} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
