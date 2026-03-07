"use client";
import BlockAllEvents from "./blockInfovents";
import BannerEvent from '@/components/features/bannerEvent/bannerEvent';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import ModalInscription from "@/components/features/modalInscription/modalInscription";

const Container = () => {
  return (
    <AppContainerWebSite>
      <BannerEvent video="/videos/3.mp4"/>
      <div className="banner hidden min-h-[40vh] sm:min-h-[50vh] lg:min-h-[70vh] bg-[#091626] relative z-10 flex-col justify-end py-10 md:py-16 lg:py-24">
        <div
          className="absolute inset-0 pointer-events-none opacity-20 -z-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>
      <BlockAllEvents />
      <ModalInscription />
    </AppContainerWebSite>
  );
};

export default Container;
