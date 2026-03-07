"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Clock, MapPin, UsersRound } from "lucide-react";
import Image from "next/image";

const hotes = [
  { id: "1", name: "Maurelle KITEBI", company: "Le Club M", image: "/images/maurelle.jpeg", alt: "maurelle" },
];

const intervenantes = [
  { id: "1", name: "Malu MAKWENGE", company: "La Maison Hobah", image: "/images/malu.jpeg", alt: "malu" },
  { id: "2", name: "Faida TRIBUNALI", company: "24h Designer", image: "/images/faida.jpeg", alt: "faida" },
  { id: "3", name: "Anala MAMBEKE", company: "Fit Brunch", image: "/images/anaia.jpeg", alt: "anaia" },
];

const mcs = [
  { id: "1", name: "Vanessa TSHIAMALA", company: "Thami", image: "/images/vanessa.jpeg", alt: "vanessa" },
];

const participantes = [
  { id: "1", name: "Chantal MANGBAU", company: "Champion National Beauty", image: "/images/chantal.jpeg", alt: "chantal" },
  { id: "2", name: "Michelle MASIMANGO", company: "Fit Brunch", image: "/images/michelle.jpeg", alt: "michelle" },
  { id: "3", name: "Chloé MOHULU", company: null, image: "/images/chloe.jpeg", alt: "chloe" },
  { id: "4", name: "Ornella IZEMENGIA", company: null, image: "/images/ornella.jpeg", alt: "ornella" },
];

const galleryImages = [
  "/images/banner1.jpg",
  "/images/banner2.png",
  "/images/banner3.jpg",
  "/images/banner4.jpg",
  "/images/banner5.jpg",
  "/images/banner6.jpg",
];

const BlockDetailEvent = () => {
  return (
    <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6 mt-6">
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* Colonne principale */}
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          <div className="bg-bgCard rounded-xl border border-colorBorder overflow-hidden cardShadow">
            {/* En-tête événement */}
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-gray-100 text-colorTitle border border-colorBorder">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Lunch
                    </span>
                    <span className="text-[14px] text-colorMuted">27 décembre 2023</span>
                  </div>
                  <h1 className="text-colorTitle text-2xl lg:text-3xl xl:text-[28px] font-bold leading-tight">
                    Business Women Lunch
                  </h1>
                  <p className="text-colorMuted text-base mt-1">
                    Comment transformer ses abonnés en clients ?
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-[14px] text-colorTitle">
                      <div className="w-8 h-8 rounded-full bg-bgGray flex items-center justify-center shrink-0">
                        <Clock size={16} className="text-colorMuted" />
                      </div>
                      12h - 16h
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-colorTitle">
                      <div className="w-8 h-8 rounded-full bg-bgGray flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-colorMuted" />
                      </div>
                      La Maison Hobah
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-colorTitle">
                      <div className="w-8 h-8 rounded-full bg-bgGray flex items-center justify-center shrink-0">
                        <UsersRound size={16} className="text-colorMuted" />
                      </div>
                      35 participants
                    </div>
                  </div>
                </div>
                <div className="shrink-0 px-4 py-3 rounded-lg border border-dashed border-colorBorder bg-bgGray/50">
                  <p className="text-[12px] font-medium text-colorMuted uppercase">Places restantes</p>
                  <p className="text-2xl font-bold text-colorTitle mt-1">
                    23 <span className="text-colorMuted font-normal text-base">/ 35</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 lg:px-8 pb-6">
              <h2 className="text-lg font-semibold text-colorTitle mb-2">Description de l&apos;événement</h2>
              <p className="text-[14px] text-colorMuted leading-relaxed">
                L&apos;événement où les femmes entrepreneures se connectent, apprennent et transforment chaque
                rencontre en opportunité de business. Cet événement est organisé par le Club M, un réseau qui a
                pour mission de soutenir l&apos;entrepreneuriat féminin. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Rerum nisi eos, ipsum repellendus sit ducimus assumenda expedita aliquam
                corrupti quae sequi reiciendis praesentium possimus officiis veniam consequuntur sed fuga!
              </p>
            </div>

            {/* Hôte */}
            <div className="px-6 lg:px-8 pb-6">
              <h2 className="text-lg font-semibold text-colorTitle mb-3">Hôte</h2>
              <div className="grid grid-cols-12 gap-4">
                {hotes.map((hote) => (
                  <div key={hote.id} className="col-span-6 lg:col-span-3">
                    <div className="rounded-xl overflow-hidden border border-colorBorder bg-bgCard">
                      <div className="relative h-[200px] lg:h-[260px]">
                        <Image src={hote.image} alt={hote.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-base">{hote.name}</p>
                          <p className="text-white/80 text-sm">{hote.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Intervenantes */}
            <div className="px-6 lg:px-8 pb-6">
              <h2 className="text-lg font-semibold text-colorTitle mb-3">Intervenantes</h2>
              <div className="grid grid-cols-12 gap-4">
                {intervenantes.map((inv) => (
                  <div key={inv.id} className="col-span-6 lg:col-span-3">
                    <div className="rounded-xl overflow-hidden border border-colorBorder bg-bgCard">
                      <div className="relative h-[180px] lg:h-[220px]">
                        <Image src={inv.image} alt={inv.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-sm">{inv.name}</p>
                          <p className="text-white/80 text-xs">{inv.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MC */}
            <div className="px-6 lg:px-8 pb-6">
              <h2 className="text-lg font-semibold text-colorTitle mb-3">MC</h2>
              <div className="grid grid-cols-12 gap-4">
                {mcs.map((mc) => (
                  <div key={mc.id} className="col-span-6 lg:col-span-3">
                    <div className="rounded-xl overflow-hidden border border-colorBorder bg-bgCard">
                      <div className="relative h-[200px] lg:h-[260px]">
                        <Image src={mc.image} alt={mc.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-base">{mc.name}</p>
                          <p className="text-white/80 text-sm">{mc.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participantes */}
            <div className="px-6 lg:px-8 pb-6">
              <h2 className="text-lg font-semibold text-colorTitle mb-3">Participantes</h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {participantes.map((p) => (
                    <CarouselItem key={p.id} className="basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <div className="rounded-xl border border-colorBorder bg-bgCard p-4 text-center">
                        <div className="relative w-20 h-20 rounded-full mx-auto overflow-hidden">
                          <Image src={p.image} alt={p.alt} fill className="object-cover" sizes="80px" unoptimized />
                        </div>
                        <p className="text-colorTitle font-medium text-sm mt-2">{p.name}</p>
                        {p.company && <p className="text-colorMuted text-xs">{p.company}</p>}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="border-colorBorder bg-bgCard" />
                <CarouselNext className="border-colorBorder bg-bgCard" />
              </Carousel>
            </div>

            {/* Galerie photos */}
            <div className="px-6 lg:px-8 pb-6">
              <h2 className="text-lg font-semibold text-colorTitle mb-3">Galerie photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleryImages.slice(0, 6).map((src, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-colorBorder">
                    <Image src={src} alt={`Galerie ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" unoptimized />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar sticky */}
        <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
          <div className="lg:sticky lg:top-28 space-y-4">
            {/* Carte Ticket */}
            <div className="rounded-xl bg-bgSidebar text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10">
                <p className="text-[#a55b46] font-semibold text-lg">Ticket</p>
                <p className="text-3xl font-bold mt-1">60 $</p>
                
              </div>
            </div>
            {/* Résumé */}
            <div className="rounded-xl border border-colorBorder bg-bgCard p-5">
              <h3 className="font-semibold text-colorTitle text-base">Business Women Lunch</h3>
              <p className="text-colorMuted text-sm mt-1">Comment transformer ses abonnés en clients ?</p>
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-[14px] text-colorTitle">
                  <Clock size={16} className="text-colorMuted shrink-0" />
                  12h - 16h
                </div>
                <div className="flex items-center gap-2 text-[14px] text-colorTitle">
                  <MapPin size={16} className="text-colorMuted shrink-0" />
                  La Maison Hobah
                </div>
                <div className="flex items-center gap-2 text-[14px] text-colorTitle">
                  <UsersRound size={16} className="text-colorMuted shrink-0" />
                  35 participants
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetailEvent;
