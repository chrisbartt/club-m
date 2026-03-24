"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  { src: "/images/cover2.png", alt: "Banner 1" },
  { src: "/images/cover3.png", alt: "Banner 2" },
];

const Banner = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  const goToSlide = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="bannerPage bg-[#091626] relative z-10 ">
      {/* Overlay avec dots blancs */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="content-banner min-h-[180px] md:min-h-[220px] lg:min-h-[30vh] flex flex-col justify-center items-center py-16 pt-[140px] md:py-16 lg:py-[120px] lg:pt-[220px]">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-1"></div>
            <div className="col-span-12 lg:col-span-10">
              <div className="grid grid-cols-12 gap-4 lg:gap-10">
                <div className="col-span-12 lg:col-span-6">
                  <h2 className="text-white text-2xl lg:text-5xl font-semibold mb-2">
                    Optus studio
                  </h2>
                  <p className="text-white text-sm lg:text-lg">
                    Agence de publicité et de marketing.
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <Carousel setApi={setApi}>
                    <CarouselContent>
                      {SLIDES.map((slide) => (
                        <CarouselItem key={slide.src}>
                          <div className="card-img relative w-full h-[300px] lg:h-[420px] rounded-2xl overflow-hidden">
                            <Image
                              src={slide.src}
                              alt={slide.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-[20px] cursor-pointer" />
                    <CarouselNext className="right-[20px] cursor-pointer" />
                    <div className="flex justify-center mt-5">
                      <div className="flex gap-3">
                        {SLIDES.map((slide, index) => (
                          <button
                            key={slide.src}
                            type="button"
                            onClick={() => goToSlide(index)}
                            className="view-slider relative w-[80px] h-[50px] rounded-lg cursor-pointer flex items-center justify-center transition-opacity hover:opacity-90"
                            aria-label={`Voir slide ${index + 1}`}
                          >
                            <div className={`absolute border border-[#a55b46] rounded-lg inset-[-3px] z-10 ${current === index ? "opacity-100" : "opacity-0"}`}></div>
                            <Image
                              src={slide.src}
                              alt={slide.alt}
                              fill
                              className="object-cover rounded-md"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </Carousel>
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <div className="card bg-white p-4 lg:p-8 rounded-2xl">
                    <Link href="/annuaires/1" className="flex items-center gap-3 mb-3">
                      <div className="avatar md:w-[70px] md:h-[70px] w-[80px] h-[80px] relative mb-3 flex-shrink-0">
                        <div className="icon-badge absolute z-10 -right-1 bottom-2 border-2 border-[#ffffff] h-[24px] w-[24px] bg-[#a55b46] rounded-full flex items-center justify-center">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                        <Image
                          src={
                            "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg"
                          }
                          fill
                          className="object-cover rounded-full"
                          alt="Membre Business Club M"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl text-[#091626] font-semibold">
                          Maurelle Kitebi
                        </h2>
                        <p className="text-muted-foreground text-sm mb-1">
                          Membre Business
                        </p>
                        <div className="badge inline-flex justify-center items-center bg-[#a55b46]/10 text-xs text-[#a55b46] rounded-full px-2 py-1">
                          Certifié par Club M
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="w-4 h-4 text-muted-foreground " />
                        <p className="text-[#091626] text-sm font-medium">
                          Optus studio
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground " />
                        <p className="text-[#091626] text-sm font-medium">
                          Agence de publicité et de marketing.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground " />
                        <p className="text-[#091626] text-sm font-medium">
                          Kinshasa, RDC
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground " />
                        <p className="text-[#091626] text-sm font-medium">
                          24h/24h
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground " />
                        <p className="text-[#091626] text-sm font-medium">
                          +237 6 99 99 99 99
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground " />
                        <p className="text-[#091626] text-sm font-medium">
                          info@businessclubm.com
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground " />
                        <p className="text-[#091626] text-sm font-medium">
                          https://www.google.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <p className="text-muted-foreground text-sm ">
                          A partir de
                        </p>
                        <h5 className="text-[#091626] text-xl font-semibold">
                          200 USD
                        </h5>
                      </div>
                      <Button className="flex-1 bg-[#091626] hover:bg-[#091626]/90 cursor-pointer text-white shadow-none h-12 rounded-xl ">
                        <svg
                          width="34"
                          height="34"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                        </svg>
                        <span className="text-white text-sm font-medium">
                          Ecrire à Maurelle
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
