import React from "react";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAnnuaireGrid from "./blockAnnuaireGrid";
import Banner from "./banner";
import BlockStartMembre from "./blockStartMembre";

const Container = () => {
  return (
    <AppContainerWebSite>
      <Banner />
      <section id="ANNUAIRE__S02"><BlockAnnuaireGrid /></section>
      <BlockStartMembre/>
    </AppContainerWebSite>
  );
};

export default Container;
