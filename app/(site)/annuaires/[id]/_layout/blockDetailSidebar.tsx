"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MessageCircle, Heart } from "lucide-react";
import type { ServiceDetail } from "../../_layout/annuaireData";
import { Button } from "@/components/ui/button";

interface BlockDetailSidebarProps {
  service: ServiceDetail;
}

const BlockDetailSidebar = ({ service }: BlockDetailSidebarProps) => {
  return (
    <div className="space-y-6">
      <div id="sidebar-order" className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm sticky top-24">
        <div className="mb-4">
          <span className="text-xs text-[#6b7280] block">À partir de</span>
          <span className="text-2xl font-bold text-[#a55b46]">
            {service.priceAmount ?? service.price}
          </span>
        </div>
        {service.options.length > 0 && (
          <>
            <h3 className="font-semibold text-[#1a1a1a] mb-3">Personnaliser le service</h3>
            <div className="space-y-2 mb-4">
              {service.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-2 border-b border-black/5 last:border-0"
                >
                  <span className="text-[#1a1a1a]">{opt.name}</span>
                  <span className="text-[#a55b46] font-medium">{opt.price}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="pt-4 border-t border-black/5 flex justify-between items-center mb-4">
          <span className="text-[#6b7280]">Total</span>
          <span className="text-xl font-bold text-[#a55b46]">
            {service.priceAmount ?? service.price}
          </span>
        </div>
        <Button
          asChild
          className="w-full bg-[#e1c593] text-[#091626] hover:bg-[#f0ddb8] font-semibold rounded-xl py-6 mb-3"
        >
          <Link href="#">Commander maintenant</Link>
        </Button>
        <Button
          variant="outline"
          className="w-full border-2 border-[#a55b46] text-[#a55b46] hover:bg-[#a55b46]/10 rounded-xl py-5 mb-2"
          asChild
        >
          <Link href="#">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contacter le vendeur
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full border border-black/10 text-[#6b7280] hover:bg-black/5 rounded-xl py-5"
        >
          <Heart className="w-4 h-4 mr-2" />
          Ajouter aux favoris
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
        <p className="text-xs text-[#6b7280] mb-4">Service proposé par</p>
        <Image
          src={service.providerImage}
          alt={service.providerName}
          width={80}
          height={80}
          className="rounded-full object-cover border-2 border-[#e1c593] mb-3"
        />
        <h4 className="font-semibold text-[#1a1a1a] text-lg">{service.providerName}</h4>
        <p className="text-[#a55b46] text-sm font-medium">{service.providerRole}</p>
        <p className="text-[#6b7280] text-sm">{service.providerCompany}</p>
        <div className="flex gap-4 mt-4 text-sm">
          <div>
            <span className="block font-bold text-[#a55b46]">{service.rating}</span>
            <span className="text-[#6b7280]">Note</span>
          </div>
          <div>
            <span className="block font-bold text-[#a55b46]">{service.reviewsCount}</span>
            <span className="text-[#6b7280]">Avis</span>
          </div>
        </div>
        <span className="inline-block mt-4 text-sm font-medium text-[#66a381] bg-[#66a381]/10 px-3 py-1.5 rounded-lg">
          ✓ Membre Business Club M
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
        <h3 className="font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
          <span>🎯</span> Client idéal
        </h3>
        <p className="text-[#6b7280] text-sm leading-relaxed">{service.clientIdeal}</p>
      </div>
    </div>
  );
};

export default BlockDetailSidebar;
