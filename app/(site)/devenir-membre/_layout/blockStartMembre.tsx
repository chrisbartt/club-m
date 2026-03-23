"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const scrollToPricing = () => {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
};

const BlockStartMembre = () => {
  return (
    <div className="block-start-membre lg:py-[100px] py-[50px] relative z-10 bg-[#581621]">
      <div
        className="absolute inset-0 pointer-events-none opacity-20 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-center text-white mb-4">
            Prête à rejoindre le Club M ?
          </h2>
          <p className="mb-6 lg:text-[18px] text-[16px] text-white max-w-xl mx-auto">
            Tu veux construire un business à la hauteur de ton ambition, <br />{" "}
            le Club M est fait pour toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={scrollToPricing}
              className="bg-[#a55b46] text-white h-14 px-5  hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl  gap-2"
            >
              Rejoindre le club
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockStartMembre;
