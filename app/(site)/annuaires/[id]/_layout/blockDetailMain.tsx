"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { ServiceDetail } from "../../_layout/annuaireData";

interface BlockDetailMainProps {
  service: ServiceDetail;
}

const BlockDetailMain = ({ service }: BlockDetailMainProps) => {
  return (
    <div className="flex flex-col gap-8">
      {service.gallery.length > 0 && (
        <section className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
            <span>📸</span> Réalisations & Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.gallery.map((item, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group"
              >
                <Image
                  src={item.url}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <span className="text-white text-sm font-medium">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {service.videoThumb && (
        <section className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
            <span>🎬</span> Rencontrez {service.providerName.split(" ")[0]} en 2 minutes
          </h2>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
            <Image
              src={service.videoThumb}
              alt="Vidéo de présentation"
              fill
              className="object-cover"
            />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              aria-label="Lire la vidéo"
            >
              <span className="w-16 h-16 rounded-full bg-[#a55b46] flex items-center justify-center text-white shadow-lg">
                <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
            {service.videoDuration && (
              <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                {service.videoDuration}
              </span>
            )}
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
          <span>✨</span> Ce que vous obtenez
        </h2>
        <p className="text-[#6b7280] leading-relaxed mb-6">{service.description}</p>
        <ul className="space-y-3">
          {service.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#1a1a1a]">
              <Check className="w-5 h-5 text-[#66a381] shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {service.process.length > 0 && (
        <section className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
            <span>📋</span> Comment ça se passe ?
          </h2>
          <div className="space-y-3">
            {service.process.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-[#faf9f7] rounded-xl"
              >
                <span className="w-8 h-8 rounded-full bg-[#a55b46] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <span className="text-[#1a1a1a]">{step}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Avis des clients</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#e1c593] font-bold text-lg">{service.rating}</span>
            <span className="text-[#6b7280]">({service.reviewsCount} avis)</span>
          </div>
          <div className="text-[#6b7280] text-sm">
            👍 {service.reviews.length} avis positifs
          </div>
        </div>
        <div className="space-y-4">
          {service.reviews.map((review, i) => (
            <div
              key={i}
              className="border border-black/5 rounded-xl p-4 bg-[#faf9f7]"
            >
              <p className="text-[#1a1a1a] mb-2">{review.text}</p>
              <p className="text-sm text-[#6b7280]">
                {review.name} · {review.date}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlockDetailMain;
