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
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-50"></div>
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        {/* <video
          src="/videos/4.mp4"
          autoPlay
          playsInline
          loop
          muted
          className="w-[100%!important] h-[100%!important] object-cover"
        ></video> */}
        <Image src="/images/img-membre.jpg" alt="devenir membre" width={100} height={100} layout="responsive" className="w-[100%!important] h-[100%!important] object-cover" />
      </div>
      <div className="content-banner min-h-[90vh] md:min-h-[60vh] lg:min-h-[95vh] flex flex-col justify-center items-center py-12 md:py-16 lg:py-[100px]">
        <div className="container mt-auto px-4 mx-auto">
          <div className="grid grid-cols-12 gap-4 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-6">
              <h1 className="text-4xl lg:text-[72px] font-medium text-white mb-3 tracking-[-0.02em]">
              Commence là où tu es. Ensemble, allons là où tu veux aller.
              </h1>
              <p className="text-white lg:text-xl mb-6 lg:mb-6 max-w-[600px]">
              Le Club M est un espace où chaque femme peut trouver sa place : découvrir son potentiel, structurer son business, puis accélérer grâce à un réseau et un accompagnement premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={scrollToPricing} className="bg-[#a55b46] px-5 md:px-6 text-white h-12 md:h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg">
                Découvre les offres du Club M.
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
