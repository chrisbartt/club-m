import type {
  UpgradeRequest,
  UpgradeStatus,
  MemberTier,
} from '@/lib/generated/prisma/client'

/**
 * Upgrade State Machine:
 *
 *   createUpgradeRequest()
 *         |
 *         v
 *   [member.verificationStatus === VERIFIED?]
 *     YES --> READY_FOR_PAYMENT
 *     NO  --> KYC_PENDING
 *               |
 *               v
 *         [KYC decision]
 *           APPROVED --> READY_FOR_PAYMENT
 *           REJECTED --> KYC_REJECTED (terminal)
 *               |
 *               v
 *         READY_FOR_PAYMENT
 *               |
 *               v
 *         [payment initiated]
 *               |
 *               v
 *         PAYMENT_PENDING
 *               |
 *               v
 *         [payment confirmed]
 *               |
 *               v
 *         UPGRADE_COMPLETED (terminal)
 *
 *   Any non-terminal state --> CANCELLED (via cancelUpgradeRequest)
 */

export type UpgradeRequestWithMember = UpgradeRequest & {
  member: {
    id: string
    firstName: string
    lastName: string
    tier: MemberTier
  }
}

/** States that allow cancellation */
export const CANCELLABLE_STATUSES: UpgradeStatus[] = [
  'KYC_PENDING',
  'READY_FOR_PAYMENT',
  'PAYMENT_PENDING',
]

/** Terminal states — upgrade is done or dead */
export const TERMINAL_STATUSES: UpgradeStatus[] = [
  'UPGRADE_COMPLETED',
  'CANCELLED',
  'KYC_REJECTED',
]
