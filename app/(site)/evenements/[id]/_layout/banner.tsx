"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const scrollToPricing = () => {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
};

const scrollToChoice = () => {
  document.getElementById("choice")?.scrollIntoView({ behavior: "smooth" });
};

const Banner = () => {
  return (
    <div className="banner-devenir-membre relative z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-40"></div>
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        <Image src="/images/banner-event.jpg" alt="devenir membre" width={100} height={100} layout="responsive" className="w-[100%!important] h-[100%!important] object-cover" />
      </div>
      <div className="content-banner min-h-[90vh] md:min-h-[60vh] lg:min-h-[95vh] flex flex-col justify-center items-center py-12 md:py-16 lg:py-[100px]">
        <div className="container mt-auto px-4 mx-auto">
          <div className="grid grid-cols-12 gap-4 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-6">
            <div className="flex md:items-center flex-col md:flex-row lg:gap-6 gap-3 mb-2">
              <div>
                <div className="badge border border-white/60 text-white md:px-4 md:py-2 px-2 py-1 rounded-full inline-flex items-center gap-1 text-sm md:text-base">
                  <div className="w-3 h-3 bg-[#e1c593] rounded-full ">
                  </div>
                  Lunch
                </div>
              </div>
                <div className="date text-white md:text-base text-sm">26 Mars 2026</div>
              </div>
              <h1 className="text-4xl lg:text-[68px] font-medium text-white mb-3 tracking-[-0.02em]">
              Businesswomen Lunch
              </h1>
              <p className="text-white lg:text-xl mb-6 lg:mb-6 max-w-[600px]">
              L&apos;événement où les femmes entrepreneures se connectent, apprennent et créent des opportunités de business.

              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={scrollToPricing} className="bg-[#a55b46] px-5 md:px-6 text-white h-12 md:h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg">
                Réserve ta place
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
