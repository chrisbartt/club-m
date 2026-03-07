"use client";

import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const CARDS = [
  {
    icon: MessageCircle,
    iconBg: "bg-[#66a381]/15 text-[#66a381]",
    title: "WhatsApp",
    description:
      "Rejoignez notre groupe de support pour une assistance rapide entre membres",
    action: (
      <Button variant="outline" className="border-2 border-[#a55b46] text-[#a55b46] hover:bg-[#a55b46] hover:text-white rounded-xl" asChild>
        <a href="#">Rejoindre le groupe</a>
      </Button>
    ),
  },
  {
    icon: Mail,
    iconBg: "bg-[#e1c593]/20 text-[#b8924d]",
    title: "Email",
    description: "Envoyez-nous un message et nous vous répondrons sous 24-48h",
    action: (
      <Button className="bg-[#e1c593] text-[#091626] hover:bg-[#f0ddb8] rounded-xl" asChild>
        <a href="mailto:support@clubm.cd">support@clubm.cd</a>
      </Button>
    ),
  },
  {
    icon: MapPin,
    iconBg: "bg-[#a55b46]/12 text-[#a55b46]",
    title: "En personne",
    description:
      "Rendez-vous lors de nos événements pour échanger directement avec l'équipe",
    action: (
      <Button className="bg-[#a55b46] hover:bg-[#8a4a3a] text-white rounded-xl" asChild>
        <Link href="/evenements">Voir les événements</Link>
      </Button>
    ),
  },
];

const BlockSupportContact = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#a55b46]/10 text-[#a55b46] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Besoin d&apos;aide ?
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#091626] mb-2">
            Contactez notre <span className="text-[#a55b46]">équipe</span>
          </h2>
          <p className="text-[#6b7280]">Notre équipe est là pour vous accompagner</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-[#faf9f7] rounded-2xl p-6 md:p-8 text-center hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-full ${card.iconBg} flex items-center justify-center mx-auto mb-5`}
              >
                <card.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-[#091626] text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-[#6b7280] text-sm mb-6">{card.description}</p>
              {card.action}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlockSupportContact;
