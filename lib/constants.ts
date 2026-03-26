import type { MemberTier, Currency } from '@/lib/generated/prisma/client'

export const TIER_LABELS: Record<MemberTier, string> = {
  FREE: 'Free',
  PREMIUM: 'Premium',
  BUSINESS: 'Business',
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CDF: 'FC',
  EUR: '€',
}

export const COMMISSION_RATE = 0.1
export const CONFIRMATION_CODE_LENGTH = 6
export const CONFIRMATION_CODE_EXPIRY_DAYS = 14
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60
export const PASSWORD_MIN_LENGTH = 8

export const CLOUDINARY_FOLDERS = {
  avatars: 'club-m/avatars',
  kyc: 'club-m/kyc',
  business: 'club-m/business',
  products: 'club-m/products',
  events: 'club-m/events',
} as const

// Auth tokens
export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 24
export const EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24
export const EMAIL_RESEND_COOLDOWN_MINUTES = 2
export const PASSWORD_RESET_COOLDOWN_MINUTES = 1
export const TOKEN_LENGTH = 64
