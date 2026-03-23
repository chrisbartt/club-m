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

const Container = () => {
  return (
    <AppContainerWebSite>
      <Banner />
      <BlockStep />
      <BlockAbout />
      <BlockCommunaute />
      <BlockIntroMembre />
      <BlockChiffre />
      <BlockFaq />
      <BlockBlog />
    </AppContainerWebSite>
  );
};

export default Container;
