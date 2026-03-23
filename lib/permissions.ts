import type { MemberTier, AdminRole } from '@/lib/generated/prisma/client'

const TIER_HIERARCHY: Record<MemberTier, number> = {
  FREE: 1,
  PREMIUM: 2,
  BUSINESS: 3,
}

export function hasMinTier(userTier: MemberTier, requiredTier: MemberTier): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier]
}

const ADMIN_HIERARCHY: Record<AdminRole, number> = {
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
}

export function hasMinAdminRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  return ADMIN_HIERARCHY[userRole] >= ADMIN_HIERARCHY[requiredRole]
}
