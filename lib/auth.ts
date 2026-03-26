import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { authConfig } from '@/lib/auth.config'
import { rateLimit } from '@/lib/rate-limit'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const rl = rateLimit(`login:${email}`, 5, 15 * 60 * 1000)
        if (!rl.success) {
          throw new Error('Trop de tentatives. Reessayez dans 15 minutes.')
        }

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
})
