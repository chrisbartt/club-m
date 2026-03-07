"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const MOCK_SERVICES = [
  {
    id: "1",
    title: "Création de logo & identité visuelle",
    category: "Marketing & Communication",
    providerName: "Emmanuela K.",
    providerImage: "/images/emmanuela.jpeg",
    rating: 4.9,
    reviewsCount: 52,
    price: "À partir de 150 $",
    image: "/images/banner4.jpg",
  },
  {
    id: "2",
    title: "Gestion des réseaux sociaux",
    category: "Digital & Tech",
    providerName: "Michelle T.",
    providerImage: "/images/michelle.jpeg",
    rating: 4.8,
    reviewsCount: 34,
    price: "À partir de 80 $/mois",
    image: "/images/banner1.jpg",
  },
  {
    id: "3",
    title: "Comptabilité & déclarations",
    category: "Comptabilité & Finance",
    providerName: "Vanessa M.",
    providerImage: "/images/vanessa.jpeg",
    rating: 5,
    reviewsCount: 28,
    price: "Sur devis",
    image: "/images/banner5.jpg",
  },
  {
    id: "4",
    title: "Coaching entrepreneurial",
    category: "Coaching & Mindset",
    providerName: "Maurelle K.",
    providerImage: "/images/maurelle.jpeg",
    rating: 4.9,
    reviewsCount: 41,
    price: "À partir de 60 $/séance",
    image: "/images/banner6.jpg",
  },
  {
    id: "5",
    title: "Formation Excel & outils",
    category: "Formation & Ateliers",
    providerName: "Ornella K.",
    providerImage: "/images/ornella.jpeg",
    rating: 4.7,
    reviewsCount: 19,
    price: "Pack 5 séances",
    image: "/images/banner2.png",
  },
  {
    id: "6",
    title: "Conseil juridique & statuts",
    category: "Juridique & Administratif",
    providerName: "Chantal M.",
    providerImage: "/images/chantal.jpeg",
    rating: 4.8,
    reviewsCount: 22,
    price: "Sur devis",
    image: "/images/banner7.jpg",
  },
];

const BlockAnnuaireGrid = () => {
  return (
    <section className="py-12 md:py-16 lg:pb-[250px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-[#6b7280] text-sm mb-8">
          <strong className="text-[#1f2937]">{MOCK_SERVICES.length}</strong>{" "}
          services disponibles
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SERVICES.map((service) => (
            <Link
              key={service.id}
              href={`/annuaires/${service.id}`}
              className="group bg-white rounded-2xl border border-black/5 overflow-hidden hover:border-[#a55b46] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-400 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute bottom-3 left-3 bg-white text-[#a55b46] px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  {service.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#e1c593] overflow-hidden shrink-0 relative">
                  <Image
                    src={service.providerImage}
                    alt={service.providerName}
                    fill
                    className="rounded-full object-cover"
                  />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1f2937]">
                      {service.providerName}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-[#e1c593] fill-[#e1c593]" />
                      <span className="font-bold text-[#a55b46]">
                        {service.rating}
                      </span>
                      <span className="text-[#6b7280]">
                        ({service.reviewsCount} avis)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[#6b7280] text-sm line-clamp-2 mb-3 group-hover:text-[#1f2937]">
                  {service.title}
                </p>
                <div className="pt-3 border-t border-black/5 flex justify-between items-center">
                  <span className="text-xs text-[#6b7280] uppercase">
                    À partir de
                  </span>
                  <span className="font-bold text-[#a55b46]">{service.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlockAnnuaireGrid;
