import { db } from '@/lib/db'

export async function getReviewsByProduct(productId: string, limit = 20) {
  return db.review.findMany({
    where: { productId, visible: true, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { member: { select: { firstName: true } } },
  })
}

export async function getReviewByOrder(orderId: string) {
  return db.review.findUnique({
    where: { orderId },
    include: { member: { select: { firstName: true } } },
  })
}

export async function getAverageRating(productId: string) {
  const result = await db.review.aggregate({
    where: { productId, visible: true, deletedAt: null },
    _avg: { rating: true },
    _count: { rating: true },
  })
  return {
    average: result._avg.rating || 0,
    count: result._count.rating,
  }
}

export async function getBusinessAverageRating(businessId: string) {
  const result = await db.review.aggregate({
    where: {
      product: { businessId },
      visible: true,
      deletedAt: null,
    },
    _avg: { rating: true },
    _count: { rating: true },
  })
  return {
    average: result._avg.rating || 0,
    count: result._count.rating,
  }
}

export async function getFlaggedReviews() {
  return db.review.findMany({
    where: { flagged: true, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    include: {
      member: { select: { firstName: true, lastName: true } },
      product: { select: { name: true, businessId: true } },
      order: { select: { id: true } },
    },
  })
}
