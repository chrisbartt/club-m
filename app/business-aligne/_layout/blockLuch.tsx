import { FileText, Brain, Handshake } from "lucide-react";
import Image from "next/image";

const BlockLuch = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
            <div className="lg:pl-26">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Accompagnement
                <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
                Idée sans structure, Activité sans cadre, Besoin de financement.
              </h4>
              <div>
                <p className="text-muted-foreground md:mb-8 lg:text-[18px] text-[16px]">
                  Fondatrice de Club M, Maurelle accompagne les femmes
                  entrepreneures en RDC depuis 2019. Business Aligné n&apos;est pas
                  un programme automatisé, c&apos;est une session individuelle,
                  humaine, avec quelqu&apos;un qui comprend ton contexte.
                </p>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-12 md:gap-4 gap-2 mb-8">
                  {/* Card 1: Networking ciblé */}
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <Brain className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        Approche bienveillante
                      </h5>
                      <p className="text-sm lg:text-base text-muted-foreground">
                        Pas de jugement. Un regard honnête et constructif sur
                        ton idée.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Échanges d'expériences */}
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <FileText className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        Contexte RDC intégré
                      </h5>
                      <p className="text-sm lg:text-base text-muted-foreground">
                        Les réalités du terrain à Kinshasa, les contraintes
                        locales, les opportunités réelles.
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Cadre convivial */}
                  <div className="flex col-span-12 gap-3">
                    <div className="flex-shrink-0">
                      <Handshake className="md:w-8 md:h-8 w-5 h-5 text-[#a55b46]" />
                    </div>
                    <div>
                      <h5 className="text-base md:text-2xl font-medium text-[#091626] md:mb-2 mb-1">
                        150+ entrepreneures accompagnées
                      </h5>
                      <p className="text-sm lg:text-base text-muted-foreground">
                        Une expérience concrète avec des profils variés du tout
                        début au pivot.
                      </p>
                    </div>
                  </div>
                  <div className="col-span-12">
                  <div className="card border border-dashed p-3 rounded-xl mt-2 flex md:gap-4 gap-3">
                    <div className="img flex-shrink-0 lg:w-18 lg:h-20 w-10 h-10 relative overflow-hidden rounded-lg">
                      <Image src="/images/maurelle.jpeg" alt="maurelle" fill className="object-cover rounded-lg" />
                    </div>
                    <div>
                      <div className="flex items-center mb-1 gap-1">
                        <h6 className="text-base md:text-xl font-medium text-[#091626]">
                          Maurelle Kitebi
                        </h6>
                        <p className="text-muted-foreground text-sm">
                          / Fondatrice
                        </p>
                      </div>
                    <p className="text-sm lg:text-base text-[#091626]">
                    « Mon rôle, ce n&apos;est pas de te dire si ton idée est bonne ou mauvaise. C&apos;est de t&apos;aider à y voir clair toi-même. » 
                    </p>
                    </div>
                  </div>
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
                  src="/images/maurelle.jpeg"
                  alt="devenir membre"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockLuch;
