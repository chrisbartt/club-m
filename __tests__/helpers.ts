export function mockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-1',
    email: 'test@clubm.cd',
    passwordHash: '$2b$10$hashedpassword',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    member: mockMember(),
    customer: null,
    adminAccount: null,
    ...overrides,
  }
}

export function mockMember(overrides: Record<string, unknown> = {}) {
  return {
    id: 'member-1',
    userId: 'user-1',
    firstName: 'Test',
    lastName: 'User',
    phone: '+243123456789',
    bio: 'Test bio',
    avatar: null,
    tier: 'FREE' as const,
    status: 'ACTIVE' as const,
    verificationStatus: 'DECLARED' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function mockBusinessMember(overrides: Record<string, unknown> = {}) {
  return mockMember({ id: 'member-biz', tier: 'BUSINESS', ...overrides })
}

export function mockProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'product-1',
    businessId: 'business-1',
    name: 'Test Product',
    description: 'A test product',
    price: 100,
    currency: 'USD' as const,
    images: [],
    type: 'PHYSICAL' as const,
    categoryId: null,
    isActive: true,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function mockOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    memberId: 'member-1',
    customerId: null,
    businessId: 'business-1',
    totalAmount: 100,
    commission: 10,
    discount: 0,
    currency: 'USD' as const,
    confirmationCode: 'ABC123',
    codeExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    codeUsed: false,
    status: 'PAID' as const,
    shippedAt: null,
    deliveredAt: null,
    couponId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
    business: { id: 'business-1', member: { user: { id: 'seller-user-1' } } },
    ...overrides,
  }
}

export function mockCoupon(overrides: Record<string, unknown> = {}) {
  return {
    id: 'coupon-1',
    businessId: 'business-1',
    code: 'TEST10',
    type: 'PERCENTAGE' as const,
    value: 10,
    currency: null,
    minOrderAmount: null,
    maxUses: null,
    usedCount: 0,
    startsAt: null,
    expiresAt: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function mockReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 'review-1',
    orderId: 'order-1',
    memberId: 'member-1',
    productId: 'product-1',
    rating: 4,
    comment: 'Great product',
    flagged: false,
    flagReason: null,
    visible: true,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
