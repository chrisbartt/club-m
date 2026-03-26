import { vi } from 'vitest'

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    user: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    member: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    order: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() },
    orderItem: { create: vi.fn(), createMany: vi.fn() },
    orderStatusHistory: { create: vi.fn() },
    product: { findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    productVariant: { findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    payment: { create: vi.fn() },
    review: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), aggregate: vi.fn() },
    coupon: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    dispute: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    notification: { create: vi.fn() },
    auditLog: { create: vi.fn() },
    businessProfile: { findUnique: vi.fn() },
    passwordResetToken: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    emailVerificationToken: { create: vi.fn() },
    $transaction: vi.fn((fn: any) => fn({
      order: { create: vi.fn(), update: vi.fn() },
      product: { update: vi.fn() },
      productVariant: { update: vi.fn() },
      payment: { create: vi.fn() },
      coupon: { update: vi.fn() },
    })),
  },
}))

// Mock auth guards
vi.mock('@/lib/auth-guards', () => ({
  requireAuth: vi.fn(),
  requireMember: vi.fn(),
  requireVerifiedMember: vi.fn(),
  requireAdmin: vi.fn(),
  requireOwnership: vi.fn(),
  requireVerifiedEmail: vi.fn(),
}))

// Mock auth (NextAuth)
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: vi.fn((key: string) => {
      if (key === 'x-forwarded-for') return '127.0.0.1'
      return null
    }),
  })),
  cookies: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

// Mock email
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
  sendWelcomeEmail: vi.fn(),
  sendOrderConfirmationBuyer: vi.fn(),
  sendOrderNotificationSeller: vi.fn(),
  sendOrderShippedEmail: vi.fn(),
  sendDeliveryConfirmationBuyer: vi.fn(),
  sendDeliveryConfirmationSeller: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendKycSubmittedAdminEmail: vi.fn(),
  sendKycApprovedEmail: vi.fn(),
  sendKycRejectedEmail: vi.fn(),
  sendProfileApprovedEmail: vi.fn(),
  sendProfileRejectedEmail: vi.fn(),
  sendTicketConfirmationEmail: vi.fn(),
}))

// Mock notifications
vi.mock('@/domains/notifications/actions', () => ({
  createNotification: vi.fn(),
}))

// Mock rate limiting (allow all by default)
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 10 })),
  getClientIp: vi.fn(() => Promise.resolve('127.0.0.1')),
}))
