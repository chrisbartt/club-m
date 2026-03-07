// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlockParcoursThree = () => {
  return (
    <div id="etape-3" className="block-intro lg:py-[100px] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
            <div className="card-img relative lg:w-[90%] md:min-h-[500px] min-h-[300px] h-full rounded-2xl overflow-hidden">
              {/* Tag avec numéro 03 */}
              <div className="absolute top-6 left-6 z-20">
                <div className="w-16 h-16 rounded-xl bg-[#a55b46] flex items-center justify-center text-white text-2xl font-bold">
                  03
                </div>
              </div>
             
              <Image
                src="/images/banner4.jpg"
                alt="Visibilité"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            {/* Tag ÉTAPE */}
            <div className="mb-3">
              <span className="bg-[#f5f5f5] text-[#a55b46] px-4 py-1.5 rounded-lg text-xs font-semibold uppercase">
                ÉTAPE 3 • VISIBILITÉ
              </span>
            </div>
            
            {/* Titre */}
            <h3 className="text-2xl lg:text-4xl font-medium text-[#091626] mb-6">
              Gagnez en visibilité et développez votre activité.
            </h3>
            
            <div className="lg:pr-34">
              {/* Bloc Pour qui */}
              <div className="mb-6 bg-[#f5f5f5] rounded-xl p-4 border border-[#0000000f]">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#a55b46] shrink-0 mt-0.5" />
                  <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                    <span className="font-semibold text-black">Pour qui :</span> Entrepreneures souhaitant se rendre visibles et trouver de nouvelles opportunités.
                  </p>
                </div>
              </div>
              
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
                      Manque de visibilité
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Difficulté à trouver des clients ou partenaires
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Réseau limité
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
                      Un profil professionnel visible
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Des opportunités business
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                    <span className="text-muted-foreground lg:text-[16px] text-[14px]">
                      Une crédibilité renforcée
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Section Quand l'utiliser */}
              <div className="mb-6">
                <div className="bg-[#f5f5f5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[#a55b46]" />
                    <h4 className="text-base lg:text-lg font-semibold text-black">
                      Quand l&apos;utiliser ?
                    </h4>
                  </div>
                  <p className="text-muted-foreground lg:text-[16px] text-[14px] ml-7">
                    Dès que votre activité est prête à être présentée.
                  </p>
                </div>
              </div>
              
              {/* Bouton CTA */}
              <Button
                className="bg-[#a55b46] text-white h-14 md:px-6 px-4 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg gap-2"
                asChild
              >
                <Link href="/annuaire">
                  Être visible dans l&apos;annuaire <Search className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockParcoursThree;
