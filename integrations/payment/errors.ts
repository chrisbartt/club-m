export type PaymentErrorCode =
  | 'PROVIDER_UNAVAILABLE'
  | 'PAYMENT_DECLINED'
  | 'INVALID_AMOUNT'
  | 'PROVIDER_ERROR'

export class PaymentProviderError extends Error {
  constructor(public code: PaymentErrorCode, public originalError?: unknown) {
    super(code)
    this.name = 'PaymentProviderError'
  }
}
