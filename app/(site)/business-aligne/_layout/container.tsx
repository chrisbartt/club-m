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

const Container = () => {
  return (
    <AppContainerWebSite>
      <Banner />
      <BlockDescrip />
      <BlockAccompagn />
      <BlockStep />
      <BlockTestimonial />
      <BlockLuch />
      <BlockPrice />
      <BlockFaq />
      <div id="commencer"><BlockCta /></div>
    </AppContainerWebSite>
  );
};

export default Container;
