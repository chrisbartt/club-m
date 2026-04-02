export const PROTECTED_ROUTES = {
  member: ['/dashboard', '/profil', '/tickets', '/achats', '/mon-business', '/upgrade', '/kyc', '/epargne-tontines'],
  admin: ['/admin'],
  auth: ['/login', '/register', '/verify-email'],
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
