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
import { useEffect, useState } from "react";


const AUTOPLAY_DELAY_MS = 5000;



const BlockTeam = () => {
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
    <div className="block-difference lg:py-[100px] py-[50px] bg-white relative z-10">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center lg:max-w-xl mx-auto lg:mb-14">
          <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
            Notre équipe
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
          </h3>
          <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-center text-[#091626] mb-2 lg:mb-4">
            Une équipe engagée
          </h2>
          <p className="mb-6 md:mb-6 lg:text-[18px] text-[16px] text-muted-foreground">
            Des talents passionnés qui accompagnent votre réussite au quotidien
          </p>
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
                <CarouselItem
                 
                  className="basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                >
                  <div className="card relative rounded-2xl overflow-hidden">
                    <div className="relative lg:h-[470px] h-[200px] w-full mx-auto rounded-2xl overflow-hidden">
                      <Image
                        src={"/images/maurelle.jpeg"}
                        alt={"Maurel"}
                        fill
                        className="object-cover"
                      />
                      
                    </div>

                    <div className="p-4 lg:p-6 absolute bottom-0 left-0 right-0 bg-linear-to-b from-transparent to-black/90">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-col gap-1  text-white">
                            <h6 className="text-white font-semibold text-sm lg:text-2xl">
                              Maurelle Kitebi
                            </h6>
                            <div>
                              <span className=" text-[#ffffff] text-sm inline-flex">
                                Fondatrice
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem
                 
                  className="basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                >
                  <div className="card relative rounded-2xl overflow-hidden">
                    <div className="relative lg:h-[470px] h-[200px] w-full mx-auto rounded-2xl overflow-hidden">
                      <Image
                        src={"/images/ornella.jpeg"}
                        alt={"Ornella"}
                        fill
                        className="object-cover"
                      />
                      
                    </div>

                    <div className="p-4 lg:p-6 absolute bottom-0 left-0 right-0 bg-linear-to-b from-transparent to-black/90">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-col gap-1  text-white">
                            <h6 className="text-white font-semibold text-sm lg:text-2xl">
                              Ornella K.
                            </h6>
                            <div>
                              <span className=" text-[#ffffff] text-sm inline-flex">
                                Formation & ateliers
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem
                 
                  className="basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                >
                  <div className="card relative rounded-2xl overflow-hidden">
                    <div className="relative lg:h-[470px] h-[200px] w-full mx-auto rounded-2xl overflow-hidden">
                      <Image
                        src={"/images/chantal.jpeg"}
                        alt={"Chantal"}
                        fill
                        className="object-cover"
                      />
                      
                    </div>

                    <div className="p-4 lg:p-6 absolute bottom-0 left-0 right-0 bg-linear-to-b from-transparent to-black/90">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-col gap-1  text-white">
                            <h6 className="text-white font-semibold text-sm lg:text-2xl">
                              Chantal M.
                            </h6>
                            <div>
                              <span className=" text-[#ffffff] text-sm inline-flex">
                                Juridique & administratif
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem
                 
                  className="basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                >
                  <div className="card relative rounded-2xl overflow-hidden">
                    <div className="relative lg:h-[470px] h-[200px] w-full mx-auto rounded-2xl overflow-hidden">
                      <Image
                        src={"/images/emmanuela.jpeg"}
                        alt={"Emmanuela"}
                        fill
                        className="object-cover"
                      />
                      
                    </div>

                    <div className="p-4 lg:p-6 absolute bottom-0 left-0 right-0 bg-linear-to-b from-transparent to-black/90">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-col gap-1  text-white">
                            <h6 className="text-white font-semibold text-sm lg:text-2xl">
                              Emmanuela K.
                            </h6>
                            <div>
                              <span className=" text-[#ffffff] text-sm inline-flex">
                                Marketing & communication
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem
                 
                  className="basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                >
                  <div className="card relative rounded-2xl overflow-hidden">
                    <div className="relative lg:h-[470px] h-[200px] w-full mx-auto rounded-2xl overflow-hidden">
                      <Image
                        src={"/images/michelle.jpeg"}
                        alt={"Michelle"}
                        fill
                        className="object-cover"
                      />
                      
                    </div>

                    <div className="p-4 lg:p-6 absolute bottom-0 left-0 right-0 bg-linear-to-b from-transparent to-black/90">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-col gap-1  text-white">
                            <h6 className="text-white font-semibold text-sm lg:text-2xl">
                              Michelle T.
                            </h6>
                            <div>
                              <span className=" text-[#ffffff] text-sm inline-flex">
                                Digital & tech
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="bg-[#091626] text-white hover:bg-[#091626]/80 hover:text-white border-0 lg:w-10 lg:h-10 cursor-pointer" />
              <CarouselNext className="bg-[#091626] text-white hover:bg-[#091626]/80 hover:text-white border-0 lg:w-10 lg:h-10 cursor-pointer" />
            </Carousel>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default BlockTeam;
