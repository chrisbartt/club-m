"use client";

import Image from "next/image";
import Link from "next/link";
import type { ServiceDetail } from "../../_layout/annuaireData";

interface BlockDetailRelatedProps {
  otherByProvider: ServiceDetail[];
  related: ServiceDetail[];
  currentId: string;
}

const BlockDetailRelated = ({
  otherByProvider,
  related,
  currentId,
}: BlockDetailRelatedProps) => {
  const showOther = otherByProvider.length > 0;
  const showRelated = related.length > 0;
  if (!showOther && !showRelated) return null;

  const Card = ({ service }: { service: ServiceDetail }) => (
    <Link
      href={`/annuaires/${service.id}`}
      className="group block bg-white rounded-2xl border border-black/5 overflow-hidden hover:border-[#a55b46] hover:shadow-lg transition-all"
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <p className="font-semibold text-[#1a1a1a] line-clamp-2 group-hover:text-[#a55b46]">
          {service.title}
        </p>
        <p className="text-sm text-[#6b7280] mt-1">
          {service.providerName} · {service.rating} ({service.reviewsCount} avis)
        </p>
        <p className="text-sm font-bold text-[#a55b46] mt-2">{service.price}</p>
      </div>
    </Link>
  );

  return (
    <div className="bg-[#faf9f7] py-12 md:py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        {showOther && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#091626] mb-6">
              Autres services de ce vendeur
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherByProvider.map((s) => (
                <Card key={s.id} service={s} />
              ))}
            </div>
          </div>
        )}
        {showRelated && (
          <div>
            <h2 className="text-xl font-bold text-[#091626] mb-6">
              Services similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((s) => (
                <Card key={s.id} service={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockDetailRelated;
