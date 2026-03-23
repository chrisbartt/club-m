import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    isMember?: boolean
    isCustomer?: boolean
    isAdmin?: boolean
    memberTier?: string | null
    adminRole?: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      isMember: boolean
      isCustomer: boolean
      isAdmin: boolean
      memberTier: string | null
      adminRole: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isMember: boolean
    isCustomer: boolean
    isAdmin: boolean
    memberTier: string | null
    adminRole: string | null
  }
}
