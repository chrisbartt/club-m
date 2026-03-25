import { db } from '@/lib/db'

export async function getLatestKycForMember(memberId: string) {
  return db.kycVerification.findFirst({
    where: { memberId },
    orderBy: { submittedAt: 'desc' },
  })
}

export async function getKycById(kycId: string) {
  return db.kycVerification.findUnique({
    where: { id: kycId },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          tier: true,
          verificationStatus: true,
        },
      },
    },
  })
}

export async function getPendingKycList() {
  return db.kycVerification.findMany({
    where: { status: 'PENDING' },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          tier: true,
          verificationStatus: true,
        },
      },
    },
    orderBy: { submittedAt: 'asc' },
  })
}

export async function getKycListWithFilters(status?: string, search?: string) {
  const where: any = {}
  if (status && status !== 'all') {
    where.status = status
  }
  if (search) {
    where.member = {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    }
  }
  return db.kycVerification.findMany({
    where,
    include: {
      member: {
        include: { user: { select: { email: true } } },
      },
    },
    orderBy: { submittedAt: 'desc' },
  })
}

export async function getKycCount() {
  return db.kycVerification.count({
    where: { status: 'PENDING' },
  })
}
