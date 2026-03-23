import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { SESSION_MAX_AGE } from '@/lib/constants'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.user.findUnique({
          where: { email },
          include: { member: true, customer: true, adminAccount: true },
        })

        if (!user) return null
        if (user.status !== 'ACTIVE') return null

        const passwordValid = await compare(password, user.passwordHash)
        if (!passwordValid) return null

        return {
          id: user.id,
          email: user.email,
          isMember: !!user.member,
          isCustomer: !!user.customer,
          isAdmin: !!user.adminAccount,
          memberTier: user.member?.tier ?? null,
          adminRole: user.adminAccount?.role ?? null,
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.isMember = user.isMember ?? false
        token.isCustomer = user.isCustomer ?? false
        token.isAdmin = user.isAdmin ?? false
        token.memberTier = user.memberTier ?? null
        token.adminRole = user.adminRole ?? null
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
  pages: { signIn: '/login' },
})
