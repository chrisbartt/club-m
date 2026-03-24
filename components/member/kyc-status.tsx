import { Card, CardContent } from '@/components/ui/card'

interface KycStatusProps {
  verificationStatus: string
  latestKyc: { status: string; rejectionReason: string | null } | null
}

export function KycStatus({ verificationStatus, latestKyc }: KycStatusProps) {
  switch (verificationStatus) {
    case 'VERIFIED':
      return (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="flex items-center gap-3 pt-6">
            <svg
              className="size-6 text-green-600 dark:text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium text-green-800 dark:text-green-200">
              Profil verifie Club M
            </p>
          </CardContent>
        </Card>
      )

    case 'PENDING_VERIFICATION':
      return (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardContent className="pt-6">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              Verification en cours
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              Nous reviendrons vers vous sous peu.
            </p>
          </CardContent>
        </Card>
      )

    case 'REJECTED':
      return (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <CardContent className="pt-6">
            <p className="font-medium text-red-800 dark:text-red-200">
              Verification refusee
            </p>
            {latestKyc?.rejectionReason && (
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Raison : {latestKyc.rejectionReason}
              </p>
            )}
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              Vous pouvez resoumettre vos documents ci-dessous.
            </p>
          </CardContent>
        </Card>
      )

    default:
      return (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardContent className="pt-6">
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Votre profil n&apos;est pas encore verifie
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Soumettez vos documents pour verifier votre identite.
            </p>
          </CardContent>
        </Card>
      )
  }
}
