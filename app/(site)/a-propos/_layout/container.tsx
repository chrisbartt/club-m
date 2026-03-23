'use client'
import Banner from "./banner";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAbout from "./blockAbout";
import BlockVisionMission from "./blockVisionMission";
import BlockRaison from "./blockRaison";
import BlockStartMembre from "./blockStartMembre";
import BlockTestimonial from "./blockTemoignage";
import DrawerFondatrice from "./drawerFondatrice";

const Container = () => {
  return (
    <AppContainerWebSite>
      <Banner />
      <BlockAbout />
      <BlockVisionMission />
      <BlockRaison />
      <BlockTestimonial />
      <BlockStartMembre />
      <DrawerFondatrice />
    </AppContainerWebSite>
  );
};

export default Container;
