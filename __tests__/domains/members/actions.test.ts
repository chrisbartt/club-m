import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { mockUser, mockMember } from '../../helpers'

const mockDb = vi.mocked(db)
const mockRateLimit = vi.mocked(rateLimit)

const validInput = {
  email: 'new@clubm.cd',
  password: 'password123',
  firstName: 'Marie',
  lastName: 'Kabila',
  certifyWoman: true as const,
  acceptTerms: true as const,
}

describe('registerMember', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    mockRateLimit.mockReturnValue({ success: true, remaining: 10 })
  })

  it('should register a new member with valid input', async () => {
    const createdUser = mockUser({
      id: 'user-new',
      email: validInput.email,
      member: mockMember({ id: 'member-new', userId: 'user-new' }),
    })

    // getUserByEmail calls db.user.findUnique — return null (no duplicate)
    mockDb.user.findUnique.mockResolvedValue(null)
    // db.user.create for the new user + member
    mockDb.user.create.mockResolvedValue(createdUser as any)
    // emailVerificationToken.create
    mockDb.emailVerificationToken.create.mockResolvedValue({} as any)

    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.userId).toBe('user-new')
      expect(result.data.memberId).toBe('member-new')
    }

    // Verify user was created with hashed password (not plain text)
    expect(mockDb.user.create).toHaveBeenCalledOnce()
    const createCall = mockDb.user.create.mock.calls[0][0]
    expect(createCall.data.email).toBe(validInput.email)
    expect(createCall.data.passwordHash).not.toBe(validInput.password)
    expect(createCall.data.passwordHash).toMatch(/^\$2[aby]?\$/)
  })

  it('should return validation error for invalid email', async () => {
    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember({
      ...validInput,
      email: 'not-an-email',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
      expect(result.details?.email).toBeDefined()
    }
    // Should not hit the database
    expect(mockDb.user.findUnique).not.toHaveBeenCalled()
    expect(mockDb.user.create).not.toHaveBeenCalled()
  })

  it('should return validation error for missing required fields', async () => {
    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember({
      email: 'test@clubm.cd',
      // missing password, firstName, lastName, certifyWoman, acceptTerms
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
      expect(result.details).toBeDefined()
    }
    expect(mockDb.user.create).not.toHaveBeenCalled()
  })

  it('should return validation error for password too short', async () => {
    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember({
      ...validInput,
      password: 'short', // less than 8 chars
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
      expect(result.details?.password).toBeDefined()
    }
  })

  it('should return EMAIL_TAKEN when email already exists', async () => {
    // getUserByEmail finds an existing user
    mockDb.user.findUnique.mockResolvedValue(mockUser() as any)

    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember(validInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('EMAIL_TAKEN')
      expect(result.details?.email).toBeDefined()
    }
    // Should not attempt to create a user
    expect(mockDb.user.create).not.toHaveBeenCalled()
  })

  it('should return rate limit error when too many attempts', async () => {
    mockRateLimit.mockReturnValue({ success: false, remaining: 0 })

    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember(validInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Trop de tentatives')
    }
    // Should not check email or create user
    expect(mockDb.user.findUnique).not.toHaveBeenCalled()
    expect(mockDb.user.create).not.toHaveBeenCalled()
  })

  it('should return validation error when certifyWoman is false', async () => {
    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember({
      ...validInput,
      certifyWoman: false,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
    }
  })

  it('should return validation error when acceptTerms is false', async () => {
    const { registerMember } = await import('@/domains/members/actions')
    const result = await registerMember({
      ...validInput,
      acceptTerms: false,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
    }
  })
})
