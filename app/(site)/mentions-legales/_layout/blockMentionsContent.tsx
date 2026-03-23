"use client";

import Link from "next/link";

const SECTIONS = [
  {
    id: "editeur",
    title: "1. Éditeur du site",
    content: (
      <>
        <div className="bg-[#f5f0eb] rounded-xl p-6 my-4">
          <p className="text-[#1a1a1a]">
            <strong>Club M</strong>
            <br />
            La communauté des femmes entrepreneures en RDC
          </p>
          <p className="mt-3">
            <strong>Siège social :</strong> Kinshasa, République Démocratique du
            Congo
          </p>
          <p>
            <strong>Email :</strong>{" "}
            <a href="mailto:contact@clubm.cd" className="text-[#a55b46] hover:underline">
              contact@clubm.cd
            </a>
          </p>
          <p>
            <strong>Directrice de la publication :</strong> Maurelle KITEBI,
            Fondatrice
          </p>
        </div>
      </>
    ),
  },
  {
    id: "hebergement",
    title: "2. Hébergement",
    content: (
      <>
        <p className="text-[#6b7280] mb-4">
          Le site Club M est hébergé par :
        </p>
        <div className="bg-[#f5f0eb] rounded-xl p-6 my-4">
          <p><strong>Hébergeur :</strong> [Nom de l&apos;hébergeur]</p>
          <p><strong>Adresse :</strong> [Adresse de l&apos;hébergeur]</p>
          <p><strong>Contact :</strong> [Contact hébergeur]</p>
        </div>
      </>
    ),
  },
  {
    id: "propriete",
    title: "3. Propriété intellectuelle",
    content: (
      <>
        <p className="text-[#6b7280] mb-4">
          L&apos;ensemble du contenu du site Club M (textes, images, logos,
          vidéos, graphismes, icônes, etc.) est la propriété exclusive de Club
          M ou de ses partenaires et est protégé par les lois relatives à la
          propriété intellectuelle.
        </p>
        <p className="text-[#6b7280] mb-4">
          Toute reproduction, représentation, modification, publication,
          adaptation de tout ou partie des éléments du site, quel que soit le
          moyen ou le procédé utilisé, est interdite, sauf autorisation écrite
          préalable de Club M.
        </p>
        <p className="text-[#6b7280]">
          Toute exploitation non autorisée du site ou de l&apos;un quelconque des
          éléments qu&apos;il contient sera considérée comme constitutive
          d&apos;une contrefaçon et poursuivie conformément aux dispositions
          légales en vigueur.
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "4. Protection des données personnelles",
    content: (
      <>
        <h3 className="text-[#a55b46] font-semibold mt-6 mb-2 text-lg">
          4.1 Collecte des données
        </h3>
        <p className="text-[#6b7280] mb-2">
          Club M collecte des données personnelles dans le cadre de :
        </p>
        <ul className="list-disc pl-6 text-[#6b7280] mb-4 space-y-1">
          <li>L&apos;inscription à la plateforme (nom, prénom, email, téléphone)</li>
          <li>L&apos;utilisation des services (données de navigation, préférences)</li>
          <li>La participation aux événements</li>
          <li>L&apos;inscription à la newsletter</li>
        </ul>
        <h3 className="text-[#a55b46] font-semibold mt-6 mb-2 text-lg">
          4.2 Utilisation des données
        </h3>
        <p className="text-[#6b7280] mb-2">Les données collectées sont utilisées pour :</p>
        <ul className="list-disc pl-6 text-[#6b7280] mb-4 space-y-1">
          <li>Gérer votre compte et vos accès aux services</li>
          <li>Vous informer des événements et actualités du Club</li>
          <li>Améliorer nos services et votre expérience utilisateur</li>
          <li>Répondre à vos demandes de contact</li>
        </ul>
        <h3 className="text-[#a55b46] font-semibold mt-6 mb-2 text-lg">
          4.3 Vos droits
        </h3>
        <p className="text-[#6b7280] mb-2">
          Conformément à la réglementation applicable, vous disposez des droits
          suivants :
        </p>
        <ul className="list-disc pl-6 text-[#6b7280] mb-4 space-y-1">
          <li><strong>Droit d&apos;accès :</strong> obtenir la confirmation du traitement de vos données et en obtenir une copie</li>
          <li><strong>Droit de rectification :</strong> demander la modification de vos données si elles sont inexactes</li>
          <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données personnelles</li>
          <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
          <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
        </ul>
        <p className="text-[#6b7280]">
          Pour exercer ces droits, contactez-nous à :{" "}
          <a href="mailto:privacy@clubm.cd" className="text-[#a55b46] hover:underline">
            privacy@clubm.cd
          </a>
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies",
    content: (
      <>
        <p className="text-[#6b7280] mb-4">
          Le site Club M utilise des cookies pour améliorer votre expérience de
          navigation. Les cookies sont de petits fichiers texte stockés sur votre
          appareil.
        </p>
        <h3 className="text-[#a55b46] font-semibold mt-6 mb-2 text-lg">
          5.1 Types de cookies utilisés
        </h3>
        <ul className="list-disc pl-6 text-[#6b7280] mb-4 space-y-1">
          <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
          <li><strong>Cookies de performance :</strong> pour analyser l&apos;utilisation du site et améliorer nos services</li>
          <li><strong>Cookies de fonctionnalité :</strong> pour mémoriser vos préférences</li>
        </ul>
        <h3 className="text-[#a55b46] font-semibold mt-6 mb-2 text-lg">
          5.2 Gestion des cookies
        </h3>
        <p className="text-[#6b7280]">
          Vous pouvez à tout moment modifier vos préférences en matière de
          cookies via les paramètres de votre navigateur. Notez que le blocage de
          certains cookies peut affecter votre expérience sur le site.
        </p>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "6. Limitation de responsabilité",
    content: (
      <>
        <p className="text-[#6b7280] mb-4">
          Club M s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour
          des informations diffusées sur ce site. Toutefois, Club M ne peut
          garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des
          informations mises à disposition.
        </p>
        <p className="text-[#6b7280] mb-2">Club M décline toute responsabilité :</p>
        <ul className="list-disc pl-6 text-[#6b7280] space-y-1">
          <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site</li>
          <li>Pour tous dommages résultant d&apos;une intrusion frauduleuse d&apos;un tiers</li>
          <li>Pour tout dommage causé par l&apos;utilisation de liens hypertextes vers des sites tiers</li>
        </ul>
      </>
    ),
  },
  {
    id: "droit",
    title: "7. Droit applicable",
    content: (
      <p className="text-[#6b7280]">
        Les présentes mentions légales sont régies par le droit de la
        République Démocratique du Congo. En cas de litige, et après tentative
        de recherche d&apos;une solution amiable, compétence est attribuée aux
        tribunaux compétents de Kinshasa.
      </p>
    ),
  },
  {
    id: "contact",
    title: "8. Contact",
    content: (
      <>
        <p className="text-[#6b7280] mb-4">
          Pour toute question relative aux présentes mentions légales ou à
          l&apos;utilisation du site, vous pouvez nous contacter :
        </p>
        <div className="bg-[#f5f0eb] rounded-xl p-6 my-4">
          <p>
            <strong>Par email :</strong>{" "}
            <a href="mailto:contact@clubm.cd" className="text-[#a55b46] hover:underline">
              contact@clubm.cd
            </a>
          </p>
          <p>
            <strong>Par courrier :</strong> Club M - Kinshasa, RDC
          </p>
          <p>
            <strong>Via le formulaire :</strong>{" "}
            <Link href="/contact" className="text-[#a55b46] hover:underline">
              Page Contact
            </Link>
          </p>
        </div>
      </>
    ),
  },
];

const BlockMentionsContent = () => {
  return (
    <main className="max-w-[900px] mx-auto px-4 md:px-6 py-10 md:py-16">
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="bg-white rounded-2xl p-6 md:p-8 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        >
          <h2 className="text-[#091626] font-serif text-xl md:text-2xl font-semibold mb-6 pb-3 border-b-2 border-[#e1c593]">
            {section.title}
          </h2>
          <div className="text-[#1a1a1a]">{section.content}</div>
        </section>
      ))}
      <p className="text-center text-[#6b7280] text-sm pt-8 mt-8 border-t border-black/8">
        Dernière mise à jour : Février 2026
      </p>
    </main>
  );
};

export default BlockMentionsContent;
