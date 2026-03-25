import { db } from '@/lib/db'

export type BusinessDashboardStats = {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export type BusinessClient = {
  id: string
  type: 'member' | 'customer'
  name: string
  email: string | null
  phone: string | null
  commune: string | null
  address: string | null
  orderCount: number
  totalSpent: number
  lastOrder: Date
  firstOrder: Date
}

export type BusinessClientDetail = BusinessClient & {
  orders: {
    id: string
    totalAmount: number
    status: string
    createdAt: Date
    items: { product: { name: string }; quantity: number; unitPrice: number }[]
  }[]
  averageBasket: number
  avgDaysBetweenOrders: number | null
  favoriteProducts: { name: string; count: number }[]
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
      member: { select: { firstName: true, lastName: true, phone: true } },
      customer: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          address: { select: { commune: true } },
        },
      },
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

/** Revenue stats filtered by date range */
export async function getBusinessRevenueStats(
  businessId: string,
  from: Date,
  to: Date,
) {
  const validStatuses = ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'] as const

  const [orders, prevOrders] = await Promise.all([
    db.order.findMany({
      where: {
        businessId,
        createdAt: { gte: from, lte: to },
      },
      include: {
        items: {
          include: {
            product: { select: { name: true, type: true } },
          },
        },
      },
    }),
    // Previous period for comparison
    (() => {
      const duration = to.getTime() - from.getTime()
      const prevFrom = new Date(from.getTime() - duration)
      const prevTo = new Date(from.getTime() - 1)
      return db.order.findMany({
        where: {
          businessId,
          createdAt: { gte: prevFrom, lte: prevTo },
        },
        select: { totalAmount: true, status: true },
      })
    })(),
  ])

  // Current period stats
  const paidOrders = orders.filter((o) =>
    (validStatuses as readonly string[]).includes(o.status),
  )
  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount),
    0,
  )
  const totalOrders = orders.length
  const avgBasket = totalOrders > 0 ? Math.round(totalRevenue / paidOrders.length) : 0
  const completedOrders = orders.filter(
    (o) => o.status === 'COMPLETED' || o.status === 'DELIVERED',
  ).length
  const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED').length
  const completionRate =
    totalOrders > 0
      ? Math.round((completedOrders / totalOrders) * 100)
      : 0

  // Previous period stats
  const prevPaidOrders = prevOrders.filter((o) =>
    (validStatuses as readonly string[]).includes(o.status),
  )
  const prevRevenue = prevPaidOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount),
    0,
  )
  const prevTotalOrders = prevOrders.length

  // Comparison
  const revenueChange =
    prevRevenue > 0
      ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
      : totalRevenue > 0
        ? 100
        : 0
  const ordersChange =
    prevTotalOrders > 0
      ? Math.round(((totalOrders - prevTotalOrders) / prevTotalOrders) * 100)
      : totalOrders > 0
        ? 100
        : 0

  // Revenue by product
  const productMap = new Map<
    string,
    { name: string; type: string; revenue: number; sales: number }
  >()
  for (const order of paidOrders) {
    for (const item of order.items) {
      const existing = productMap.get(item.productId)
      const itemRevenue = Number(item.unitPrice) * item.quantity
      if (existing) {
        existing.revenue += itemRevenue
        existing.sales += item.quantity
      } else {
        productMap.set(item.productId, {
          name: item.product.name,
          type: item.product.type,
          revenue: itemRevenue,
          sales: item.quantity,
        })
      }
    }
  }
  const revenueByProduct = Array.from(productMap.values()).sort(
    (a, b) => b.revenue - a.revenue,
  )

  // Revenue by type
  const typeMap = new Map<string, number>()
  for (const p of revenueByProduct) {
    typeMap.set(p.type, (typeMap.get(p.type) ?? 0) + p.revenue)
  }
  const revenueByType = Array.from(typeMap.entries())
    .map(([type, revenue]) => ({ type, revenue }))
    .sort((a, b) => b.revenue - a.revenue)

  return {
    totalRevenue,
    totalOrders,
    paidOrdersCount: paidOrders.length,
    avgBasket,
    completedOrders,
    cancelledOrders,
    completionRate,
    revenueChange,
    ordersChange,
    revenueByProduct,
    revenueByType,
  }
}

/** Revenue by month for a given period */
export async function getBusinessRevenueByMonthFiltered(
  businessId: string,
  from: Date,
  to: Date,
): Promise<MonthlyRevenue[]> {
  const orders = await db.order.findMany({
    where: {
      businessId,
      status: { in: ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
      createdAt: { gte: from, lte: to },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const monthMap = new Map<string, number>()

  // Pre-fill months in range
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1)
  while (cursor <= to) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
    monthMap.set(key, 0)
    cursor.setMonth(cursor.getMonth() + 1)
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

export async function getBusinessClients(
  businessId: string,
): Promise<BusinessClient[]> {
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
          phone: true,
          user: { select: { email: true } },
        },
      },
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          user: { select: { email: true } },
          address: true,
        },
      },
    },
  })

  const clientMap = new Map<string, BusinessClient>()

  for (const order of orders) {
    const buyer = order.member ?? order.customer
    if (!buyer) continue

    const isMember = !!order.memberId
    const key = isMember
      ? `member:${order.memberId}`
      : `customer:${order.customerId}`

    const existing = clientMap.get(key)
    const amount = Number(order.totalAmount)

    const customerAddress =
      !isMember && order.customer?.address ? order.customer.address : null

    if (existing) {
      existing.orderCount += 1
      existing.totalSpent += amount
      if (order.createdAt > existing.lastOrder) {
        existing.lastOrder = order.createdAt
      }
      if (order.createdAt < existing.firstOrder) {
        existing.firstOrder = order.createdAt
      }
    } else {
      clientMap.set(key, {
        id: buyer.id,
        type: isMember ? 'member' : 'customer',
        name: `${buyer.firstName} ${buyer.lastName}`,
        email: buyer.user.email,
        phone: buyer.phone ?? null,
        commune: customerAddress?.commune ?? null,
        address: customerAddress
          ? [customerAddress.street, customerAddress.commune, customerAddress.city]
              .filter(Boolean)
              .join(', ')
          : null,
        orderCount: 1,
        totalSpent: amount,
        lastOrder: order.createdAt,
        firstOrder: order.createdAt,
      })
    }
  }

  return Array.from(clientMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent,
  )
}

export async function getBusinessClientDetail(
  businessId: string,
  clientId: string,
  clientType: 'member' | 'customer',
): Promise<BusinessClientDetail | null> {
  const whereClause =
    clientType === 'member'
      ? { businessId, memberId: clientId }
      : { businessId, customerId: clientId }

  const orders = await db.order.findMany({
    where: whereClause,
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          user: { select: { email: true } },
        },
      },
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          user: { select: { email: true } },
          address: true,
        },
      },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (orders.length === 0) return null

  const firstOrder = orders[0]
  const buyer = firstOrder.member ?? firstOrder.customer
  if (!buyer) return null

  const customerAddress =
    clientType === 'customer' && firstOrder.customer?.address
      ? firstOrder.customer.address
      : null

  let totalSpent = 0
  const productCountMap = new Map<string, number>()

  for (const order of orders) {
    totalSpent += Number(order.totalAmount)
    for (const item of order.items) {
      const name = item.product.name
      productCountMap.set(name, (productCountMap.get(name) ?? 0) + item.quantity)
    }
  }

  const sortedDates = orders
    .map((o) => o.createdAt.getTime())
    .sort((a, b) => a - b)
  let avgDaysBetweenOrders: number | null = null
  if (sortedDates.length >= 2) {
    const totalDays =
      (sortedDates[sortedDates.length - 1] - sortedDates[0]) /
      (1000 * 60 * 60 * 24)
    avgDaysBetweenOrders = Math.round(totalDays / (sortedDates.length - 1))
  }

  const favoriteProducts = Array.from(productCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  return {
    id: buyer.id,
    type: clientType,
    name: `${buyer.firstName} ${buyer.lastName}`,
    email: buyer.user.email,
    phone: buyer.phone ?? null,
    commune: customerAddress?.commune ?? null,
    address: customerAddress
      ? [customerAddress.street, customerAddress.commune, customerAddress.city]
          .filter(Boolean)
          .join(', ')
      : null,
    orderCount: orders.length,
    totalSpent,
    lastOrder: orders[0].createdAt,
    firstOrder: orders[orders.length - 1].createdAt,
    averageBasket: Math.round(totalSpent / orders.length),
    avgDaysBetweenOrders,
    favoriteProducts,
    orders: orders.map((o) => ({
      id: o.id,
      totalAmount: Number(o.totalAmount),
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.map((item) => ({
        product: { name: item.product.name },
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
    })),
  }
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
