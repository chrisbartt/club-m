import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { requireAuth, requireMember, requireAdmin } from '@/lib/auth-guards'
import { createNotification } from '@/domains/notifications/actions'
import { mockUser, mockMember, mockOrder, mockReview, mockProduct } from '../../helpers'

const mockDb = vi.mocked(db)
const mockRequireAuth = vi.mocked(requireAuth)
const mockRequireMember = vi.mocked(requireMember)
const mockRequireAdmin = vi.mocked(requireAdmin)
const mockCreateNotification = vi.mocked(createNotification)

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── createReview ────────────────────────────────────────────────────────────

describe('createReview', () => {
  // Lazy import to allow mocks to be set up first
  const act = () =>
    import('@/domains/reviews/actions').then((m) => m.createReview)

  const validInput = { orderId: 'order-1', rating: 4, comment: 'Great!' }

  it('creates a review for a DELIVERED order owned by the user', async () => {
    const createReview = await act()

    const user = mockUser()
    mockRequireAuth.mockResolvedValue(user as any)

    const order = mockOrder({
      status: 'DELIVERED',
      memberId: 'member-1',
      review: null,
      items: [{ productId: 'product-1', product: { name: 'Robe Wax' } }],
      business: { member: { user: { id: 'seller-user-1' } } },
    })
    mockDb.order.findUnique.mockResolvedValue(order as any)
    mockDb.review.create.mockResolvedValue({ id: 'review-new' } as any)
    mockCreateNotification.mockResolvedValue({ success: true, data: {} } as any)

    const result = await createReview(validInput)

    expect(result).toEqual({ success: true, data: { reviewId: 'review-new' } })
    expect(mockDb.review.create).toHaveBeenCalledWith({
      data: {
        orderId: 'order-1',
        memberId: 'member-1',
        productId: 'product-1',
        rating: 4,
        comment: 'Great!',
      },
    })
    expect(mockCreateNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'REVIEW_RECEIVED' })
    )
  })

  it('returns ORDER_NOT_DELIVERED when order is not delivered', async () => {
    const createReview = await act()

    mockRequireAuth.mockResolvedValue(mockUser() as any)
    mockDb.order.findUnique.mockResolvedValue(
      mockOrder({
        status: 'PAID',
        memberId: 'member-1',
        review: null,
        items: [{ productId: 'product-1', product: { name: 'Robe' } }],
      }) as any
    )

    const result = await createReview(validInput)

    expect(result).toEqual({ success: false, error: 'ORDER_NOT_DELIVERED' })
  })

  it('returns REVIEW_ALREADY_EXISTS when review exists', async () => {
    const createReview = await act()

    mockRequireAuth.mockResolvedValue(mockUser() as any)
    mockDb.order.findUnique.mockResolvedValue(
      mockOrder({
        status: 'DELIVERED',
        memberId: 'member-1',
        review: mockReview(),
        items: [{ productId: 'product-1', product: { name: 'Robe' } }],
      }) as any
    )

    const result = await createReview(validInput)

    expect(result).toEqual({ success: false, error: 'REVIEW_ALREADY_EXISTS' })
  })

  it('returns ORDER_NOT_FOUND when order belongs to another user', async () => {
    const createReview = await act()

    mockRequireAuth.mockResolvedValue(mockUser() as any)
    mockDb.order.findUnique.mockResolvedValue(
      mockOrder({
        status: 'DELIVERED',
        memberId: 'other-member',
        review: null,
        items: [],
      }) as any
    )

    const result = await createReview(validInput)

    expect(result).toEqual({ success: false, error: 'ORDER_NOT_FOUND' })
  })

  it('returns ORDER_NOT_FOUND when order does not exist', async () => {
    const createReview = await act()

    mockRequireAuth.mockResolvedValue(mockUser() as any)
    mockDb.order.findUnique.mockResolvedValue(null)

    const result = await createReview(validInput)

    expect(result).toEqual({ success: false, error: 'ORDER_NOT_FOUND' })
  })

  it('returns INVALID_INPUT for rating 0', async () => {
    const createReview = await act()

    mockRequireAuth.mockResolvedValue(mockUser() as any)

    const result = await createReview({ orderId: 'order-1', rating: 0 })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
      expect(result.details?.rating).toBeDefined()
    }
  })

  it('returns INVALID_INPUT for rating 6', async () => {
    const createReview = await act()

    mockRequireAuth.mockResolvedValue(mockUser() as any)

    const result = await createReview({ orderId: 'order-1', rating: 6 })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('INVALID_INPUT')
      expect(result.details?.rating).toBeDefined()
    }
  })
})

// ─── flagReview ──────────────────────────────────────────────────────────────

describe('flagReview', () => {
  const act = () =>
    import('@/domains/reviews/actions').then((m) => m.flagReview)

  const validInput = { reviewId: 'review-1', reason: 'Avis inapproprie et offensant' }

  it('flags a review when seller owns the product', async () => {
    const flagReview = await act()

    mockRequireMember.mockResolvedValue({
      user: mockUser({ id: 'seller-user-1' }),
      member: mockMember({ id: 'member-biz', tier: 'BUSINESS' }),
    } as any)

    mockDb.review.findUnique.mockResolvedValue(
      mockReview({ product: mockProduct({ businessId: 'business-1' }) }) as any
    )
    mockDb.businessProfile.findUnique.mockResolvedValue({ id: 'business-1', memberId: 'member-biz' } as any)
    mockDb.review.update.mockResolvedValue({} as any)

    const result = await flagReview(validInput)

    expect(result).toEqual({ success: true, data: { reviewId: 'review-1' } })
    expect(mockDb.review.update).toHaveBeenCalledWith({
      where: { id: 'review-1' },
      data: { flagged: true, flagReason: 'Avis inapproprie et offensant' },
    })
  })

  it('returns NOT_AUTHORIZED when non-owner tries to flag', async () => {
    const flagReview = await act()

    mockRequireMember.mockResolvedValue({
      user: mockUser({ id: 'other-user' }),
      member: mockMember({ id: 'member-other', tier: 'BUSINESS' }),
    } as any)

    mockDb.review.findUnique.mockResolvedValue(
      mockReview({ product: mockProduct({ businessId: 'business-1' }) }) as any
    )
    // Business profile belongs to a different business
    mockDb.businessProfile.findUnique.mockResolvedValue({ id: 'business-99', memberId: 'member-other' } as any)

    const result = await flagReview(validInput)

    expect(result).toEqual({ success: false, error: 'NOT_AUTHORIZED' })
    expect(mockDb.review.update).not.toHaveBeenCalled()
  })
})

// ─── moderateReview ──────────────────────────────────────────────────────────

describe('moderateReview', () => {
  const act = () =>
    import('@/domains/reviews/actions').then((m) => m.moderateReview)

  it('MAINTAIN: sets visible=true, flagged=false', async () => {
    const moderateReview = await act()

    mockRequireAdmin.mockResolvedValue({} as any)

    const review = mockReview({
      flagged: true,
      member: { user: { id: 'reviewer-user' } },
    })
    mockDb.review.findUnique.mockResolvedValue(review as any)
    mockDb.review.update.mockResolvedValue({} as any)

    const result = await moderateReview('review-1', 'MAINTAIN')

    expect(result).toEqual({ success: true, data: { reviewId: 'review-1' } })
    expect(mockDb.review.update).toHaveBeenCalledWith({
      where: { id: 'review-1' },
      data: { flagged: false, visible: true },
    })
    expect(mockCreateNotification).not.toHaveBeenCalled()
  })

  it('HIDE: sets visible=false and notifies reviewer', async () => {
    const moderateReview = await act()

    mockRequireAdmin.mockResolvedValue({} as any)

    const review = mockReview({
      flagged: true,
      member: { user: { id: 'reviewer-user' } },
    })
    mockDb.review.findUnique.mockResolvedValue(review as any)
    mockDb.review.update.mockResolvedValue({} as any)
    mockCreateNotification.mockResolvedValue({ success: true, data: {} } as any)

    const result = await moderateReview('review-1', 'HIDE')

    expect(result).toEqual({ success: true, data: { reviewId: 'review-1' } })
    expect(mockDb.review.update).toHaveBeenCalledWith({
      where: { id: 'review-1' },
      data: { flagged: false, visible: false },
    })
    expect(mockCreateNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'reviewer-user',
        type: 'REVIEW_HIDDEN',
      })
    )
  })

  it('returns REVIEW_NOT_FOUND when review does not exist', async () => {
    const moderateReview = await act()

    mockRequireAdmin.mockResolvedValue({} as any)
    mockDb.review.findUnique.mockResolvedValue(null)

    const result = await moderateReview('nonexistent', 'MAINTAIN')

    expect(result).toEqual({ success: false, error: 'REVIEW_NOT_FOUND' })
  })
})
