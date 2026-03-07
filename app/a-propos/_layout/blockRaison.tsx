import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BlockRaison = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
            <div className="lg:pl-26">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Pourquoi
                <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
                Pourquoi Club M ?
              </h4>
              <div>
                <p className="text-muted-foreground md:mb-8 lg:text-[18px] text-[16px]">
                  En RDC, les femmes représentent une part importante des
                  entrepreneurs mais font face à des défis majeurs qui freinent
                  leur développement.
                </p>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-12 md:gap-4 gap-2 mb-8">
                  {/* Card 1: Networking ciblé */}
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <X className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        Manque de structuration des activités économiques
                      </h5>
                    </div>
                  </div>

                  {/* Card 2: Échanges d'expériences */}
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <X className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        Difficulté d&apos;accès au financement bancaire
                      </h5>
                    </div>
                  </div>

                  {/* Card 4: Cadre convivial */}
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <X className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        Informalité et absence de documentation business
                      </h5>
                    </div>
                  </div>
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <X className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        Isolement et manque de réseau professionnel
                      </h5>
                    </div>
                  </div>
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <X className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        Peu d&apos;accompagnement adapté à leurs besoins
                      </h5>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="card border border-dashed p-3 rounded-xl mt-2 flex md:gap-4 gap-3">
                      <div>
                        <div className="flex items-center mb-1 gap-1">
                          <h6 className="text-base md:text-xl font-medium text-[#091626]">
                            Club M est né pour répondre à ces défis
                          </h6>
                        </div>
                        <p className="text-sm lg:text-base text-[#091626]">
                          En combinant accompagnement personnalisé, outils
                          digitaux innovants et force de la communauté, nous
                          créons les conditions du succès pour chaque
                          entrepreneure.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                  <Button
                    className="bg-[#a55b46] text-white h-14 px-5 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <Link href="/devenir-membre/">
                      Rejoindre le Club
                    </Link>
                  </Button>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="card-img w-full relative mx-auto lg:w-[80%] md:min-h-[500px] min-h-[350px] h-full z-10">
              <div className="absolute right-[-5%] w-[80%] h-[110%] bg-[#f8f8f8] -z-10 top-1/2 -translate-y-1/2 rounded-2xl"></div>
              <div className="md:min-h-[500px] min-h-[350px] h-full relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/banner14.jpg"
                  alt="Femmes entrepreneures accompagnées par Club M"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockRaison;
