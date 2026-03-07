"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TESTIMONIALS } from "@/app/data/testimonialsData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const AUTOPLAY_DELAY_MS = 6000;

const BlockTestimonial = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  // Autoplay : défilement toutes les 6 secondes (pause au survol)
  useEffect(() => {
    if (!api || isPaused) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_DELAY_MS);
    return () => clearInterval(interval);
  }, [api, isPaused]);

  const goTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <div className="block-difference lg:py-[100px] py-[50px] relative z-10 bg-[#f5f5f5]">
      <div className="container px-4 mx-auto relative z-10">
        <div className="relative">
          {/* Header */}
          <div className="text-center lg:max-w-2xl mx-auto mb-10 lg:mb-14">
            <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
              Témoignages
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
            </h3>
            <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-center text-[#091626] mb-2 lg:mb-6">
            Elles l&apos;ont vécu.
            <br />
            Elles le racontent. 
            </h2>
          </div>

          {/* Slider */}
          <Carousel
            opts={{
              align: "start",
              startIndex: 0,
              loop: true,
            }}
            className="w-full lg:w-[70%] mx-auto"
            setApi={setApi}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <CarouselContent className="ml-0">
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.id} className="basis-full pl-0">
                  <div className="card rounded-2xl bg-[#ffffff] h-full overflow-hidden p-4 relative">
                  <span
                            className="absolute top-3 right-3 text-[80px] lg:text-[120px] font-bold leading-none select-none z-2 pointer-events-none"
                            style={{ color: "#a55b46", opacity: 0.3 }}
                          >
                            ”
                          </span>
                  <div className="grid grid-cols-12 lg:gap-8 gap-4 items-center">
                    <div className="col-span-4">
                      {/* Photo */}
                      <div className="flex justify-center lg:block relative">
                        <div
                          className="relative w-[200px] h-[240px] lg:w-[280px] lg:h-[300px] rounded-[20px] overflow-hidden shrink-0"
                          
                        >
                         
                          <Image
                            src={t.image}
                            alt={`${t.name} — Témoignage Club M`}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 1024px) 200px, 280px"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-8">
                      {/* Contenu */}
                      <div className="lg:p-5 text-center lg:text-left">
                        <p
                          className="text-lg lg:text-[18px] text-[#091626] leading-relaxed italic mb-6 lg:mb-8"
                          style={{ fontFamily: "inherit" }}
                        >
                          {t.quote}
                        </p>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
                          <div>
                            <h4 className="text-xl font-semibold text-[#091626]">
                              {t.name}
                            </h4>
                            <p className="text-sm text-[#091626]/50 mt-0.5">
                              {t.role} · {t.location}
                            </p>
                          </div>
                          <span
                            className="hidden items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full w-fit"
                            style={{
                              color: "#a55b46",
                              background: "rgba(165,91,70,0.12)",
                            }}
                          >
                            {t.sector}
                          </span>
                        </div>
                        {/* Impact */}
                        <div className="hidden flex-wrap gap-6 lg:gap-8 mt-6 lg:mt-7 pt-6 border-t border-white/8">
                          {t.impact.map((item, i) => (
                            <div key={i} className="text-left">
                              <div
                                className="text-2xl lg:text-[28px] font-bold leading-none"
                                style={{ color: "#e1c593" }}
                              >
                                {item.number}
                              </div>
                              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex items-center justify-center gap-4 mt-10 lg:mt-12">
              <CarouselPrevious
                className="static translate-y-0 w-12 h-12 rounded-full bg-[#151516]  text-white hover:bg-[#151516]/80 hover:text-white cursor-pointer border-0"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </CarouselPrevious>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    className="w-2.5 h-2.5 cursor-pointer rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#e1c593]/50"
                    style={{
                      background:
                        i === current ? "#a55b46" : "#fff",
                      boxShadow:
                        i === current
                          ? "0 0 12px rgba(225,197,147,0.4)"
                          : "none",
                    }}
                    aria-label={`Témoignage ${i + 1}`}
                  />
                ))}
              </div>
              <CarouselNext
                className="static translate-y-0 w-12 h-12 rounded-full bg-[#151516]  text-white hover:bg-[#151516]/80 hover:text-white cursor-pointer border-0"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </CarouselNext>
            </div>

            <p className="text-center text-sm text-white/30 font-medium mt-4">
              {current + 1} / {TESTIMONIALS.length}
            </p>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default BlockTestimonial;
