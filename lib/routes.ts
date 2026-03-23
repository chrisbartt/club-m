export const PROTECTED_ROUTES = {
  member: ['/dashboard', '/profile', '/tickets', '/orders', '/business', '/upgrade', '/events', '/directory'],
  admin: ['/admin'],
  auth: ['/login', '/register', '/verify-email', '/kyc'],
} as const

export function isProtectedMemberRoute(path: string): boolean {
  return PROTECTED_ROUTES.member.some((r) => path.startsWith(r))
}

export function isProtectedAdminRoute(path: string): boolean {
  return PROTECTED_ROUTES.admin.some((r) => path.startsWith(r))
}

export function isAuthRoute(path: string): boolean {
  return PROTECTED_ROUTES.auth.some((r) => path.startsWith(r))
}
