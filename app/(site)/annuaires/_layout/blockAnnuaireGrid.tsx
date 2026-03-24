"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <section className="py-12 md:py-16  bg-[#f5f5f5]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-3 lg:gap-6">
          <div className="col-span-12 lg:col-span-3">
            <div className="card-filtre bg-white md:p-6 rounded-2xl md:sticky top-34">
              <h5 className="text-[#151516] text-lg font-medium mb-4">
                Filtres
              </h5>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-xs font-medium text-[#151516]">
                    Catégorie
                  </span>
                  <Select>
                    <SelectTrigger className="w-full shadow-none !h-[44px]  focus-visible:ring-0 focus-visible:border-black rounded-lg">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beaute-bien-etre">
                        Beauté & bien-être
                      </SelectItem>
                      <SelectItem value="restauration-food-business">
                        Restauration &amp; food business
                      </SelectItem>
                      <SelectItem value="mode-lifestyle">
                        Mode &amp; lifestyle
                      </SelectItem>
                      <SelectItem value="commerce-ecommerce">
                        Commerce &amp; e-commerce
                      </SelectItem>
                      <SelectItem value="communication-contenu">
                        Communication &amp; création de contenu
                      </SelectItem>
                      <SelectItem value="services-professionnels">
                        Services professionnels
                      </SelectItem>
                      <SelectItem value="formation-coaching">
                        Formation &amp; coaching
                      </SelectItem>
                      <SelectItem value="entrepreneuriat-social">
                        Entrepreneuriat social
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span className="text-xs font-medium text-[#151516]">
                    Type
                  </span>
                  <Select>
                    <SelectTrigger className="w-full shadow-none !h-[44px]  focus-visible:ring-0 focus-visible:border-black rounded-lg">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oneshot">One shot</SelectItem>
                      <SelectItem value="monthly">
                        Abonnement mensuel
                      </SelectItem>
                      <SelectItem value="project">Pack projet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span className="text-xs font-medium text-[#151516]">
                    Prix
                  </span>
                  <Select>
                    <SelectTrigger className="w-full shadow-none !h-[44px] focus-visible:ring-0 focus-visible:border-black rounded-lg">
                      <SelectValue placeholder="Tous les prix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">$ Accessible</SelectItem>
                      <SelectItem value="medium">$$ Standard</SelectItem>
                      <SelectItem value="high">$$$ Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              <div className="col-span-12 lg:col-span-8">
                <p className="text-[#6b7280] text-sm mb-8 hidden">
                  <strong className="text-[#1f2937]">
                    {MOCK_SERVICES.length}
                  </strong>{" "}
                  services disponibles
                </p>
                <h4 className="text-[#151516] text-2xl md:text-3xl font-semibold mb-1">
                  Découvre les membres du Club M.
                </h4>
                <p className="text-[#151516]/80 text-sm md:text-base mb-8 w-[650px] max-w-full">
                  Derrière chaque profil de cet annuaire, il y a une femme qui a
                  choisi de construire quelque chose par elle-même : un projet,
                  une activité, une entreprise.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center relative w-full">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search size={18} className="text-[#151516]" />
                    </div>
                    <Input
                      placeholder="Rechercher un membre"
                      className="text-sm pl-10 border-none shadow-none bg-white h-[42px] rounded-lg placeholder:text-muted-foreground placeholder:opacity-70"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_SERVICES.map((service) => (
                <Link
                  key={service.id}
                  href={`/annuaires/${service.id}`}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden p-2">
                    <div className="relative w-full h-full overflow-hidden rounded-xl">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-400 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[#ffffff] px-2 py-1 rounded-full text-xs font-medium">
                        {service.category}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 pt-2">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 relative">
                          <Image
                            src={service.providerImage}
                            alt={service.providerName}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#151516]">
                            {service.providerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-[#e1c593] fill-[#e1c593]" />
                          <span className="font-bold text-[#151516]">
                            {service.rating}
                          </span>
                          <span className="text-[#151516]/60">
                            ({service.reviewsCount} avis)
                          </span>
                        </div>
                    </div>

                    <p className="text-[#151516]/80 text-sm line-clamp-2 mb-3 group-hover:text-[#1f2937]">
                      {service.title}
                    </p>
                    <div className="pt-3 border-t border-black/5 flex justify-between items-center">
                      <span className="font-bold text-[#151516]">
                        {service.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockAnnuaireGrid;
