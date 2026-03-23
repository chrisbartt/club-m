import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDrawer } from "@/context/drawer-context";


const BlockRaison = () => {
  const { openDrawer } = useDrawer();
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-white relative z-20">
      <div className="container px-4 mx-auto">
        <div className="lg:w-[70%] bg-white mx-auto p-2 rounded-2xl lg:mb-34 lg:mt-[-200px] shadow-[0_10px_64px_#0000000a]">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-3">
              <div className="relative h-[240px] lg:h-[250px] rounded-xl overflow-hidden shrink-0">
                <Image
                  src="/images/morelle-min.jpg"
                  alt={"Morelle"}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="col-span-9">
              <div className="lg:p-6">
                <h5 className="text-[#151516] mb-2 lg:text-[24px] text-[16px] font-medium">
                Le mot de la fondatrice
                </h5>
                <p className="text-muted-foreground mb-3 lg:text-[18px] text-[16px]">
                  Je suis Maurelle Kitebi Loambo. Business consultant, entrepreneure depuis plus de 15 ans et titulaire d’un MBA. Mais au-delà des titres, je suis aussi épouse, mère de trois enfants et salariée dans une entreprise publique.
                </p>
                <Button
                  className="text-[#a55b46] !p-0 !h-auto bg-transparent hover:text-[#a55b46] hover:bg-transparent cursor-pointer md:text-base font-medium" onClick={() => openDrawer("DrawerFondatrice")}
                 
                >
                  Lire plus <ArrowRight/>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
            <div className="lg:pl-20 flex flex-col h-full justify-center">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Pourquoi ce club existe ?
                <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[44px] leading-[1.2] font-semibold text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
                Trop de femmes entrepreneures brillantes restent bloquées à un
                stade
              </h4>
              <ul className="flex flex-wrap gap-3 mb-4">
                <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                  <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  Elles ont un side hustle qui stagne
                </li>
                <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                  <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  Elles ont peu de clients
                </li>
                <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                  <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  Elles avancent sans méthode
                </li>
                <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                  <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  Elles se sentent seules dans leur parcours
                </li>
              </ul>
              <div className="mb-4">
                <h6 className="text-[#091626] mb-3 text-xl md:text-xl lg:text-2xl font-medium">
                  Elles ont l’ambition, Mais elles manquent :
                </h6>

                <ul className="flex flex-wrap gap-3">
                  <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    De structure
                  </li>
                  <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    De réseau
                  </li>
                  <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    De soutien stratégique
                  </li>
                </ul>
              </div>
              <h6 className="text-[#091626] md:mb-6 mb-4 text-xl md:text-xl lg:text-2xl font-medium">
                Le Club M a été créé pour combler ce vide.
              </h6>
              <div>
                <Button
                  className="bg-[#a55b46] text-white h-14 px-5 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                  asChild
                >
                  <Link href="/devenir-membre">Rejoindre le Club</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="card-img w-full relative mx-auto lg:w-[80%] md:min-h-[500px] min-h-[350px] h-full z-10">
              <div className="absolute right-[-5%] w-[80%] h-[110%] border-2 border-[#a55b46] -z-10 top-1/2 -translate-y-1/2 rounded-2xl"></div>
              <div className="md:min-h-[670px] min-h-[350px] h-full relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/img-raison.jpg"
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
