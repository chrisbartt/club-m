"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const AVATARS = [
  { src: "/images/avatar-1.jpg", alt: "Ornella" },
  { src: "/images/avatar-2.jpg", alt: "Nadine" },
  { src: "/images/avatar-3.jpg", alt: "Chantal" },
  { src: "/images/avatar-4.jpg", alt: "Michelle" },
  { src: "/images/avatar-5.jpg", alt: "Maurelle" },
  { src: "/images/avatar-6.jpg", alt: "Maurelle" },
  
];

const MARQUEE_DURATION = 50;

function AvatarSlide() {
  return (
    <div className="overflow-hidden w-full">
      <style>{`
        @keyframes avatar-marquee-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .avatar-marquee-track {
          animation: avatar-marquee-x ${MARQUEE_DURATION}s linear infinite;
        }
      `}</style>
      <div className="flex -space-x-3 avatar-marquee-track w-max">
        {[...AVATARS, ...AVATARS].map((avatar, i) => (
          <div
            key={i}
            className="relative md:w-12 w-10 md:h-12 h-10 shrink-0 rounded-full overflow-hidden border-2 border-white"
          >
            <Image
              src={avatar.src}
              alt={avatar.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const Banner = () => {
  return (
    <div className="banner relative z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-30"></div>
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        <video
          src="/videos/5.mp4"
          autoPlay
          playsInline
          loop
          muted
          className="w-[100%!important] h-[100%!important] object-cover hidden"
        ></video>
        <Image src="/images/bannerHome.jpg" alt="devenir membre" width={100} height={100} layout="responsive" className="w-[100%!important] h-[100%!important] object-cover object-top" />
      </div>
      <div className="content-banner min-h-[100vh] flex flex-col justify-center items-center py-14 lg:py-[100px]">
        <div className="container mt-auto px-4">
          <div className="grid grid-cols-12 gap-5 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-7">
              <h1 className="text-4xl lg:text-[64px] 2xl:text-[68px] font-medium text-white mb-3 tracking-[-0.02em]">
              Tu n’es plus seule, <br /> Tu avances avec méthode.

              </h1>
              <p className="text-white lg:text-xl mb-6 lg:mb-6 max-w-[500px]">
              Le Club M t’aide à transformer ton business en entreprise structurée, rentable et crédible.

              </p>
            
              <div className="flex sm:flex-row gap-3">
                <Button
                  className="bg-[#a55b46] text-white h-14 px-5 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                  asChild
                >
                  <Link href="/devenir-membre">
                  Rejoins-nous
                  </Link>
                </Button>
               
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="flex md:justify-end">
              <div className="flex lg:gap-6 gap-4 flex-col  p-4 bg-[#0916262e] backdrop-blur-[50px] rounded-2xl md:max-w-[250px] max-w-[250px]">
                <AvatarSlide />
                <span className="text-white text-sm lg:text-base font-medium">
                + de 90 membres 
                </span>
              </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
