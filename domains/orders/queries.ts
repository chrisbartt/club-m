import { db } from '@/lib/db'
import type { OrderStatus } from '@/lib/generated/prisma/client'
import type { OrderForAdmin, OrderForBuyer, OrderForSeller, OrderWithItems } from './types'

const orderItemsInclude = {
  items: {
    include: {
      product: {
        select: { id: true, name: true, images: true, type: true },
      },
    },
  },
  payment: true,
} as const

export async function getBuyerOrders(memberId: string): Promise<OrderForBuyer[]> {
  return db.order.findMany({
    where: { memberId },
    include: {
      ...orderItemsInclude,
      business: {
        select: { id: true, businessName: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCustomerOrders(customerId: string): Promise<OrderForBuyer[]> {
  return db.order.findMany({
    where: { customerId },
    include: {
      ...orderItemsInclude,
      business: {
        select: { id: true, businessName: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getSellerOrders(
  businessId: string,
  statusFilter?: OrderStatus,
): Promise<OrderForSeller[]> {
  return db.order.findMany({
    where: {
      businessId,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    include: {
      ...orderItemsInclude,
      member: {
        select: { id: true, firstName: true, lastName: true },
      },
      customer: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrderForBuyer(orderId: string, memberId: string) {
  return db.order.findFirst({
    where: { id: orderId, memberId },
    include: {
      items: {
        include: { product: true },
      },
      payment: true,
      business: {
        select: { businessName: true, slug: true, phone: true, whatsapp: true },
      },
    },
  })
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  return db.order.findUnique({
    where: { id: orderId },
    include: orderItemsInclude,
  })
}

export async function getAdminOrders(filters?: {
  status?: OrderStatus
}): Promise<OrderForAdmin[]> {
  return db.order.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
    },
    include: {
      ...orderItemsInclude,
      member: {
        select: { id: true, firstName: true, lastName: true },
      },
      customer: {
        select: { id: true, firstName: true, lastName: true },
      },
      business: {
        select: { id: true, businessName: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrderTimeline(orderId: string) {
  return db.orderStatusHistory.findMany({
    where: { orderId },
    orderBy: { createdAt: 'asc' },
  })
}
