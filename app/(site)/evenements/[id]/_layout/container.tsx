"use client";
import BlockAllEvents from "./blockInfovents";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import ModalInscription from "@/components/features/modalInscription/modalInscription";
import Banner from "./banner"

const Container = () => {
  return (
    <AppContainerWebSite>
      <Banner/>
      <BlockAllEvents />
      <ModalInscription />
    </AppContainerWebSite>
  );
};

export default Container;
