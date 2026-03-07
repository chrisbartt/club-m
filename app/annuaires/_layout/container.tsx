import React from "react";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAnnuaireHero from "./blockAnnuaireHero";
import BlockAnnuaireFilters from "./blockAnnuaireFilters";
import BlockAnnuaireGrid from "./blockAnnuaireGrid";

const Container = () => {
  return (
    <AppContainerWebSite>
      <section id="ANNUAIRE__S01"><BlockAnnuaireHero /></section>
      <BlockAnnuaireFilters />
      <section id="ANNUAIRE__S02"><BlockAnnuaireGrid /></section>
    </AppContainerWebSite>
  );
};

export default Container;
