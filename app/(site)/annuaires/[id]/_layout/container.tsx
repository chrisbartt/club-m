"use client";

import React from "react";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import type { ServiceDetail } from "../../_layout/annuaireData";
import type { ProfileWithProducts } from "@/domains/directory/types";
import type { PublicProfileListItem } from "@/domains/directory/types";
import BlockDetailHero from "./blockDetailHero";
import BlockDetailMain from "./blockDetailMain";
import BlockDetailSidebar from "./blockDetailSidebar";
import BlockDetailRelated from "./blockDetailRelated";
import { getOtherServicesByProvider, getRelatedServices } from "../../_layout/annuaireData";
import BlockDetailMembre from "./blockDetailMembre";
import BlockAnnuaire from "./blockAnnuaire";

interface ContainerProps {
  service?: ServiceDetail;
  profile?: ProfileWithProducts;
  otherProfiles?: PublicProfileListItem[];
}

const Container = ({ service, profile, otherProfiles }: ContainerProps) => {
  // Build a unified service object for components that still use ServiceDetail
  const effectiveService: ServiceDetail | undefined = service
    ? service
    : profile
      ? {
          id: profile.id,
          title: profile.businessName,
          category: profile.category,
          providerName: `${profile.member.firstName} ${profile.member.lastName}`,
          providerImage: profile.member.avatar || "/images/default-avatar.png",
          providerRole: profile.category,
          providerCompany: profile.businessName,
          providerLocation: profile.address || "RDC",
          rating: 0,
          reviewsCount: 0,
          price: "Voir le profil",
          image: profile.coverImage || "/images/banner4.jpg",
          description: profile.description,
          includes: [],
          process: [],
          clientIdeal: "",
          options: [],
          reviews: [],
          gallery: profile.images?.map((url, i) => ({ url, label: `Image ${i + 1}` })) || [],
        }
      : undefined;

  if (!effectiveService) return null;

  const otherByProvider = service
    ? getOtherServicesByProvider(service.providerName, service.id)
    : [];
  const related = service
    ? getRelatedServices(service.category, service.id, 3)
    : [];

  return (
    <AppContainerWebSite>
      <BlockDetailHero service={effectiveService} profile={profile} />
      <BlockDetailMembre profile={profile} />
      <BlockAnnuaire profiles={otherProfiles} />
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-12 lg:pb-[250px] bg-white hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">
          <BlockDetailMain service={effectiveService} />
          <aside className="lg:order-none order-first">
            <BlockDetailSidebar service={effectiveService} />
          </aside>
        </div>
      </div>
      <div className="hidden">
      <BlockDetailRelated
        otherByProvider={otherByProvider}
        related={related}
        currentId={effectiveService.id}
      />
      </div>
    </AppContainerWebSite>
  );
};

export default Container;
