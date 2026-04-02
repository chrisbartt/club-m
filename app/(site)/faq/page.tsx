import type { Metadata } from 'next'
import BlockSupportFaq from '@/app/(site)/support/_layout/blockSupportFaq'

export const metadata: Metadata = {
  title: 'Questions frequentes | Club M',
  description: 'Retrouvez les reponses aux questions les plus frequentes sur Club M : inscription, adhesion, evenements, paiement.',
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Questions frequentes
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Retrouvez les reponses aux questions les plus courantes sur Club M.
            Vous ne trouvez pas votre reponse ? Contactez-nous.
          </p>
        </div>

        <BlockSupportFaq />
      </div>
    </div>
  )
}
