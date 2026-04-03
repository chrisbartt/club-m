import type { NextAuthConfig } from 'next-auth'
import { SESSION_MAX_AGE } from '@/lib/constants'

// Shared auth config — NO database imports.
// Used by middleware (Edge Runtime) and by the full auth config.
export const authConfig = {
  pages: { signIn: '/login', signOut: '/login' },
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.isMember = user.isMember ?? false
        token.isCustomer = user.isCustomer ?? false
        token.isAdmin = user.isAdmin ?? false
        token.memberTier = user.memberTier ?? null
        token.adminRole = user.adminRole ?? null
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      session.user.id = token.id
      session.user.isMember = token.isMember
      session.user.isCustomer = token.isCustomer
      session.user.isAdmin = token.isAdmin
      session.user.memberTier = token.memberTier
      session.user.adminRole = token.adminRole
      return session
    },
  },
  providers: [], // Providers added in auth.ts (server-only)
} satisfies NextAuthConfig
