import type {
  KycVerification,
  Member,
  KycStatus,
} from '@/lib/generated/prisma/client'

export type KycWithMember = KycVerification & {
  member: Pick<Member, 'id' | 'firstName' | 'lastName' | 'tier' | 'verificationStatus'>
}

export type KycSubmissionInput = {
  idDocumentUrl: string
  selfieUrl: string
}

export type KycReviewInput = {
  kycId: string
  decision: Extract<KycStatus, 'APPROVED' | 'REJECTED'>
  rejectionReason?: string
}
