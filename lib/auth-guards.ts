import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { AuthError, BusinessError } from '@/lib/errors'
import { hasMinTier, hasMinAdminRole } from '@/lib/permissions'
import type {
  MemberTier,
  AdminRole,
  User,
  Member,
  Customer,
  AdminAccount,
} from '@/lib/generated/prisma/client'

type UserWithRelations = User & {
  member: Member | null
  customer: Customer | null
  adminAccount: AdminAccount | null
}

export async function requireAuth(): Promise<UserWithRelations> {
  const session = await auth()
  if (!session?.user?.id) throw new AuthError('NOT_AUTHENTICATED')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true, customer: true, adminAccount: true },
  })

  if (!user) throw new AuthError('NOT_AUTHENTICATED')
  if (user.status === 'SUSPENDED') throw new AuthError('ACCOUNT_SUSPENDED')
  if (user.status === 'DELETED') throw new AuthError('ACCOUNT_INACTIVE')

  return user
}

export async function requireMember(
  minTier?: MemberTier
): Promise<{ user: UserWithRelations; member: Member }> {
  const user = await requireAuth()
  if (!user.member) throw new AuthError('NOT_A_MEMBER')
  if (user.member.status === 'SUSPENDED' || user.member.status === 'BANNED')
    throw new AuthError('MEMBER_SUSPENDED')
  if (minTier && !hasMinTier(user.member.tier, minTier))
    throw new AuthError('INSUFFICIENT_TIER')
  return { user, member: user.member }
}

export async function requireVerifiedMember(
  minTier?: MemberTier
): Promise<{ user: UserWithRelations; member: Member }> {
  const { user, member } = await requireMember(minTier)
  if (member.verificationStatus !== 'VERIFIED')
    throw new AuthError('NOT_VERIFIED')
  return { user, member }
}

export async function requireVerifiedBusiness(): Promise<{
  user: UserWithRelations
  member: Member
}> {
  const { user, member } = await requireVerifiedMember('BUSINESS')

  const profile = await db.businessProfile.findUnique({
    where: { memberId: member.id },
  })
  if (!profile || profile.profileType !== 'STORE')
    throw new BusinessError('NO_STORE_PROFILE')
  if (!profile.isApproved) throw new BusinessError('PROFILE_NOT_APPROVED')

  return { user, member }
}

export async function requireAdmin(
  minRole?: AdminRole
): Promise<{ user: UserWithRelations; admin: AdminAccount }> {
  const user = await requireAuth()
  if (!user.adminAccount) throw new AuthError('NOT_ADMIN')
  if (minRole && !hasMinAdminRole(user.adminAccount.role, minRole))
    throw new AuthError('INSUFFICIENT_ADMIN_ROLE')
  return { user, admin: user.adminAccount }
}

export function requireOwnership(
  resourceOwnerId: string,
  currentUserId: string
): void {
  if (resourceOwnerId !== currentUserId) throw new AuthError('NOT_OWNER')
}

export async function requireVerifiedEmail() {
  const user = await requireAuth()
  if (!user.emailVerified) {
    throw new BusinessError('EMAIL_NOT_VERIFIED')
  }
  return user
}
