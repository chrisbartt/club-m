export interface KycSubmitParams {
  memberId: string
  idDocumentUrl: string
  selfieUrl: string
}

export interface KycSubmitResult {
  providerRef: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface KycProviderStatus {
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
}

export interface KycProvider {
  submitVerification(params: KycSubmitParams): Promise<KycSubmitResult>
  getVerificationStatus(providerRef: string): Promise<KycProviderStatus>
}
