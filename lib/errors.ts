export type AuthErrorCode =
  | 'NOT_AUTHENTICATED'
  | 'ACCOUNT_INACTIVE'
  | 'ACCOUNT_SUSPENDED'
  | 'NOT_A_MEMBER'
  | 'MEMBER_SUSPENDED'
  | 'INSUFFICIENT_TIER'
  | 'NOT_VERIFIED'
  | 'NOT_ADMIN'
  | 'INSUFFICIENT_ADMIN_ROLE'
  | 'NOT_OWNER'

export type BusinessErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'NO_STORE_PROFILE'
  | 'PROFILE_NOT_APPROVED'
  | 'EVENT_FULL'
  | 'EVENT_NOT_BOOKABLE'
  | 'ORDER_ALREADY_CONFIRMED'
  | 'CONFIRMATION_CODE_EXPIRED'
  | 'CONFIRMATION_CODE_INVALID'
  | 'KYC_ALREADY_PENDING'
  | 'SUBSCRIPTION_ALREADY_ACTIVE'
  | 'INSUFFICIENT_STOCK'
  | 'PRODUCT_INACTIVE'
  | 'UPGRADE_IN_PROGRESS'

export class AuthError extends Error {
  constructor(public code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
  }
}

export class ValidationError extends Error {
  constructor(
    public code: string,
    public field?: string,
    public details?: Record<string, string[]>
  ) {
    super(code)
    this.name = 'ValidationError'
  }
}

export class BusinessError extends Error {
  constructor(
    public code: BusinessErrorCode,
    public context?: Record<string, unknown>
  ) {
    super(code)
    this.name = 'BusinessError'
  }
}
