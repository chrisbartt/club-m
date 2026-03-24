"use client";

import Banner from "@/app/(site)/_layoutHome/banner";
import BlockStep from "@/app/(site)/_layoutHome/blockStep";
import BlockAbout from "@/app/(site)/_layoutHome/blockAbout";
import BlockCommunaute from "@/app/(site)/_layoutHome/blockCommunaute";
import BlockIntroMembre from "@/app/(site)/_layoutHome/blockIntroMembre";
import BlockChiffre from "@/app/(site)/_layoutHome/blockChiffre";
import BlockFaq from "@/app/(site)/_layoutHome/blockFaq";
import BlockBlog from "@/app/(site)/_layoutHome/blockBlog";

export default function HomePage() {
  return (
    <>
      <Banner />
      <BlockStep />
      <BlockAbout />
      <BlockCommunaute />
      <BlockIntroMembre />
      <BlockChiffre />
      <BlockFaq />
      <BlockBlog />
    </>
  );
}
