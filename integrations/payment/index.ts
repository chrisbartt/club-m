import type { PaymentProvider } from './types'
import { LocalFintechProvider } from './local-fintech'

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? 'local-fintech'
  switch (provider) {
    case 'local-fintech':
      return new LocalFintechProvider()
    default:
      throw new Error(`Unknown payment provider: ${provider}`)
  }
}

export type { PaymentProvider, CreatePaymentParams, PaymentResult, WebhookEvent, RefundResult } from './types'
export { PaymentProviderError } from './errors'
