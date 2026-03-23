"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type Category = "all" | "inscription" | "adhesion" | "evenements" | "paiement";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "inscription", label: "Inscription" },
  { id: "adhesion", label: "Adhésion" },
  { id: "evenements", label: "Événements" },
  { id: "paiement", label: "Paiement" },
];

const FAQ_ITEMS: {
  id: string;
  category: Category;
  question: string;
  answer: React.ReactNode;
}[] = [
  {
    id: "faq-inscription",
    category: "inscription",
    question: "Comment créer un compte Club M ?",
    answer: (
      <>
        <p className="mb-2">Créer un compte Club M est simple et gratuit :</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Cliquez sur &quot;Devenir membre&quot; dans le menu</li>
          <li>Choisissez votre formule (vous pouvez commencer gratuitement)</li>
          <li>Remplissez le formulaire avec vos informations</li>
          <li>Validez votre email et accédez à votre espace membre</li>
        </ol>
      </>
    ),
  },
  {
    id: "inscription-2",
    category: "inscription",
    question: "J'ai oublié mon mot de passe, que faire ?",
    answer: (
      <p>
        Rendez-vous sur la page de connexion et cliquez sur &quot;Mot de passe
        oublié&quot;. Entrez votre adresse email et vous recevrez un lien pour
        réinitialiser votre mot de passe.
      </p>
    ),
  },
  {
    id: "faq-adhesion",
    category: "adhesion",
    question: "Quelles sont les différentes formules d'adhésion ?",
    answer: (
      <>
        <p className="mb-2">Club M propose 2 niveaux d&apos;adhésion :</p>
        <ul className="list-disc pl-5 space-y-1 mb-2">
          <li><strong>Essentielle :</strong> Communauté privée, annuaire, événements, Business Aligné</li>
          <li><strong>Premium :</strong> Ateliers exclusifs, visibilité premium, support prioritaire</li>
        </ul>
        <p>
          <Link href="/devenir-membre" className="text-[#a55b46] hover:underline">
            Découvrir les formules en détail →
          </Link>
        </p>
      </>
    ),
  },
  {
    id: "adhesion-2",
    category: "adhesion",
    question: "Comment passer à une formule supérieure ?",
    answer: (
      <p>
        Vous pouvez upgrader votre formule à tout moment depuis votre espace
        membre. La différence de cotisation sera calculée au prorata.
      </p>
    ),
  },
  {
    id: "faq-evenements",
    category: "evenements",
    question: "Comment m'inscrire à un événement ?",
    answer: (
      <p>
        Rendez-vous sur la page Événements, choisissez l&apos;événement et
        cliquez sur &quot;Réserver ma place&quot;. Certains événements sont
        inclus dans l&apos;adhésion Premium ou Business.
      </p>
    ),
  },
  {
    id: "evenements-2",
    category: "evenements",
    question: "Puis-je annuler ma participation à un événement ?",
    answer: (
      <p>
        Oui, vous pouvez annuler jusqu&apos;à 48h avant pour un remboursement
        intégral. Passé ce délai, un avoir peut être proposé. Contactez{" "}
        <a href="mailto:support@clubm.cd" className="text-[#a55b46] hover:underline">
          support@clubm.cd
        </a>
      </p>
    ),
  },
  {
    id: "faq-paiement",
    category: "paiement",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Mobile Money (M-Pesa, Orange Money, Airtel Money)</li>
        <li>Virement bancaire</li>
        <li>Cartes bancaires (Visa, Mastercard)</li>
        <li>Paiement en espèces lors des événements</li>
      </ul>
    ),
  },
  {
    id: "paiement-2",
    category: "paiement",
    question: "Comment obtenir une facture ?",
    answer: (
      <p>
        Vos factures sont disponibles dans votre espace membre, section
        &quot;Mes factures&quot;. Pour toute demande spécifique :{" "}
        <a href="mailto:facturation@clubm.cd" className="text-[#a55b46] hover:underline">
          facturation@clubm.cd
        </a>
      </p>
    ),
  },
];

const BlockSupportFaq = () => {
  const [category, setCategory] = useState<Category>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = FAQ_ITEMS.filter(
    (item) => category === "all" || item.category === category
  );

  return (
    <section id="faq" className="py-12 md:py-16 bg-[#faf9f7]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#a55b46]/10 text-[#a55b46] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Questions fréquentes
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#091626] mb-2">
            Trouvez vos <span className="text-[#a55b46]">réponses</span>
          </h2>
          <p className="text-[#6b7280] max-w-[600px] mx-auto">
            Les questions les plus posées par notre communauté
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-colors ${
                category === c.id
                  ? "bg-[#a55b46] border-[#a55b46] text-white"
                  : "bg-white border-black/10 text-[#1a1a1a] hover:border-[#a55b46] hover:text-[#a55b46]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="max-w-[800px] mx-auto space-y-3">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                id={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
              >
                <button
                  type="button"
                  className="w-full px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4 text-left font-semibold text-[#091626] hover:text-[#a55b46] transition-colors"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#a55b46] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ${
                    isOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="px-5 pb-5 md:px-6 md:pb-6 text-[#6b7280] leading-relaxed [&_a]:text-[#a55b46] [&_a:hover]:underline">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlockSupportFaq;
