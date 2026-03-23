"use client";

import React from "react";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import type { ServiceDetail } from "../../_layout/annuaireData";
import BlockDetailHero from "./blockDetailHero";
import BlockDetailMain from "./blockDetailMain";
import BlockDetailSidebar from "./blockDetailSidebar";
import BlockDetailRelated from "./blockDetailRelated";
import { getOtherServicesByProvider, getRelatedServices } from "../../_layout/annuaireData";
import BlockDetailMembre from "./blockDetailMembre";
import BlockAnnuaire from "./blockAnnuaire";

interface ContainerProps {
  service: ServiceDetail;
}

const Container = ({ service }: ContainerProps) => {
  const otherByProvider = getOtherServicesByProvider(service.providerName, service.id);
  const related = getRelatedServices(service.category, service.id, 3);

  return (
    <AppContainerWebSite>
      <BlockDetailHero service={service} />
      <BlockDetailMembre />
      <BlockAnnuaire />
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-12 lg:pb-[250px] bg-white hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">
          <BlockDetailMain service={service} />
          <aside className="lg:order-none order-first">
            <BlockDetailSidebar service={service} />
          </aside>
        </div>
      </div>
      <div className="hidden">
      <BlockDetailRelated
        otherByProvider={otherByProvider}
        related={related}
        currentId={service.id}
      />
      </div>
    </AppContainerWebSite>
  );
};

export default Container;
