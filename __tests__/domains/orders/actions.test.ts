import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { mockOrder, mockMember, mockUser } from '../../helpers'

const mockDb = vi.mocked(db)
const mockRequireMember = vi.mocked(requireMember)

// ─── markAsShipped ──────────────────────────────────────────────────────────

describe('markAsShipped', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function setupSellerAuth(memberId = 'member-1') {
    mockRequireMember.mockResolvedValue({
      user: mockUser({ id: 'seller-user-1' }),
      member: mockMember({ id: memberId, tier: 'BUSINESS' }),
    } as any)
  }

  function setupBusinessProfile(profileId = 'business-1', memberId = 'member-1') {
    mockDb.businessProfile.findUnique.mockResolvedValue({
      id: profileId,
      memberId,
      profileType: 'STORE',
      businessName: 'Test Store',
      isApproved: true,
      isPublished: true,
    } as any)
  }

  it('should ship order when seller owns it and status is PAID', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    const order = mockOrder({ id: 'order-1', businessId: 'business-1', status: 'PAID' })

    // First findUnique: fetch order for validation
    // Second findUnique: fetch fullOrder with includes for email/notification
    mockDb.order.findUnique
      .mockResolvedValueOnce(order as any)
      .mockResolvedValueOnce({
        ...order,
        member: { user: { id: 'buyer-user-1', email: 'buyer@test.cd' }, firstName: 'Buyer' },
        customer: null,
        business: { businessName: 'Test Store' },
      } as any)

    mockDb.order.update.mockResolvedValue(order as any)
    mockDb.orderStatusHistory.create.mockResolvedValue({} as any)

    const { markAsShipped } = await import('@/domains/orders/actions')
    const result = await markAsShipped('order-1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.orderId).toBe('order-1')
    }
    expect(mockDb.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'SHIPPED', shippedAt: expect.any(Date) },
    })
  })

  it('should return error when order is not found', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    mockDb.order.findUnique.mockResolvedValueOnce(null)

    const { markAsShipped } = await import('@/domains/orders/actions')
    const result = await markAsShipped('nonexistent-order')

    expect(result).toEqual({ success: false, error: 'RESOURCE_NOT_FOUND' })
  })

  it('should return error when seller does not own the order', async () => {
    setupSellerAuth()
    setupBusinessProfile('business-99') // Different business

    const order = mockOrder({ id: 'order-1', businessId: 'business-1', status: 'PAID' })
    mockDb.order.findUnique.mockResolvedValueOnce(order as any)

    const { markAsShipped } = await import('@/domains/orders/actions')
    const result = await markAsShipped('order-1')

    expect(result).toEqual({ success: false, error: 'NOT_OWNER' })
  })

  it('should return error when order is not in PAID status', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    const order = mockOrder({ id: 'order-1', businessId: 'business-1', status: 'SHIPPED' })
    mockDb.order.findUnique.mockResolvedValueOnce(order as any)

    const { markAsShipped } = await import('@/domains/orders/actions')
    const result = await markAsShipped('order-1')

    expect(result).toEqual({ success: false, error: 'ORDER_ALREADY_CONFIRMED' })
  })

  it('should return error when no business profile exists', async () => {
    setupSellerAuth()
    mockDb.businessProfile.findUnique.mockResolvedValueOnce(null)

    const { markAsShipped } = await import('@/domains/orders/actions')
    const result = await markAsShipped('order-1')

    expect(result).toEqual({ success: false, error: 'NO_STORE_PROFILE' })
  })
})

// ─── confirmDelivery ────────────────────────────────────────────────────────

describe('confirmDelivery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function setupSellerAuth(memberId = 'member-1') {
    mockRequireMember.mockResolvedValue({
      user: mockUser({ id: 'seller-user-1' }),
      member: mockMember({ id: memberId, tier: 'BUSINESS' }),
    } as any)
  }

  function setupBusinessProfile(profileId = 'business-1', memberId = 'member-1') {
    mockDb.businessProfile.findUnique.mockResolvedValue({
      id: profileId,
      memberId,
      profileType: 'STORE',
      businessName: 'Test Store',
      isApproved: true,
      isPublished: true,
    } as any)
  }

  const validInput = { orderId: 'order-1', confirmationCode: 'ABC123' }

  it('should confirm delivery with valid code and not expired', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    const order = mockOrder({
      id: 'order-1',
      businessId: 'business-1',
      status: 'SHIPPED',
      confirmationCode: 'ABC123',
      codeExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    })

    // First findUnique: order validation. Second: fullOrder with includes.
    mockDb.order.findUnique
      .mockResolvedValueOnce(order as any)
      .mockResolvedValueOnce({
        ...order,
        member: { user: { id: 'buyer-user-1', email: 'buyer@test.cd' }, firstName: 'Buyer' },
        customer: null,
        business: {
          businessName: 'Test Store',
          member: { user: { id: 'seller-user-1', email: 'seller@test.cd' } },
        },
      } as any)

    mockDb.order.update.mockResolvedValue(order as any)
    mockDb.orderStatusHistory.create.mockResolvedValue({} as any)

    const { confirmDelivery } = await import('@/domains/orders/actions')
    const result = await confirmDelivery(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.orderId).toBe('order-1')
    }
    expect(mockDb.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: {
        status: 'DELIVERED',
        deliveredAt: expect.any(Date),
        codeUsed: true,
      },
    })
  })

  it('should return error with wrong confirmation code', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    const order = mockOrder({
      id: 'order-1',
      businessId: 'business-1',
      status: 'SHIPPED',
      confirmationCode: 'ABC123',
      codeExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    mockDb.order.findUnique.mockResolvedValueOnce(order as any)

    const { confirmDelivery } = await import('@/domains/orders/actions')
    const result = await confirmDelivery({ orderId: 'order-1', confirmationCode: 'WRONG99' })

    expect(result).toEqual({ success: false, error: 'CONFIRMATION_CODE_INVALID' })
  })

  it('should return error when code is expired', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    const order = mockOrder({
      id: 'order-1',
      businessId: 'business-1',
      status: 'SHIPPED',
      confirmationCode: 'ABC123',
      codeExpiresAt: new Date(Date.now() - 1000), // Expired
    })
    mockDb.order.findUnique.mockResolvedValueOnce(order as any)

    const { confirmDelivery } = await import('@/domains/orders/actions')
    const result = await confirmDelivery(validInput)

    expect(result).toEqual({ success: false, error: 'CONFIRMATION_CODE_EXPIRED' })
  })

  it('should return error when order is not in SHIPPED status', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    const order = mockOrder({
      id: 'order-1',
      businessId: 'business-1',
      status: 'PAID',
      confirmationCode: 'ABC123',
    })
    mockDb.order.findUnique.mockResolvedValueOnce(order as any)

    const { confirmDelivery } = await import('@/domains/orders/actions')
    const result = await confirmDelivery(validInput)

    expect(result).toEqual({ success: false, error: 'ORDER_ALREADY_CONFIRMED' })
  })

  it('should return error when order is not found', async () => {
    setupSellerAuth()
    setupBusinessProfile()

    mockDb.order.findUnique.mockResolvedValueOnce(null)

    const { confirmDelivery } = await import('@/domains/orders/actions')
    const result = await confirmDelivery(validInput)

    expect(result).toEqual({ success: false, error: 'RESOURCE_NOT_FOUND' })
  })

  it('should return error with invalid input', async () => {
    setupSellerAuth()

    const { confirmDelivery } = await import('@/domains/orders/actions')
    const result = await confirmDelivery({ orderId: '', confirmationCode: '' })

    expect(result).toEqual({ success: false, error: 'INVALID_INPUT' })
  })

  it('should return error when no business profile exists', async () => {
    setupSellerAuth()
    mockDb.businessProfile.findUnique.mockResolvedValueOnce(null)

    const { confirmDelivery } = await import('@/domains/orders/actions')
    const result = await confirmDelivery(validInput)

    expect(result).toEqual({ success: false, error: 'NO_STORE_PROFILE' })
  })
})
