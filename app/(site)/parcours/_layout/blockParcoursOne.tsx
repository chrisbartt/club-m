// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlockParcoursOne = () => {
  return (
    <div id="etape-1" className="block-intro lg:py-[100px] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
            <div className="card-img relative lg:w-[90%] md:min-h-[500px] min-h-[300px] h-full rounded-2xl overflow-hidden">
              {/* Tag avec numéro 01 */}
              <div className="absolute top-6 left-6 z-20">
                <div className="w-16 h-16 rounded-xl bg-[#a55b46] flex items-center justify-center text-white text-2xl font-bold">
                  01
                </div>
              </div>
              
              <Image
                src="/images/banner4.jpg"
                alt="Business Aligné"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            {/* Tag ÉTAPE */}
            <div className="mb-3">
              <span className="bg-[#f5f5f5] text-[#a55b46] px-4 py-1.5 rounded-lg text-xs font-semibold uppercase">
                ÉTAPE 1 • CLARIFICATION
              </span>
            </div>
            
            {/* Titre avec badge ACCÈS FREE */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl lg:text-4xl font-medium text-black">
                Business Aligné
              </h3>
              <div className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1.5">
                <Check className="w-3 h-3" />
                <span className="text-xs font-semibold uppercase">ACCÈS FREE</span>
              </div>
            </div>
            
            {/* Sous-titre */}
            <p className="text-muted-foreground mb-6 lg:text-[18px] text-[16px] italic">
              Clarifiez votre vision, alignez votre projet, avancez avec confiance.
            </p>
            
            <div className="lg:pr-34">
              {/* Paragraphe d'introduction */}
              <p className="text-muted-foreground mb-6 lg:text-[18px] text-[16px]">
                Beaucoup d&apos;entrepreneures ressentent un manque de clarté sur leur vision, leur positionnement ou la viabilité de leur projet. Le parcours Business Aligné vous aide à structurer votre idée et à avancer avec confiance.
              </p>
              
              {/* Section CE QUE ÇA RÉSOUT */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-base lg:text-lg font-semibold text-black uppercase">
                    CE QUE ÇA RÉSOUT
                  </h4>
                </div>
                <ul className="flex flex-col gap-2 ml-8">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Vision floue
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Doutes sur l&apos;idée ou le positionnement
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Projet mal défini ou non structuré
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Section CE QUE VOUS OBTENEZ */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-base lg:text-lg font-semibold text-black uppercase">
                    CE QUE VOUS OBTENEZ
                  </h4>
                </div>
                <ul className="flex flex-col gap-2 ml-8">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Une vision claire de votre projet
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Un positionnement cohérent
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Des valeurs et objectifs identifiés
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Un plan d&apos;action simple et concret
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Section Quand l'utiliser */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#a55b46]" />
                  <h4 className="text-base lg:text-lg font-semibold text-black">
                    Quand l&apos;utiliser ?
                  </h4>
                </div>
                <div className="bg-[#f5f5f5] rounded-xl p-4">
                  <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                    Lorsque vous avez une idée, mais que vous ne savez pas encore comment la structurer ou si elle est réellement viable.
                  </p>
                </div>
              </div>
              
              {/* Bouton CTA */}
              <Button
                className="bg-[#a55b46] text-white h-14 md:px-6 px-4 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg gap-2"
                asChild
              >
                <Link href="/parcours/business-aligne">
                  Découvrir le parcours Business Aligné <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockParcoursOne;
