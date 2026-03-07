"use client";
import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";
import Banner from "./banner";
import BlockAbout from "./blockAbout";
import BlockBlog from "./blockBlog";
import BlockCommunaute from "./blockCommunaute";
import BlockFaq from "./blockFaq";
import BlockStep from "./blockStep";
import BlockChiffre from "./blockChiffre";
import BlockIntroMembre from "./blockIntroMembre";

const SECTION_IDS = [
  "HOME__S01",
  "HOME__S02",
  "HOME__S03",
  "HOME__S04",
  "HOME__S05",
  "HOME__S06",
  "HOME__S07",
  "HOME__S08",
  "HOME__S09",
  "HOME__S10",
] as const;

const Container = () => {
  return (
    <AppContainerWebSite>
      <section id={SECTION_IDS[0]}><Banner /></section>
      <section id={SECTION_IDS[1]}><BlockStep /></section>
      <section id={SECTION_IDS[2]}><BlockAbout /></section>
      <section id={SECTION_IDS[6]}><BlockCommunaute /></section>
      <section id={SECTION_IDS[7]}><BlockIntroMembre /></section>
      <section id={SECTION_IDS[7]}><BlockChiffre /></section>

      <section id={SECTION_IDS[8]}><BlockFaq /></section>
      <section id={SECTION_IDS[9]}><BlockBlog /></section>
    </AppContainerWebSite>
  );
};

export default Container;
