"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const scrollToPricing = () => {
  document.getElementById("EVENTS__S02")?.scrollIntoView({ behavior: "smooth" });
};

const scrollToChoice = () => {
  document.getElementById("EVENTS__S02")?.scrollIntoView({ behavior: "smooth" });
};

const Banner = () => {
  return (
    <div className="banner-devenir-membre relative z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-40"></div>
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        {/* <video
          src="/videos/4.mp4"
          autoPlay
          playsInline
          loop
          muted
          className="w-[100%!important] h-[100%!important] object-cover"
        ></video> */}
        <Image src="/images/banner-event.jpg" alt="devenir membre" width={100} height={100} layout="responsive" className="w-[100%!important] h-[100%!important] object-cover" />
      </div>
      <div className="content-banner min-h-[90vh] md:min-h-[60vh] lg:min-h-[95vh] flex flex-col justify-center items-center py-12 md:py-16 lg:py-[100px]">
        <div className="container mt-auto px-4 mx-auto">
          <div className="grid grid-cols-12 gap-4 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-6">
              <h1 className="text-4xl lg:text-[68px] font-medium text-white mb-3 tracking-[-0.02em]">
              Des rencontres qui font avancer ton business.
              </h1>
              <p className="text-white lg:text-xl mb-6 lg:mb-6 max-w-[600px]">
              Les événements du Club M réunissent des femmes entrepreneures ambitieuses pour apprendre, créer des connexions et transformer chaque rencontre en opportunité.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={scrollToPricing} className="bg-[#a55b46] px-5 md:px-6 text-white h-12 md:h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl">
                Découvre nos événements.
                </Button>
                <Button
                  className="bg-white text-black h-14 px-5 hover:bg-white/80 hover:text-black cursor-pointer transition-all duration-300 rounded-xl"
                  asChild
                >
                  <Link href="/devenir-membre">
                  Rejoins Le Club M
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
