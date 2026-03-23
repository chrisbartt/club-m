import type { KycProvider, KycSubmitParams, KycSubmitResult, KycProviderStatus } from './types'

export class ManualKycProvider implements KycProvider {
  async submitVerification(params: KycSubmitParams): Promise<KycSubmitResult> {
    return { providerRef: `manual-${params.memberId}-${Date.now()}`, status: 'pending' }
  }

  async getVerificationStatus(providerRef: string): Promise<KycProviderStatus> {
    return { status: 'pending' }
  }
}
