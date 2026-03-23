import { Check, Network, TrendingUp, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlockVisionMission = () => {
  return (
    <div
      id="comment-ca-marche"
      className="block-difference lg:py-[100px] py-[50px] bg-[#a55b46] relative z-20 lg:pb-[170px]"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden 2xl:block"></div>
          <div className="col-span-12 2xl:col-span-10">
            <div className="grid grid-cols-12 lg:gap-10 gap-4 ">
              <div className="col-span-12 md:col-span-6">
                <h3 className="text-sm lg:text-base uppercase font-semibold text-[#ffffff] mb-3 relative inline-block pb-3">
                  Notre mission
                  <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#ffffff]"></span>
                </h3>
                <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold  text-[#ffffff] tracking-[-0.02em] md:mb-6">
                  Au Club M, notre mission est simple :
                </h2>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <div className="card bg-white lg:p-5 rounded-2xl h-full">
                      <div className="icon mb-2">
                        <Network className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                      </div>
                      <h3 className="text-xl lg:text-xl font-semibold text-[#091626] relative inline-block">
                        Connecter les femmes entrepreneures à un réseau
                        stratégique.
                      </h3>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="card bg-white lg:p-5 rounded-2xl h-full">
                      <div className="icon mb-2">
                        <Wrench className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                      </div>
                      <h3 className="text-xl lg:text-xl font-semibold text-[#091626] relative inline-block">
                        Les équiper d’outils et de ressources concrètes.
                      </h3>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="card bg-white lg:p-5 rounded-2xl h-full">
                      <div className="icon mb-2">
                        <TrendingUp className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                      </div>
                      <h3 className="text-xl lg:text-xl font-semibold text-[#091626] relative inline-block">
                        Impacter leurs projets pour les aider à construire un
                        business solide et rentable.
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="card bg-white lg:p-8 rounded-2xl h-full lg:w-[80%] mx-auto">
                  <h3 className="text-2xl lg:text-2xl font-semibold text-[#091626] mb-4 relative inline-block">
                    Rejoindre le Club M, c’est accéder à un écosystème qui
                    soutient ton évolution entrepreneuriale.
                  </h3>
                  <ul className="flex flex-col gap-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm lg:text-base">
                        Un réseau d’entrepreneures
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm lg:text-base">
                        Un annuaire de membres pour créer des connexions
                        stratégiques et développer ton réseau
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm lg:text-base">
                        Un espace d’échange privé
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm lg:text-base">
                        Un groupe où tu peux poser tes questions, partager tes
                        avancées et recevoir du soutien.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm lg:text-base">
                        Des ressources exclusives
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm lg:text-base">
                        Une newsletter mensuelle avec des opportunités, des
                        conseils et des outils pour ton business.
                      </span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-[#151516] text-[#ffffff]  h-14 hover:bg-[#a55b46] hover:text-[#ffffff] transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <Link href="/devenir-membre">Rejoins le Club M</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden 2xl:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockVisionMission;
