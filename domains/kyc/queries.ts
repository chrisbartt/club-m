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
