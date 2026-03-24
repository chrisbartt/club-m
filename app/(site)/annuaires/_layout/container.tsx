import React from "react";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAnnuaireGrid from "./blockAnnuaireGrid";
import Banner from "./banner";
import BlockStartMembre from "./blockStartMembre";
import type { PublicProfileListItem } from "@/domains/directory/types";

interface ContainerProps {
  profiles?: PublicProfileListItem[];
}

const Container = ({ profiles }: ContainerProps) => {
  return (
    <AppContainerWebSite>
      <Banner />
      <section id="ANNUAIRE__S02"><BlockAnnuaireGrid profiles={profiles} /></section>
      <BlockStartMembre/>
    </AppContainerWebSite>
  );
};

export default Container;
