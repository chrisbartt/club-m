import { db } from '@/lib/db'
import type { PublicProfileListItem, ProfileWithProducts, ProfileWithMember } from './types'

const memberSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  tier: true,
  verificationStatus: true,
} as const

export async function getPublicProfiles(filters?: {
  category?: string
  search?: string
}): Promise<PublicProfileListItem[]> {
  return db.businessProfile.findMany({
    where: {
      isPublished: true,
      isApproved: true,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.search && {
        OR: [
          { businessName: { contains: filters.search, mode: 'insensitive' as const } },
          { description: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
    },
    select: {
      id: true,
      businessName: true,
      slug: true,
      description: true,
      category: true,
      coverImage: true,
      profileType: true,
      member: { select: { firstName: true, lastName: true, avatar: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProfileBySlug(slug: string): Promise<ProfileWithProducts | null> {
  return db.businessProfile.findUnique({
    where: { slug },
    include: {
      member: { select: memberSelect },
      products: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function getProfileByMemberId(memberId: string): Promise<ProfileWithProducts | null> {
  return db.businessProfile.findUnique({
    where: { memberId },
    include: {
      member: { select: memberSelect },
      products: { orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function getCategories(): Promise<string[]> {
  const results = await db.businessProfile.findMany({
    where: { isPublished: true, isApproved: true },
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  })
  return results.map((r) => r.category)
}

export async function getProfileById(id: string): Promise<ProfileWithProducts | null> {
  return db.businessProfile.findUnique({
    where: { id },
    include: {
      member: { select: memberSelect },
      products: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function getProfileWithStats(profileId: string) {
  const profile = await db.businessProfile.findUnique({
    where: { id: profileId },
    include: {
      member: {
        include: { user: { select: { email: true, createdAt: true } } },
      },
      products: true,
      receivedOrders: {
        include: { items: true, payment: true },
      },
    },
  })

  if (!profile) return null

  const activeProducts = profile.products.filter(p => p.isActive).length
  const totalOrders = profile.receivedOrders.length
  const totalRevenue = profile.receivedOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount), 0
  )
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return {
    ...profile,
    stats: { activeProducts, totalProducts: profile.products.length, totalOrders, totalRevenue, avgOrderValue },
  }
}

export async function getAdminProfiles(filters?: {
  approved?: boolean
}): Promise<ProfileWithMember[]> {
  return db.businessProfile.findMany({
    where: {
      ...(filters?.approved !== undefined && { isApproved: filters.approved }),
    },
    include: {
      member: { select: memberSelect },
    },
    orderBy: { createdAt: 'desc' },
  })
}
