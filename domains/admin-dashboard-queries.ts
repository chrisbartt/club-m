import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'

export async function getGlobalDashboardStats() {
  await requireAdmin()
  const [
    totalMembers, freeMembers, premiumMembers, businessMembers,
    totalEvents, publishedEvents,
    totalOrders, completedOrders,
    totalRevenue, pendingKyc,
  ] = await Promise.all([
    db.member.count(),
    db.member.count({ where: { tier: 'FREE' } }),
    db.member.count({ where: { tier: 'PREMIUM' } }),
    db.member.count({ where: { tier: 'BUSINESS' } }),
    db.event.count(),
    db.event.count({ where: { status: 'PUBLISHED' } }),
    db.order.count(),
    db.order.count({ where: { status: 'COMPLETED' } }),
    db.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
    db.kycVerification.count({ where: { status: 'PENDING' } }),
  ])

  return {
    members: { total: totalMembers, free: freeMembers, premium: premiumMembers, business: businessMembers },
    events: { total: totalEvents, published: publishedEvents },
    orders: { total: totalOrders, completed: completedOrders },
    revenue: Number(totalRevenue._sum.amount ?? 0),
    pendingKyc,
  }
}

export async function getMemberGrowthByMonth() {
  await requireAdmin()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const members = await db.member.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, tier: true },
    orderBy: { createdAt: 'asc' },
  })

  const monthly = new Map<string, { free: number; premium: number; business: number }>()
  for (const m of members) {
    const key = m.createdAt.toISOString().slice(0, 7)
    const existing = monthly.get(key) ?? { free: 0, premium: 0, business: 0 }
    if (m.tier === 'FREE') existing.free++
    else if (m.tier === 'PREMIUM') existing.premium++
    else existing.business++
    monthly.set(key, existing)
  }

  return Array.from(monthly.entries()).map(([month, data]) => ({ month, ...data }))
}

export async function getRevenueByMonth() {
  await requireAdmin()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const payments = await db.payment.findMany({
    where: { status: 'SUCCESS', createdAt: { gte: sixMonthsAgo } },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  const monthly = new Map<string, number>()
  for (const p of payments) {
    const key = p.createdAt.toISOString().slice(0, 7)
    monthly.set(key, (monthly.get(key) ?? 0) + Number(p.amount))
  }

  return Array.from(monthly.entries()).map(([month, revenue]) => ({ month, revenue }))
}
