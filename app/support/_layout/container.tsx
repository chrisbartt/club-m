import React from "react";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockSupportHero from "./blockSupportHero";
import BlockSupportQuickHelp from "./blockSupportQuickHelp";
import BlockSupportFaq from "./blockSupportFaq";
import BlockSupportContact from "./blockSupportContact";
import BlockSupportCta from "./blockSupportCta";

const Container = () => {
  return (
    <AppContainerWebSite>
      <BlockSupportHero />
      <BlockSupportQuickHelp />
      <BlockSupportFaq />
      <BlockSupportContact />
      <BlockSupportCta />
    </AppContainerWebSite>
  );
};

export default Container;
