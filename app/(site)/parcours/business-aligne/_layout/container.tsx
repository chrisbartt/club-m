import React from "react";
import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";
import Banner from "./banner";
import BlockCommentCaMarche from "./blockCommentCaMarche";
import BlockTemoignage from "./blockTemoignage";
import BlockFaq from "./blockFaq";
import BlockCta from "./blockCta";

const Container = () => {
  return (
    <AppContainerWebSite>
      <Banner />
      <div id="comment-ca-marche">
        <BlockCommentCaMarche />
      </div>
      <BlockTemoignage />
      <BlockFaq />
      <div id="commencer">
        <BlockCta />
      </div>
    </AppContainerWebSite>
  );
};

export default Container;
