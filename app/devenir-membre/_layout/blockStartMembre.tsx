"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const scrollToPricing = () => {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
};

const BlockStartMembre = () => {
  return (
    <div className="block-start-membre lg:py-[100px] py-[50px] relative z-10 hidden">
    <div className="card-img absolute w-full top-0 left-0 h-full -z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
      <Image
        src="/images/banner4.jpg"
        alt="Business Aligné"
        fill
        className="object-cover"
      />
    </div>
    <div className="container px-4 mx-auto">
      <div className="text-center lg:max-w-2xl mx-auto">
        <h2 className="text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-center text-white mb-4">
          Prête à clarifier ton idée ?
        </h2>
        <p className="mb-6 lg:text-[18px] text-[16px] text-white max-w-xl mx-auto">
          Rejoins les 150+ femmes qui ont transformé leur vision en projet
          concret grâce au Business Aligné du Club M.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={scrollToPricing}
          className="bg-[#a55b46] text-white h-14 px-5  hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl  gap-2"
        >
          Rejoindre le club
        </Button>
        <Button
          className="bg-white text-black h-14 px-5 hover:bg-white/80 hover:text-black cursor-pointer transition-all duration-300 rounded-xl"
          asChild
        >
          <Link href="/#comment-ca-marche">Parler de ton projet</Link>
        </Button> 
        </div>
      </div>
    </div>
  </div>
  );
};

export default BlockStartMembre;
