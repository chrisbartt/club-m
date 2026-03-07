import React from "react";
import Banner from "./banner";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAbout from "./blockAbout";
import BlockVisionMission from "./blockVisionMission";
import BlockRaison from "./blockRaison";
import BlockApproche from "./blockApproche";
import BlockTeam from "./blockTeam";
import BlockPartenaire from "./blockPartenaire";
import BlockStartMembre from "./blockStartMembre";

const SECTION_IDS = ["ABOUT__S01", "ABOUT__S02", "ABOUT__S03", "ABOUT__S04", "ABOUT__S05"] as const;

const Container = () => {
  return (
    <AppContainerWebSite>
      <section id={SECTION_IDS[0]}><Banner /></section>
      <section id={SECTION_IDS[1]}><BlockAbout /></section>
      <section id={SECTION_IDS[2]}><BlockVisionMission /></section>
      <section id={SECTION_IDS[3]}><BlockRaison /></section>
      <section id={SECTION_IDS[4]}><BlockApproche /></section>
      <BlockTeam />
      <BlockPartenaire />
      <BlockStartMembre />
    </AppContainerWebSite>
  );
};

export default Container;
