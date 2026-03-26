import type { Metadata } from 'next'
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite'

export const metadata: Metadata = {
  title: 'Politique de Confidentialite | Club M',
  description: 'Politique de confidentialite et protection des donnees personnelles de Club M.',
}

export default function ConfidentialitePage() {
  return (
    <AppContainerWebSite>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 mb-6">
            Derniere mise a jour : 26 mars 2026
          </p>

          <h1 className="text-3xl font-bold mb-8">
            Politique de Confidentialite
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              Club M s&apos;engage a proteger la vie privee de ses utilisateurs. La presente
              Politique de Confidentialite decrit les donnees que nous collectons, la
              maniere dont nous les utilisons et les mesures que nous prenons pour les
              proteger.
            </p>

            {/* 1. Donnees collectees */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Donnees collectees
              </h2>
              <p>
                Dans le cadre de l&apos;utilisation de la Plateforme, nous sommes amenes a
                collecter les donnees personnelles suivantes :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>
                  <strong>Donnees d&apos;identification :</strong> nom, prenom, adresse email,
                  numero de telephone (+243)
                </li>
                <li>
                  <strong>Donnees de livraison :</strong> adresse de livraison (commune de
                  Kinshasa, quartier, avenue, numero)
                </li>
                <li>
                  <strong>Documents KYC :</strong> piece d&apos;identite, photo de profil,
                  documents justificatifs (pour les membres Premium et Business)
                </li>
                <li>
                  <strong>Donnees de transaction :</strong> historique des commandes, montants,
                  moyens de paiement utilises
                </li>
                <li>
                  <strong>Donnees de navigation :</strong> adresse IP, type de navigateur,
                  pages visitees
                </li>
              </ul>
            </div>

            {/* 2. Utilisation des donnees */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Utilisation des donnees
              </h2>
              <p>Les donnees collectees sont utilisees pour :</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>
                  Creer et gerer votre compte membre sur la Plateforme
                </li>
                <li>
                  Traiter vos commandes, paiements et livraisons
                </li>
                <li>
                  Verifier votre identite dans le cadre du processus KYC
                </li>
                <li>
                  Vous envoyer des communications relatives a votre compte, vos commandes
                  et les actualites de Club M
                </li>
                <li>
                  Ameliorer nos services et l&apos;experience utilisateur sur la Plateforme
                </li>
                <li>
                  Assurer la securite de la Plateforme et prevenir les fraudes
                </li>
              </ul>
            </div>

            {/* 3. Partage des donnees */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Partage des donnees
              </h2>
              <p>
                Vos donnees personnelles ne sont jamais vendues a des tiers. Elles peuvent
                etre partagees dans les cas suivants :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>
                  <strong>Vendeuses :</strong> vos informations de livraison (nom, adresse,
                  telephone) sont communiquees aux vendeuses pour permettre l&apos;expedition
                  de vos commandes
                </li>
                <li>
                  <strong>Prestataires techniques :</strong> nos partenaires technologiques
                  (hebergement, paiement, envoi d&apos;emails) peuvent avoir acces a certaines
                  donnees dans le cadre strict de la fourniture de leurs services
                </li>
                <li>
                  <strong>Obligations legales :</strong> vos donnees peuvent etre communiquees
                  aux autorites competentes si la loi l&apos;exige
                </li>
              </ul>
            </div>

            {/* 4. Securite */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Securite
              </h2>
              <p>
                Club M met en oeuvre des mesures techniques et organisationnelles appropriees
                pour proteger vos donnees personnelles :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Chiffrement des donnees en transit (HTTPS/TLS)</li>
                <li>Hashage securise des mots de passe</li>
                <li>
                  Acces restreint aux donnees personnelles (seul le personnel autorise y a
                  acces)
                </li>
                <li>Stockage securise des documents KYC</li>
                <li>Surveillance et journalisation des acces</li>
              </ul>
              <p className="mt-2">
                Malgre ces mesures, aucune methode de transmission ou de stockage electronique
                n&apos;est totalement securisee. Nous ne pouvons garantir une securite absolue
                de vos donnees.
              </p>
            </div>

            {/* 5. Droits des utilisateurs */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Droits des utilisateurs
              </h2>
              <p>
                Conformement a la legislation applicable, vous disposez des droits suivants
                concernant vos donnees personnelles :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>
                  <strong>Droit d&apos;acces :</strong> vous pouvez demander une copie de vos
                  donnees personnelles
                </li>
                <li>
                  <strong>Droit de rectification :</strong> vous pouvez demander la correction
                  de donnees inexactes ou incompletes
                </li>
                <li>
                  <strong>Droit de suppression :</strong> vous pouvez demander la suppression
                  de vos donnees personnelles, sous reserve des obligations legales de
                  conservation
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous pouvez vous opposer au
                  traitement de vos donnees a des fins de prospection commerciale
                </li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous a l&apos;adresse admin@clubm.cd. Nous
                nous engageons a repondre dans un delai de 30 jours.
              </p>
            </div>

            {/* 6. Cookies */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Cookies
              </h2>
              <p>
                Club M utilise des cookies de maniere minimale, uniquement pour :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>
                  <strong>Cookies de session :</strong> necessaires au fonctionnement de votre
                  compte et a la navigation sur la Plateforme
                </li>
                <li>
                  <strong>Cookies de preferences :</strong> pour sauvegarder vos parametres
                  d&apos;affichage et vos preferences
                </li>
              </ul>
              <p className="mt-2">
                Nous n&apos;utilisons pas de cookies publicitaires ni de cookies de suivi a des
                fins de profilage.
              </p>
            </div>

            {/* 7. Contact */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Contact
              </h2>
              <p>
                Pour toute question relative a la presente Politique de Confidentialite ou
                a la protection de vos donnees personnelles, vous pouvez nous contacter :
              </p>
              <ul className="list-none mt-2 space-y-1 ml-4">
                <li>
                  <strong>Email :</strong> admin@clubm.cd
                </li>
                <li>
                  <strong>Adresse :</strong> Kinshasa, Republique Democratique du Congo
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </AppContainerWebSite>
  )
}
