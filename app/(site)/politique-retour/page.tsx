import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de retour | Club M',
  description: 'Conditions de retour et remboursement sur la marketplace Club M.',
}

export default function PolitiqueRetourPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Politique de retour et remboursement</h1>
      <p className="text-sm text-muted-foreground mb-8">Derniere mise a jour : 2 avril 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Principes generaux</h2>
          <p className="text-muted-foreground">
            Club M facilite les transactions entre acheteurs et vendeuses sur sa marketplace.
            Chaque vendeuse definit ses propres conditions de retour pour ses produits.
            La presente politique cadre les regles minimales applicables a toutes les transactions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Delai de retour</h2>
          <p className="text-muted-foreground">
            L&apos;acheteur dispose d&apos;un delai de <strong>48 heures</strong> apres reception de la commande
            pour signaler un probleme (produit non conforme, endommage, ou erreur de commande).
            Passe ce delai, aucun retour ne sera accepte sauf accord exceptionnel de la vendeuse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Conditions de retour</h2>
          <p className="text-muted-foreground">Un retour peut etre demande dans les cas suivants :</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Produit recu different de la description ou des photos</li>
            <li>Produit endommage lors de la livraison</li>
            <li>Erreur de quantite ou de variante</li>
            <li>Produit defectueux</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            Les retours pour convenance personnelle (changement d&apos;avis) ne sont pas garantis
            et dependent de la politique individuelle de chaque vendeuse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Procedure</h2>
          <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mt-2">
            <li>Ouvrir un litige depuis la page de detail de votre commande (section &quot;Mes achats&quot;)</li>
            <li>Decrire le probleme avec des photos si possible</li>
            <li>La vendeuse dispose de 48h pour repondre</li>
            <li>En cas de desaccord, l&apos;equipe Club M intervient pour mediation</li>
            <li>Si le retour est accepte, le produit doit etre retourne dans son etat original</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Remboursement</h2>
          <p className="text-muted-foreground">
            Une fois le retour valide, le remboursement est effectue dans un delai de 5 a 10 jours ouvrables
            via le meme moyen de paiement utilise lors de l&apos;achat. Les frais de livraison initiaux
            ne sont rembourses que si l&apos;erreur provient de la vendeuse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Services</h2>
          <p className="text-muted-foreground">
            Les services achetes sur la marketplace ne sont pas remboursables une fois le service rendu.
            En cas de litige sur la qualite du service, la procedure de mediation s&apos;applique.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. Exceptions</h2>
          <p className="text-muted-foreground">
            Les produits suivants ne sont pas eligible au retour : produits personnalises,
            denrees perissables, sous-vetements et articles d&apos;hygiene intime.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">8. Contact</h2>
          <p className="text-muted-foreground">
            Pour toute question relative aux retours et remboursements, contactez-nous a{' '}
            <a href="mailto:support@clubm.cd" className="text-primary hover:underline">support@clubm.cd</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
