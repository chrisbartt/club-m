import { db } from '@/lib/db'
import type { Prisma } from '@/lib/generated/prisma/client'

const approvedStoreBusiness: Prisma.BusinessProfileWhereInput = {
  isPublished: true,
  isApproved: true,
  profileType: 'STORE',
}

const businessSelect = {
  id: true,
  businessName: true,
  slug: true,
  coverImage: true,
  category: true,
  address: true,
  member: {
    select: {
      firstName: true,
      lastName: true,
      avatar: true,
    },
  },
} satisfies Prisma.BusinessProfileSelect

export async function getMarketplaceProducts(filters?: {
  category?: string
  type?: 'PHYSICAL' | 'SERVICE' | 'DIGITAL'
  search?: string
  minPrice?: number
  maxPrice?: number
  commune?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
  limit?: number
  offset?: number
}) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    business: approvedStoreBusiness,
  }

  if (filters?.category) {
    where.category = { slug: filters.category }
  }

  if (filters?.type) {
    where.type = filters.type
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {}
    if (filters?.minPrice !== undefined) {
      where.price.gte = filters.minPrice
    }
    if (filters?.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice
    }
  }

  if (filters?.commune) {
    where.business = {
      ...approvedStoreBusiness,
      address: { contains: filters.commune, mode: 'insensitive' },
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput
  switch (filters?.sort) {
    case 'price_asc':
      orderBy = { price: 'asc' }
      break
    case 'price_desc':
      orderBy = { price: 'desc' }
      break
    case 'popular':
      orderBy = { orderItems: { _count: 'desc' } }
      break
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' }
      break
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        business: { select: businessSelect },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy,
      take: filters?.limit ?? 20,
      skip: filters?.offset ?? 0,
    }),
    db.product.count({ where }),
  ])

  return { products, total }
}

export async function getMarketplaceStores(filters?: {
  category?: string
  search?: string
  limit?: number
}) {
  const where: Prisma.BusinessProfileWhereInput = {
    ...approvedStoreBusiness,
  }

  if (filters?.category) {
    where.category = filters.category
  }

  if (filters?.search) {
    where.OR = [
      { businessName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  return db.businessProfile.findMany({
    where,
    select: {
      ...businessSelect,
      description: true,
      phone: true,
      whatsapp: true,
      images: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { products: { _count: 'desc' } },
    take: filters?.limit ?? 20,
  })
}

export async function getPopularProducts(limit = 8) {
  return db.product.findMany({
    where: {
      isActive: true,
      business: approvedStoreBusiness,
    },
    include: {
      business: { select: businessSelect },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { orderItems: true } },
    },
    orderBy: { orderItems: { _count: 'desc' } },
    take: limit,
  })
}

export async function getNewProducts(limit = 8) {
  return db.product.findMany({
    where: {
      isActive: true,
      business: approvedStoreBusiness,
    },
    include: {
      business: { select: businessSelect },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getFeaturedStores(limit = 6) {
  return db.businessProfile.findMany({
    where: approvedStoreBusiness,
    select: {
      ...businessSelect,
      description: true,
      images: true,
      _count: {
        select: {
          products: { where: { isActive: true } },
          receivedOrders: true,
        },
      },
    },
    orderBy: { receivedOrders: { _count: 'desc' } },
    take: limit,
  })
}

export async function getProductCategories() {
  const categories = await db.category.findMany({
    where: {
      isActive: true,
      products: {
        some: {
          isActive: true,
          business: approvedStoreBusiness,
        },
      },
    },
    select: { name: true, slug: true },
    orderBy: { name: 'asc' },
  })

  return categories.map((c) => c.name)
}

export async function getMarketplaceStats() {
  const [totalProducts, totalStores, categories] = await Promise.all([
    db.product.count({
      where: {
        isActive: true,
        business: approvedStoreBusiness,
      },
    }),
    db.businessProfile.count({
      where: approvedStoreBusiness,
    }),
    getProductCategories(),
  ])

  return {
    totalProducts,
    totalStores,
    totalCategories: categories.length,
  }
}
