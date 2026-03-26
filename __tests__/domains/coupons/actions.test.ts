import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { mockCoupon, mockBusinessMember } from '../../helpers'

const mockDb = vi.mocked(db)
const mockRequireMember = vi.mocked(requireMember)

// ---------- createCoupon ----------

describe('createCoupon', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockRequireMember.mockResolvedValue({
      member: mockBusinessMember(),
      user: { id: 'user-1', email: 'biz@clubm.cd' },
    } as any)
  })

  it('normalizes code to uppercase and creates coupon', async () => {
    mockDb.businessProfile.findUnique.mockResolvedValue({
      id: 'business-1',
      memberId: 'member-biz',
    } as any)
    mockDb.coupon.create.mockResolvedValue({
      id: 'coupon-new',
      code: 'SUMMER20',
    } as any)

    const { createCoupon } = await import('@/domains/coupons/actions')
    const result = await createCoupon({
      code: '  summer20  ',
      type: 'PERCENTAGE',
      value: 20,
    })

    expect(result).toEqual({ success: true, data: { couponId: 'coupon-new' } })
    expect(mockDb.coupon.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ code: 'SUMMER20' }),
      })
    )
  })

  it('returns validation error for invalid input', async () => {
    const { createCoupon } = await import('@/domains/coupons/actions')
    const result = await createCoupon({ code: '', type: 'BAD', value: -5 })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
      expect(result.details).toBeDefined()
    }
  })
})

// ---------- toggleCoupon ----------

describe('toggleCoupon', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('flips isActive when called by owner', async () => {
    mockRequireMember.mockResolvedValue({
      member: mockBusinessMember(),
      user: { id: 'user-1', email: 'biz@clubm.cd' },
    } as any)
    mockDb.businessProfile.findUnique.mockResolvedValue({
      id: 'business-1',
      memberId: 'member-biz',
    } as any)
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ isActive: true, businessId: 'business-1' }) as any
    )
    mockDb.coupon.update.mockResolvedValue(
      mockCoupon({ id: 'coupon-1', isActive: false }) as any
    )

    const { toggleCoupon } = await import('@/domains/coupons/actions')
    const result = await toggleCoupon('coupon-1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isActive).toBe(false)
    }
    expect(mockDb.coupon.update).toHaveBeenCalledWith({
      where: { id: 'coupon-1' },
      data: { isActive: false },
    })
  })

  it('returns error when coupon belongs to another business', async () => {
    mockRequireMember.mockResolvedValue({
      member: mockBusinessMember(),
      user: { id: 'user-1', email: 'biz@clubm.cd' },
    } as any)
    mockDb.businessProfile.findUnique.mockResolvedValue({
      id: 'business-1',
      memberId: 'member-biz',
    } as any)
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ businessId: 'other-business' }) as any
    )

    const { toggleCoupon } = await import('@/domains/coupons/actions')
    const result = await toggleCoupon('coupon-1')

    expect(result).toEqual({ success: false, error: 'COUPON_NOT_FOUND' })
  })
})

// ---------- validateCoupon ----------

describe('validateCoupon', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns valid with correct percentage discount', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ value: 10, type: 'PERCENTAGE' }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 200, 'USD')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.discount).toBe(20) // 200 * 10 / 100
    }
  })

  it('returns valid with fixed amount discount capped at total', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ value: 500, type: 'FIXED_AMOUNT', currency: 'USD' }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 100, 'USD')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.discount).toBe(100) // capped at cart total
    }
  })

  it('returns invalid for expired coupon', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ expiresAt: new Date('2020-01-01') }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 200, 'USD')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('expire')
    }
  })

  it('returns invalid when uses exhausted', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ maxUses: 5, usedCount: 5 }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 200, 'USD')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('limite')
    }
  })

  it('returns invalid for wrong currency on FIXED_AMOUNT', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ type: 'FIXED_AMOUNT', currency: 'CDF', value: 50 }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 200, 'USD')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('devise')
    }
  })

  it('returns invalid when below minOrderAmount', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ minOrderAmount: 500 }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 100, 'USD')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('minimum')
    }
  })

  it('returns invalid for inactive coupon', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ isActive: false }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 200, 'USD')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('actif')
    }
  })

  it('returns invalid for coupon not yet started', async () => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    mockDb.coupon.findUnique.mockResolvedValue(
      mockCoupon({ startsAt: futureDate }) as any
    )

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('TEST10', 'business-1', 200, 'USD')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('pas encore')
    }
  })

  it('returns invalid when coupon not found', async () => {
    mockDb.coupon.findUnique.mockResolvedValue(null)

    const { validateCoupon } = await import('@/domains/coupons/queries')
    const result = await validateCoupon('NOEXIST', 'business-1', 200, 'USD')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('introuvable')
    }
  })
})
