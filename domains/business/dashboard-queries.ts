import { db } from '@/lib/db'

export type BusinessDashboardStats = {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export type BusinessClient = {
  id: string
  name: string
  email: string | null
  orderCount: number
  totalSpent: number
  lastOrder: Date
}

export type MonthlyRevenue = {
  month: string
  revenue: number
}

export async function getBusinessDashboardStats(
  businessId: string,
): Promise<BusinessDashboardStats> {
  const [totalOrders, revenueResult, pendingOrders, completedOrders] =
    await Promise.all([
      db.order.count({
        where: { businessId },
      }),
      db.order.aggregate({
        where: {
          businessId,
          status: { in: ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
        },
        _sum: { totalAmount: true },
      }),
      db.order.count({
        where: {
          businessId,
          status: { in: ['PAID', 'SHIPPED'] },
        },
      }),
      db.order.count({
        where: {
          businessId,
          status: 'COMPLETED',
        },
      }),
    ])

  return {
    totalOrders,
    totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
    pendingOrders,
    completedOrders,
  }
}

export async function getBusinessRecentOrders(
  businessId: string,
  limit = 5,
) {
  return db.order.findMany({
    where: { businessId },
    include: {
      member: { select: { firstName: true, lastName: true } },
      customer: { select: { firstName: true, lastName: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getBusinessClients(
  businessId: string,
): Promise<BusinessClient[]> {
  // Get all orders for this business with buyer info
  const orders = await db.order.findMany({
    where: { businessId },
    select: {
      totalAmount: true,
      createdAt: true,
      memberId: true,
      customerId: true,
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
    },
  })

  // Aggregate per unique buyer
  const clientMap = new Map<
    string,
    {
      id: string
      name: string
      email: string | null
      orderCount: number
      totalSpent: number
      lastOrder: Date
    }
  >()

  for (const order of orders) {
    const buyer = order.member ?? order.customer
    if (!buyer) continue

    const key = order.memberId
      ? `member:${order.memberId}`
      : `customer:${order.customerId}`

    const existing = clientMap.get(key)
    const amount = Number(order.totalAmount)

    if (existing) {
      existing.orderCount += 1
      existing.totalSpent += amount
      if (order.createdAt > existing.lastOrder) {
        existing.lastOrder = order.createdAt
      }
    } else {
      clientMap.set(key, {
        id: buyer.id,
        name: `${buyer.firstName} ${buyer.lastName}`,
        email: buyer.user.email,
        orderCount: 1,
        totalSpent: amount,
        lastOrder: order.createdAt,
      })
    }
  }

  return Array.from(clientMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent,
  )
}

export async function getBusinessRevenueByMonth(
  businessId: string,
): Promise<MonthlyRevenue[]> {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const orders = await db.order.findMany({
    where: {
      businessId,
      status: { in: ['DELIVERED', 'COMPLETED'] },
      createdAt: { gte: sixMonthsAgo },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  // Group by month
  const monthMap = new Map<string, number>()

  // Pre-fill last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthMap.set(key, 0)
  }

  for (const order of orders) {
    const d = order.createdAt
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthMap.set(key, (monthMap.get(key) ?? 0) + Number(order.totalAmount))
  }

  return Array.from(monthMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }))
}
