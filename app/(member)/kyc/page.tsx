import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile } from '@/domains/members/profile-queries'
import { getLatestKycForMember } from '@/domains/kyc/queries'
import { KycStatus } from '@/components/member/kyc-status'
import { KycForm } from '@/components/member/kyc-form'

export default async function KycPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  const latestKyc = await getLatestKycForMember(profile.id)

  const canSubmit =
    profile.verificationStatus === 'DECLARED' ||
    profile.verificationStatus === 'REJECTED'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verification KYC</h1>

      <KycStatus
        verificationStatus={profile.verificationStatus}
        latestKyc={
          latestKyc
            ? {
                status: latestKyc.status,
                rejectionReason: latestKyc.rejectionReason,
              }
            : null
        }
      />

      {canSubmit && <KycForm />}
    </div>
  )
}
