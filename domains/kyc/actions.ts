'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember, requireAdmin, requireVerifiedEmail } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import { createNotification } from '@/domains/notifications/actions'
import {
  sendKycSubmittedAdminEmail,
  sendKycApprovedEmail,
  sendKycRejectedEmail,
} from '@/lib/email'
import { ADMIN_EMAIL } from '@/lib/constants'
import { submitKycSchema, reviewKycSchema } from './validators'
import { getLatestKycForMember } from './queries'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

function flattenFieldErrors(
  error: z.ZodError
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0])
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(issue.message)
  }
  return result
}

export async function submitKyc(
  input: unknown
): Promise<ActionResult<{ kycId: string }>> {
  try {
    const { user, member } = await requireMember()
    await requireVerifiedEmail()

    const parsed = submitKycSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    // Check no pending KYC exists
    const latest = await getLatestKycForMember(member.id)
    if (latest && latest.status === 'PENDING') {
      return {
        success: false,
        error: 'KYC_ALREADY_PENDING',
      }
    }

    const kyc = await db.kycVerification.create({
      data: {
        memberId: member.id,
        idDocumentUrl: parsed.data.idDocumentUrl,
        selfieUrl: parsed.data.selfieUrl,
        status: 'PENDING',
        provider: 'manual',
      },
    })

    await db.member.update({
      where: { id: member.id },
      data: { verificationStatus: 'PENDING_VERIFICATION' },
    })

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'KYC_SUBMITTED',
      entity: 'KycVerification',
      entityId: kyc.id,
    })

    // Email admin about new KYC submission
    try {
      const memberName = `${member.firstName} ${member.lastName}`
      await sendKycSubmittedAdminEmail(ADMIN_EMAIL, memberName)
    } catch (e) {
      console.error('KYC submitted admin email failed:', e)
    }

    return { success: true, data: { kycId: kyc.id } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

export async function reviewKyc(
  input: unknown
): Promise<ActionResult<{ kycId: string; decision: string }>> {
  try {
    const { user: adminUser } = await requireAdmin()

    const parsed = reviewKycSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        details: flattenFieldErrors(parsed.error),
      }
    }

    const { kycId, decision, rejectionReason } = parsed.data

    const kyc = await db.kycVerification.findUnique({
      where: { id: kycId },
      include: { member: { include: { user: true } } },
    })

    if (!kyc) {
      return { success: false, error: 'RESOURCE_NOT_FOUND' }
    }

    if (kyc.status !== 'PENDING') {
      return { success: false, error: 'KYC_ALREADY_REVIEWED' }
    }

    // Update KYC record
    await db.kycVerification.update({
      where: { id: kycId },
      data: {
        status: decision,
        rejectionReason: decision === 'REJECTED' ? rejectionReason : null,
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
      },
    })

    // Update member verification status
    const newVerificationStatus =
      decision === 'APPROVED' ? 'VERIFIED' : 'REJECTED'

    await db.member.update({
      where: { id: kyc.memberId },
      data: { verificationStatus: newVerificationStatus },
    })

    // Update pending upgrade requests based on decision
    if (decision === 'APPROVED') {
      await db.upgradeRequest.updateMany({
        where: {
          memberId: kyc.memberId,
          status: 'KYC_PENDING',
        },
        data: { status: 'READY_FOR_PAYMENT' },
      })
    } else {
      await db.upgradeRequest.updateMany({
        where: {
          memberId: kyc.memberId,
          status: 'KYC_PENDING',
        },
        data: { status: 'KYC_REJECTED' },
      })
    }

    await createAuditLog({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: `KYC_${decision}`,
      entity: 'KycVerification',
      entityId: kycId,
      details: {
        memberId: kyc.memberId,
        ...(rejectionReason ? { rejectionReason } : {}),
      },
    })

    // Send email + notification to the member
    const memberUser = kyc.member.user
    if (decision === 'APPROVED') {
      try {
        await sendKycApprovedEmail(memberUser.email, kyc.member.firstName)
      } catch (e) {
        console.error('KYC approved email failed:', e)
      }
      await createNotification({
        userId: memberUser.id,
        type: 'KYC_APPROVED',
        title: 'Identite verifiee',
        message: 'Votre verification d\'identite a ete approuvee.',
        link: '/kyc',
      })
    } else if (decision === 'REJECTED') {
      try {
        await sendKycRejectedEmail(memberUser.email, kyc.member.firstName, rejectionReason || 'Verification non approuvee.')
      } catch (e) {
        console.error('KYC rejected email failed:', e)
      }
      await createNotification({
        userId: memberUser.id,
        type: 'KYC_REJECTED',
        title: 'KYC a revoir',
        message: rejectionReason || 'Verification non approuvee.',
        link: '/kyc',
      })
    }

    return { success: true, data: { kycId, decision } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
