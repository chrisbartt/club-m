import { db } from '@/lib/db'
import type { Product } from '@/lib/generated/prisma/client'
import type { ProductWithBusiness } from './types'

const businessSelect = {
  id: true,
  memberId: true,
  slug: true,
  businessName: true,
} as const

export async function getProductsByBusiness(businessId: string): Promise<Product[]> {
  return db.product.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductById(productId: string): Promise<ProductWithBusiness | null> {
  return db.product.findUnique({
    where: { id: productId },
    include: {
      business: { select: businessSelect },
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { position: 'asc' } },
    },
  })
}

export async function getActiveProductsByBusiness(businessId: string): Promise<Product[]> {
  return db.product.findMany({
    where: { businessId, isActive: true },
    orderBy: { createdAt: 'desc' },
  })
}
