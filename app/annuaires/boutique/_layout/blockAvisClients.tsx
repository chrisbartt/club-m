import React from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

const AVIS = [
  {
    id: 1,
    quote:
      "Prestation très professionnelle et à l'écoute. Les livrables ont dépassé mes attentes et m'ont permis d'avancer concrètement sur mon projet.",
    name: "Marie K.",
    role: "Entrepreneure",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Un accompagnement sur-mesure qui m'a aidée à structurer mon activité. Je recommande les yeux fermés pour toute personne qui veut avancer sereinement.",
    name: "Sarah M.",
    role: "Créatrice d'entreprise",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "Réactive, claire et efficace. Les échanges étaient réguliers et les conseils directement applicables. Une experte de confiance.",
    name: "Claire T.",
    role: "Particulière",
    avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
    rating: 5,
  },
];

const BlockAvisClients = () => {
  return (
    <div className="block-avis bg-[#f8f8f8] lg:py-[100px] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-1"></div>
          <div className="col-span-12 lg:col-span-10">
            <h2 className="text-2xl lg:text-4xl font-medium text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
              Avis des clients
            </h2>
            <p className="text-muted-foreground lg:text-[18px] text-[16px] mb-8 max-w-2xl">
              Ce que disent les clientes et les partenaires après avoir travaillé
              avec nous.
            </p>
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              {AVIS.map((avis) => (
                <div
                  key={avis.id}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <div className="bg-white rounded-2xl p-6 h-full border border-[#00000008] shadow-sm flex flex-col">
                    <Quote className="w-10 h-10 text-[#a55b46]/40 mb-3 shrink-0" />
                    <p className="text-[#091626] text-base italic mb-4 flex-1">
                      « {avis.quote} »
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-[#00000008]">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={avis.avatar}
                          alt={avis.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#091626] font-semibold truncate">
                          {avis.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {avis.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 ml-auto shrink-0">
                        {Array.from({ length: avis.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-[#a55b46] text-[#a55b46]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockAvisClients;
