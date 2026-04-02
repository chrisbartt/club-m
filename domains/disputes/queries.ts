import { db } from '@/lib/db'

export async function getDisputeByOrder(orderId: string) {
  return db.dispute.findFirst({
    where: { orderId, deletedAt: null },
    include: {
      member: {
        select: { firstName: true, lastName: true },
      },
      order: {
        include: {
          business: true,
          items: { include: { product: true } },
        },
      },
    },
  })
}

export async function getOpenDisputes() {
  return db.dispute.findMany({
    where: {
      status: { notIn: ['RESOLVED_BUYER', 'RESOLVED_SELLER', 'CLOSED'] },
      deletedAt: null,
    },
    include: {
      member: true,
      order: {
        include: {
          business: {
            include: { member: { include: { user: true } } },
          },
          items: { include: { product: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}
