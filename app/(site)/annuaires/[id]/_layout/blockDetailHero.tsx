"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import type { ServiceDetail } from "../../_layout/annuaireData";
import type { ProfileWithProducts } from "@/domains/directory/types";

interface BlockDetailHeroProps {
  service: ServiceDetail;
  profile?: ProfileWithProducts;
}

const BlockDetailHero = ({ service, profile }: BlockDetailHeroProps) => {
  const businessName = profile?.businessName || service.title;
  const description = profile?.description || service.description;
  const coverImage = profile?.coverImage || "/images/cover2.png";

  return (
    <>
      <section className="relative md:min-h-[450px] z-10 min-h-[65vh] flex items-end pb-8 md:pb-32 pt-0">
        <div className="absolute inset-0 -z-20">
          <Image
            src={coverImage}
            alt={businessName}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0 z-[-1] bg-gradient-to-t from-black/95 via-black/50 to-black/30"
          aria-hidden
        />
        <div className="w-full px-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1"></div>
            <div className="col-span-12 lg:col-span-10">
              <div className="flex mt-4 justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[#ffffff] text-2xl lg:text-5xl font-semibold mb-2">
                      {businessName}
                    </h2>
                    {!profile && (
                      <span className="flex items-center gap-1 text-white/80">
                        (
                        <Star className="w-4 h-4 text-[#a55b46] fill-[#a55b46]" />{" "}
                        {service.rating})
                      </span>
                    )}
                  </div>
                  <p className="text-white/80 text-sm lg:text-[18px]">
                    {profile ? profile.category : description}
                  </p>
                </div>

              </div>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlockDetailHero;
