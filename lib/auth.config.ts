import type { NextAuthConfig } from 'next-auth'
import { SESSION_MAX_AGE } from '@/lib/constants'

// Shared auth config — NO database imports.
// Used by middleware (Edge Runtime) and by the full auth config.
export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.isMember = (user as Record<string, unknown>).isMember ?? false
        token.isCustomer = (user as Record<string, unknown>).isCustomer ?? false
        token.isAdmin = (user as Record<string, unknown>).isAdmin ?? false
        token.memberTier = (user as Record<string, unknown>).memberTier ?? null
        token.adminRole = (user as Record<string, unknown>).adminRole ?? null
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.isMember = token.isMember as boolean
      session.user.isCustomer = token.isCustomer as boolean
      session.user.isAdmin = token.isAdmin as boolean
      session.user.memberTier = token.memberTier as string | null
      session.user.adminRole = token.adminRole as string | null
      return session
    },
  },
  providers: [], // Providers added in auth.ts (server-only)
}
