"use client";

import Link from "next/link";
import { UserPlus, Star, Calendar, CreditCard } from "lucide-react";

const CARDS = [
  {
    href: "#faq-inscription",
    icon: UserPlus,
    title: "Inscription & Compte",
    description: "Créer un compte, se connecter, modifier son profil",
  },
  {
    href: "#faq-adhesion",
    icon: Star,
    title: "Adhésion & Formules",
    description: "Choisir sa formule, avantages membres, upgrade",
  },
  {
    href: "#faq-evenements",
    icon: Calendar,
    title: "Événements",
    description: "S'inscrire, annuler, accéder aux replays",
  },
  {
    href: "#faq-paiement",
    icon: CreditCard,
    title: "Paiement & Facturation",
    description: "Moyens de paiement, factures, remboursements",
  },
];

const BlockSupportQuickHelp = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-[#faf9f7] rounded-2xl p-6 md:p-8 text-center border-2 border-transparent hover:border-[#e1c593] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#e1c593]/20 to-[#e1c593]/5 flex items-center justify-center mx-auto mb-4">
                <card.icon className="w-7 h-7 text-[#a55b46]" />
              </div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">{card.title}</h3>
              <p className="text-sm text-[#6b7280]">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlockSupportQuickHelp;
