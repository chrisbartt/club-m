import { FileText, Brain, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const BlockLuch = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6 order-2 lg:order-1">
            <div className="lg:pl-26 h-full flex flex-col justify-center">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Un accompagnement stratégique Une idée ne suffit pas.
                <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-black mb-2 lg:mb-4 tracking-[-0.02em]">
                Sans structure, elle reste un fantasme.
              </h4>
              <div>
                <p className="text-[#091626]/70 md:mb-4 lg:text-[18px] text-[16px]">
                  Business Aligné est l’accompagnement qui transforme ton
                  intuition en projet clair, structuré et rentable en cohérence
                  avec ta vision, ton positionnement et ton marché. .
                </p>
                <p className="text-[#091626]/70 md:mb-8 lg:text-[18px] text-[16px]">
                  Tu passes de l’imagination à l’exécution. Du flou à la
                  stratégie.
                </p>
                <div>
                <Button
                      className="bg-[#a55b46] text-white h-14 px-5 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                      asChild
                    >
                      <Link href="/business-aligne">Découvre Business Aligné
                      </Link>
                    </Button>
                </div>
                {/* Feature Cards Grid */}
                <div className="hidden grid-cols-12 md:gap-4 gap-3 gap-2 mb-8">
                  {/* Card 1: Networking ciblé */}
                  <div className="flex flex-col col-span-12 lg:col-span-6">
                    <div className="md:mb-3 mb-2">
                      <Brain className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-black md:mb-2 mb-1">
                        Diagnostic
                      </h5>
                      <p className="text-sm lg:text-base text-muted-foreground">
                        Identifier tes forces et axes de progression
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Échanges d'expériences */}
                  <div className="flex flex-col col-span-12 lg:col-span-6">
                    <div className="md:mb-3 mb-2">
                      <FileText className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-black md:mb-2 mb-1">
                        Plan d&apos;action
                      </h5>
                      <p className="text-sm lg:text-base text-muted-foreground">
                        Structurer ton projet étape par étape
                      </p>
                    </div>
                  </div>
                  <div className="line-divider col-span-12 h-[1px] bg-[#0000000f] my-3"></div>

                  {/* Card 4: Cadre convivial */}
                  <div className="flex flex-col col-span-12 lg:col-span-6">
                    <div className="md:mb-3 mb-2">
                      <Handshake className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-black md:mb-2 mb-1">
                        Suivi
                      </h5>
                      <p className="text-sm lg:text-base text-muted-foreground">
                        Accompagnement pour tenir le cap
                      </p>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
            <div className="card-img w-full relative mx-auto lg:w-[80%] md:min-h-[500px] min-h-[350px] h-full z-10">
              <div className="absolute right-[-5%] w-[80%] h-[110%] bg-[#f8f8f8] -z-10 top-1/2 -translate-y-1/2 rounded-2xl"></div>
              <div className="md:min-h-[650px] min-h-[350px] h-full relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/img-bus.jpg"
                  alt="devenir membre"
                  fill
                  className="object-cover rotate-y-180"
                />
              </div>
              {/* Badge overlay */}
              <div className="absolute bottom-6 right-6 bg-[#091626] backdrop-blur-sm p-4 rounded-xl flex flex-col gap-3 z-20">
                <h4 className="text-white font-medium text-sm lg:text-3xl">
                  +90
                </h4>
                <p className="text-white font-medium text-sm lg:text-base">
                  Femmes <br /> accompagnées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockLuch;
