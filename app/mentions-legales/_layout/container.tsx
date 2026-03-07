import React from "react";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockMentionsHero from "./blockMentionsHero";
import BlockMentionsContent from "./blockMentionsContent";

const Container = () => {
  return (
    <AppContainerWebSite>
      <BlockMentionsHero />
      <section id="MENTIONS__S01"><BlockMentionsContent /></section>
    </AppContainerWebSite>
  );
};

export default Container;
