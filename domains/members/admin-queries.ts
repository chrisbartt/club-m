import { db } from '@/lib/db'
import type {
  MemberTier,
  VerificationStatus,
} from '@/lib/generated/prisma/client'

type AdminMembersFilters = {
  tier?: MemberTier
  verificationStatus?: VerificationStatus
  search?: string
  page?: number
  pageSize?: number
}

export async function getAdminMembersList(filters?: AdminMembersFilters) {
  const {
    tier,
    verificationStatus,
    search,
    page = 1,
    pageSize = 20,
  } = filters ?? {}

  const where = {
    ...(tier ? { tier } : {}),
    ...(verificationStatus ? { verificationStatus } : {}),
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            {
              user: {
                email: { contains: search, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {}),
  }

  const [members, total] = await Promise.all([
    db.member.findMany({
      where,
      include: {
        user: { select: { email: true, emailVerified: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.member.count({ where }),
  ])

  return { members, total, page, pageSize }
}

export async function getAdminMemberDetail(memberId: string) {
  return db.member.findUnique({
    where: { id: memberId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          emailVerified: true,
          status: true,
          createdAt: true,
        },
      },
      businessProfile: true,
      kycVerifications: { orderBy: { submittedAt: 'desc' } },
      subscriptions: { orderBy: { createdAt: 'desc' } },
      upgradeRequests: { orderBy: { createdAt: 'desc' } },
      orders: { orderBy: { createdAt: 'desc' }, take: 10 },
      tickets: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })
}

export async function getAdminMembersStats() {
  const [
    totalMembers,
    freeCount,
    premiumCount,
    businessCount,
    pendingKycCount,
  ] = await Promise.all([
    db.member.count(),
    db.member.count({ where: { tier: 'FREE' } }),
    db.member.count({ where: { tier: 'PREMIUM' } }),
    db.member.count({ where: { tier: 'BUSINESS' } }),
    db.kycVerification.count({ where: { status: 'PENDING' } }),
  ])

  return {
    totalMembers,
    byTier: { FREE: freeCount, PREMIUM: premiumCount, BUSINESS: businessCount },
    pendingKycCount,
  }
}
