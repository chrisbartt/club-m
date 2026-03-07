"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SERVICES_DETAIL } from "@/app/annuaires/_layout/annuaireData";

const AUTOPLAY_DELAY_MS = 5000;

// Dédoublonne par nom de prestataire pour afficher des expertes uniques
const experts = SERVICES_DETAIL.reduce<
  {
    id: string;
    name: string;
    image: string;
    role: string;
    category: string;
    rating: number;
    reviewsCount: number;
  }[]
>((acc, service) => {
  if (acc.some((e) => e.name === service.providerName)) return acc;
  acc.push({
    id: service.id,
    name: service.providerName,
    image: service.providerImage,
    role: service.providerRole,
    category: service.category,
    rating: service.rating,
    reviewsCount: service.reviewsCount,
  });
  return acc;
}, []);

const BlockAnnuaire = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api || isPaused) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_DELAY_MS);
    return () => clearInterval(interval);
  }, [api, isPaused]);

  return (
    <div className="block-difference lg:py-[100px] py-[50px] bg-[#f8f8f8] relative z-10">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center lg:max-w-xl mx-auto lg:mb-14">
          
          <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-center text-[#091626] mb-2 lg:mb-4">
            Autres expertes
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
              setApi={setApi}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <CarouselContent>
                {experts.map((expert) => (
                  <CarouselItem
                    key={expert.id}
                    className="basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                  >
                    <Link href={`/annuaires/${expert.id}`} className="card relative rounded-2xl overflow-hidden block">
                      <div className="relative lg:h-[470px] h-[200px] w-full mx-auto rounded-2xl overflow-hidden">
                        <Image
                          src={expert.image}
                          alt={expert.role}
                          fill
                          className="object-cover"
                        />
                        <div className="flex items-center gap-1 justify-center absolute top-4 right-4 w-[60px] h-[40px] bg-black/50 backdrop-blur-[10px] rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-base text-white font-medium">
                            {expert.rating}
                          </span>
                          
                        </div>
                      </div>

                      <div className="p-4 lg:p-6 absolute bottom-0 left-0 right-0 bg-linear-to-b from-transparent to-black/90">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-col gap-1  text-white">
                              <h6 className="text-white font-semibold text-sm lg:text-2xl">
                                {expert.name}
                              </h6>
                              <div>
                                <span className=" text-[#ffffff] text-sm inline-flex">
                                  {expert.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-[#091626] text-white hover:bg-[#091626]/80 hover:text-white border-0 lg:w-10 lg:h-10 cursor-pointer" />
              <CarouselNext className="bg-[#091626] text-white hover:bg-[#091626]/80 hover:text-white border-0 lg:w-10 lg:h-10 cursor-pointer" />
            </Carousel>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button
            className="bg-[#a55b46] text-white h-14 px-5 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
            asChild
          >
            <Link href="/mentors-expertes">Explorer l&apos;annuaire</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockAnnuaire;
