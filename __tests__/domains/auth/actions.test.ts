import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { mockUser } from '../../helpers'

const mockDb = vi.mocked(db)
const mockRateLimit = vi.mocked(rateLimit)

// We need to mock the audit log action to prevent side effects
vi.mock('@/domains/audit/actions', () => ({
  createAuditLog: vi.fn(),
}))

// Mock server-utils — stable token/hash for assertions
vi.mock('@/lib/server-utils', () => ({
  generateSecureToken: vi.fn(() => 'mock-raw-token-abc123'),
  hashToken: vi.fn((t: string) => `hashed:${t}`),
}))

describe('requestPasswordReset', () => {
  let requestPasswordReset: typeof import('@/domains/auth/actions').requestPasswordReset

  beforeEach(async () => {
    vi.clearAllMocks()
    mockRateLimit.mockReturnValue({ success: true, remaining: 10 })
    // Dynamic import to pick up fresh mocks
    const mod = await import('@/domains/auth/actions')
    requestPasswordReset = mod.requestPasswordReset
  })

  it('returns success with generic message when user exists', async () => {
    const user = mockUser()
    mockDb.user.findUnique.mockResolvedValue(user as any)
    // No recent reset request (cooldown check)
    mockDb.passwordResetToken.findFirst.mockResolvedValue(null)
    mockDb.passwordResetToken.updateMany.mockResolvedValue({ count: 0 } as any)
    mockDb.passwordResetToken.create.mockResolvedValue({} as any)

    const result = await requestPasswordReset({ email: 'test@clubm.cd' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).toContain('lien de reinitialisation')
    }
    // Should have created a token
    expect(mockDb.passwordResetToken.create).toHaveBeenCalledOnce()
    // Should have invalidated old tokens
    expect(mockDb.passwordResetToken.updateMany).toHaveBeenCalledOnce()
  })

  it('returns same generic success message when user does NOT exist (no email enumeration)', async () => {
    mockDb.user.findUnique.mockResolvedValue(null)

    const result = await requestPasswordReset({ email: 'unknown@example.com' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).toContain('lien de reinitialisation')
    }
    // Should NOT create a token for unknown users
    expect(mockDb.passwordResetToken.create).not.toHaveBeenCalled()
  })

  it('returns validation error for invalid email format', async () => {
    const result = await requestPasswordReset({ email: 'not-an-email' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
      expect(result.details?.email).toBeDefined()
    }
  })

  it('returns error when rate limited', async () => {
    mockRateLimit.mockReturnValue({ success: false, remaining: 0 })

    const result = await requestPasswordReset({ email: 'test@clubm.cd' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Trop de tentatives')
    }
  })

  it('returns generic success when within cooldown period (does not create new token)', async () => {
    const user = mockUser()
    mockDb.user.findUnique.mockResolvedValue(user as any)
    // Last request was 10 seconds ago — within cooldown
    mockDb.passwordResetToken.findFirst.mockResolvedValue({
      createdAt: new Date(Date.now() - 10_000),
    } as any)

    const result = await requestPasswordReset({ email: 'test@clubm.cd' })

    expect(result.success).toBe(true)
    // Should NOT create a new token due to cooldown
    expect(mockDb.passwordResetToken.create).not.toHaveBeenCalled()
  })
})

describe('resetPassword', () => {
  let resetPassword: typeof import('@/domains/auth/actions').resetPassword

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('@/domains/auth/actions')
    resetPassword = mod.resetPassword
  })

  it('updates password and invalidates token on success', async () => {
    const tokenRecord = {
      id: 'token-1',
      userId: 'user-1',
      token: 'hashed:valid-token',
      expiresAt: new Date(Date.now() + 3600_000),
      usedAt: null,
      createdAt: new Date(),
      user: { id: 'user-1', email: 'test@clubm.cd' },
    }
    // findValidPasswordResetToken uses db.passwordResetToken.findFirst
    mockDb.passwordResetToken.findFirst.mockResolvedValue(tokenRecord as any)
    mockDb.user.update.mockResolvedValue({} as any)
    mockDb.passwordResetToken.update.mockResolvedValue({} as any)

    const result = await resetPassword({
      token: 'valid-token',
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).toContain('reinitialise avec succes')
    }
    // Password updated
    expect(mockDb.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({ passwordHash: expect.any(String) }),
      }),
    )
    // Token marked as used
    expect(mockDb.passwordResetToken.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'token-1' },
        data: expect.objectContaining({ usedAt: expect.any(Date) }),
      }),
    )
  })

  it('returns error for invalid/unknown token', async () => {
    mockDb.passwordResetToken.findFirst.mockResolvedValue(null)

    const result = await resetPassword({
      token: 'unknown-token',
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Token invalide ou expire')
    }
  })

  it('returns error for expired token (findFirst returns null)', async () => {
    // The query filters by expiresAt > now, so expired tokens return null
    mockDb.passwordResetToken.findFirst.mockResolvedValue(null)

    const result = await resetPassword({
      token: 'expired-token',
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Token invalide ou expire')
    }
  })

  it('returns validation error for missing token', async () => {
    const result = await resetPassword({
      token: '',
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
    }
  })

  it('returns validation error for password too short', async () => {
    const result = await resetPassword({
      token: 'some-token',
      password: 'short',
      confirmPassword: 'short',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
    }
  })

  it('returns validation error when passwords do not match', async () => {
    const result = await resetPassword({
      token: 'some-token',
      password: 'newpassword123',
      confirmPassword: 'differentpassword',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
    }
  })
})
