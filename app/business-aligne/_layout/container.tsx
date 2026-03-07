import React from "react";
import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";
import Banner from "./banner";
import BlockAccompagn from "./blockAccompagn";
import BlockFaq from "./blockFaq";
import BlockCta from "./blockCta";
import BlockStep from "./blockStep";
import BlockDescrip from "./blockDescrip";
import BlockTestimonial from "./blockTestimonial";
import BlockLuch from "./blockLuch";
import BlockPrice from "./blockPrice";

const SECTION_IDS = ["BA__S01", "BA__S02", "BA__S03", "BA__S04", "BA__S05", "BA__S06", "BA__S07", "BA__S08", "BA__S09"] as const;

const Container = () => {
  return (
    <AppContainerWebSite>
      <section id={SECTION_IDS[0]}><Banner /></section>
      <section id={SECTION_IDS[1]}><BlockDescrip /></section>
      <section id={SECTION_IDS[2]}><BlockAccompagn /></section>
      <section id={SECTION_IDS[3]}><BlockStep /></section>
      <section id={SECTION_IDS[4]}><BlockTestimonial /></section>
      <section id={SECTION_IDS[5]}><BlockLuch /></section>
      <section id={SECTION_IDS[6]}><BlockPrice /></section>
      <section id={SECTION_IDS[7]}><BlockFaq /></section>
      <section id={SECTION_IDS[8]}><div id="commencer"><BlockCta /></div></section>
    </AppContainerWebSite>
  );
};

export default Container;
