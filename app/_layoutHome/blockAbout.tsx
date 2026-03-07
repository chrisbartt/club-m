"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const PORTRAIT_IMAGES = [
  "/images/img-about-1.jpg",
  "/images/img-about-2.jpg",
  "/images/img-about-3.jpg",
  "/images/img-about-4.jpg",
  "/images/img-about-5.jpg",
  "/images/img-about-6.jpg",
  "/images/img-about-7.jpg",
  "/images/img-about-8.jpg",
  "/images/img-about-9.jpg",
  "/images/img-about-10.jpg",
  "/images/img-about-11.jpg",
  "/images/img-about-12.jpg",
  
];

function ImageBlock({ images }: { images: string[] }) {
  return (
    <>
      {images.map((src, i) => (
        <div
          key={i}
          className="relative rounded-2xl overflow-hidden lg:h-[250px] min-h-[180px] aspect-4/3 lg:aspect-auto"
        >
          <Image
            src={src}
            alt="Membre Club M"
            fill
            className="object-cover object-top"
          />
        </div>
      ))}
    </>
  );
}

function VerticalMarqueeColumn({
  duration = 20000,
  direction = "up",
  images,
}: {
  duration?: number;
  direction?: "up" | "down";
  images: string[];
}) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const imageBlock = <ImageBlock images={images} />;

  useEffect(() => {
    const marquee = marqueeRef.current;
    let animationFrame: number;
    let totalScroll = 0;
    let lastTimestamp: number | null = null;

    function animate(timestamp: number) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (marquee) {
        const distance = marquee.scrollHeight / 2;
        const speed = distance / duration;
        totalScroll += speed * elapsed;
        if (totalScroll >= distance) totalScroll = 0;

        if (direction === "up") {
          marquee.scrollTop = totalScroll;
        } else {
          marquee.scrollTop = distance - totalScroll;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, direction]);

  return (
    <div className="flex flex-col gap-3 md:w-[42%] w-[50%] h-[min(520px,70vh)] overflow-hidden rounded-2xl pointer-events-none">
      <div
        ref={marqueeRef}
        className="flex flex-col gap-3 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex flex-col gap-3 flex-none">{imageBlock}</div>
        <div className="flex flex-col gap-3 flex-none">{imageBlock}</div>
      </div>
    </div>
  );
}

const BlockAbout = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
          <div className="card-img w-full relative mx-auto 2xl:w-[80%] lg:w-[90%] md:min-h-[500px] min-h-[350px] h-full z-10">
              <div className="absolute left-[-5%] w-[80%] h-[110%] bg-[#f8f8f8] -z-10 top-1/2 -translate-y-1/2 rounded-2xl"></div>
              <div className="md:min-h-[650px] min-h-[350px] h-full relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/about.jpg"
                  alt="devenir membre"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge overlay */}
              <div className="absolute bottom-6 left-6 bg-[#151516] backdrop-blur-sm p-4 rounded-xl flex flex-col gap-3 z-20">
                <h4 className="text-white font-medium text-sm lg:text-3xl">
                  +90
                </h4>
                <p className="text-white font-medium text-sm lg:text-base">
                  Femmes membres
                </p>
              </div>
            </div>
            <div className="card-img w-full relative mx-auto lg:w-[90%] md:min-h-[500px] min-h-[350px] h-full z-10 hidden">
              <div className="flex gap-3 justify-center relative">
                <div className="absolute  top-1/2 lg:w-[120px] lg:h-[120px]  -translate-y-1/2 bg-[#091626] text-center rounded-full flex justify-center items-center flex-col gap-2 z-20">
                  <h4 className="text-[#ffffff] font-medium text-sm lg:text-2xl leading-none">
                    +250
                  </h4>
                  <p className="text-white/70 font-medium text-sm leading-none">
                    Femmes membres
                  </p>
                </div>
                <VerticalMarqueeColumn
                  duration={50000}
                  direction="up"
                  images={PORTRAIT_IMAGES.slice(0, 6)}
                />
                <VerticalMarqueeColumn
                  duration={52000}
                  direction="down"
                  images={PORTRAIT_IMAGES.slice(6, 12)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="flex flex-col justify-center h-full 2xl:pr-28 lg:pr-14">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Une communauté au taquet
                <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
                Entreprendre seule, <br /> c&apos;est fini.
              </h4>
              <div className="lg:pr-34">
                <p className="text-[#091626]/70 mb-3 lg:text-[18px] text-[16px]">
                  Ici, tu échanges avec des femmes qui vivent les mêmes réalités
                  que toi. Celles qui jonglent entre job, famille et ambition.
                  Celles qui refusent de rester bloquées.
                </p>
                <p className="text-[#091626]/70 mb-3 lg:text-[18px] text-[16px]">
                  Au Club M, on partage les stratégies. On célèbre les
                  victoires. On affronte les doutes ensemble.
                </p>
                <h6 className="text-[#091626] mb-6 lg:text-[24px] text-[16px] font-medium">
                  Tu avances plus vite. Et surtout, tu avances entourée.
                </h6>

                <Button
                  className="bg-[#a55b46] text-white h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                  asChild
                >
                  <Link href="/a-propos">Découvre la communautéé</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockAbout;
