import type { Metadata } from 'next'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'

export const metadata: Metadata = {
  title: "Conditions Generales d'Utilisation | Club M",
  description: "Conditions generales d'utilisation de la plateforme Club M.",
}

export default function CguPage() {
  return (
    <AppContainerWebSite>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 mb-6">
            Derniere mise a jour : 26 mars 2026
          </p>

          <h1 className="text-3xl font-bold mb-8">
            Conditions Generales d&apos;Utilisation
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* 1. Objet */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Objet
              </h2>
              <p>
                Les presentes Conditions Generales d&apos;Utilisation (ci-apres &laquo; CGU &raquo;)
                regissent l&apos;acces et l&apos;utilisation de la plateforme Club M
                (ci-apres &laquo; la Plateforme &raquo;), accessible a l&apos;adresse clubm.cd.
              </p>
              <p className="mt-2">
                Club M est une plateforme marketplace et communautaire dediee aux femmes
                entrepreneures, basee a Kinshasa, Republique Democratique du Congo. Elle permet
                a ses membres de creer des boutiques en ligne, de vendre des produits et services,
                et de rejoindre une communaute d&apos;entrepreneures.
              </p>
              <p className="mt-2">
                En accedant a la Plateforme ou en creant un compte, vous acceptez sans reserve
                les presentes CGU.
              </p>
            </div>

            {/* 2. Inscription et compte */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Inscription et compte
              </h2>
              <p>
                L&apos;inscription sur Club M est ouverte a toute personne physique ou morale
                souhaitant rejoindre la communaute ou utiliser les services de la marketplace.
              </p>
              <p className="mt-2">
                Lors de l&apos;inscription, vous vous engagez a fournir des informations exactes,
                completes et a jour. Vous etes seul(e) responsable de la confidentialite de vos
                identifiants de connexion et de toute activite effectuee depuis votre compte.
              </p>
              <p className="mt-2">
                Selon le niveau d&apos;adhesion choisi (Free, Premium ou Business), une verification
                d&apos;identite (KYC) peut etre requise. Les membres Premium et Business doivent
                fournir les documents necessaires a la verification de leur identite.
              </p>
              <p className="mt-2">
                Club M se reserve le droit de suspendre ou de supprimer tout compte en cas de
                non-respect des presentes CGU ou de fraude averee.
              </p>
            </div>

            {/* 3. Utilisation de la plateforme */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Utilisation de la plateforme
              </h2>
              <p>
                La Plateforme doit etre utilisee conformement a sa destination : permettre aux
                membres de presenter leurs activites, vendre des produits et services, et
                interagir au sein de la communaute Club M.
              </p>
              <p className="mt-2">Il est strictement interdit de :</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>
                  Publier du contenu illegal, diffamatoire, discriminatoire ou portant atteinte
                  aux droits de tiers
                </li>
                <li>
                  Utiliser la Plateforme a des fins frauduleuses ou de blanchiment d&apos;argent
                </li>
                <li>
                  Tenter de compromettre la securite ou le fonctionnement de la Plateforme
                </li>
                <li>
                  Creer de faux comptes ou usurper l&apos;identite d&apos;une autre personne
                </li>
                <li>
                  Vendre des produits contrefaits, illegaux ou non conformes a la reglementation
                  en vigueur en RDC
                </li>
              </ul>
            </div>

            {/* 4. Achats et ventes */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Achats et ventes
              </h2>
              <p>
                Club M met en relation des vendeuses (membres Business) et des acheteurs via
                sa marketplace. Le processus de commande se deroule comme suit :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>
                  L&apos;acheteur selectionne des produits aupres d&apos;une boutique et passe commande
                </li>
                <li>
                  Le paiement est effectue via les moyens de paiement proposes sur la Plateforme
                </li>
                <li>
                  La vendeuse prepare la commande et organise la livraison
                </li>
                <li>
                  Un code de confirmation est fourni a l&apos;acheteur pour valider la reception
                  de la commande
                </li>
                <li>
                  La commande est consideree comme livree une fois le code de confirmation valide
                </li>
              </ul>
              <p className="mt-2">
                Les prix affiches sont en dollars americains (USD) et incluent les taxes
                applicables. Les frais de livraison sont calcules en fonction de la commune de
                livraison a Kinshasa.
              </p>
              <p className="mt-2">
                Chaque boutique est responsable de la qualite de ses produits, de l&apos;exactitude
                de ses descriptions et du respect de ses delais de livraison.
              </p>
            </div>

            {/* 5. Propriete intellectuelle */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Propriete intellectuelle
              </h2>
              <p>
                L&apos;ensemble des elements constituant la Plateforme (design, logo, textes,
                fonctionnalites) sont la propriete exclusive de Club M et sont proteges par
                les lois relatives a la propriete intellectuelle.
              </p>
              <p className="mt-2">
                Les contenus publies par les vendeuses (photos, descriptions de produits, noms
                de boutiques) restent la propriete de leurs auteurs. En publiant sur Club M,
                les vendeuses accordent a la Plateforme une licence non exclusive d&apos;utilisation
                de ces contenus a des fins de promotion et de fonctionnement du service.
              </p>
              <p className="mt-2">
                Toute reproduction, distribution ou utilisation non autorisee des contenus de
                la Plateforme est interdite.
              </p>
            </div>

            {/* 6. Responsabilite */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Responsabilite
              </h2>
              <p>
                Club M agit en qualite de plateforme d&apos;intermediation. A ce titre, Club M
                n&apos;est pas partie aux transactions entre vendeuses et acheteurs et ne saurait
                etre tenue responsable :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>De la qualite, de la conformite ou de la disponibilite des produits vendus</li>
                <li>Des litiges entre vendeuses et acheteurs</li>
                <li>Des retards ou defauts de livraison imputables aux vendeuses</li>
                <li>
                  Des dommages indirects resultant de l&apos;utilisation de la Plateforme
                </li>
              </ul>
              <p className="mt-2">
                Club M s&apos;engage neanmoins a mettre en oeuvre les moyens raisonnables pour
                assurer le bon fonctionnement de la Plateforme et faciliter la resolution des
                litiges entre utilisateurs.
              </p>
            </div>

            {/* 7. Modification des CGU */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Modification des CGU
              </h2>
              <p>
                Club M se reserve le droit de modifier les presentes CGU a tout moment. Les
                utilisateurs seront informes de toute modification par notification sur la
                Plateforme ou par email.
              </p>
              <p className="mt-2">
                La poursuite de l&apos;utilisation de la Plateforme apres notification des
                modifications vaut acceptation des nouvelles CGU.
              </p>
            </div>

            {/* 8. Droit applicable */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Droit applicable
              </h2>
              <p>
                Les presentes CGU sont regies par les lois de la Republique Democratique du Congo.
              </p>
              <p className="mt-2">
                En cas de litige, les parties s&apos;engagent a rechercher une solution amiable.
                A defaut, les tribunaux competents de Kinshasa seront seuls competents pour
                connaitre du litige.
              </p>
              <p className="mt-2">
                Pour toute question relative aux presentes CGU, vous pouvez nous contacter a
                l&apos;adresse : admin@clubm.cd
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppContainerWebSite>
  )
}
