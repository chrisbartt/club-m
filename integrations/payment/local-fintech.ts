import type { PaymentProvider, CreatePaymentParams, PaymentResult, WebhookEvent, RefundResult } from './types'
import { PaymentProviderError } from './errors'

export class LocalFintechProvider implements PaymentProvider {
  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    // TODO: Implement with actual local fintech API
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }

  async verifyWebhook(payload: unknown, signature: string): Promise<WebhookEvent> {
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }

  async getPaymentStatus(providerRef: string): Promise<'pending' | 'success' | 'failed'> {
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }

  async requestRefund(providerRef: string, amount?: number): Promise<RefundResult> {
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }
}
