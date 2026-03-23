// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Layers, Star, DollarSign, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlockPrice = () => {
  return (
    <div
      className="block-difference lg:py-[100px] py-[50px] bg-[#a55b46] relative z-20 scroll-mt-20"
      id="pricing"
    >
      {/* Overlay avec dots blancs */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center lg:max-w-2xl mx-auto mb-8 lg:mb-14">
          <h3 className="text-sm lg:text-base uppercase font-semibold text-[#ffffff] mb-3 relative pb-3 inline-block items-center justify-center gap-2">
            Abonnement
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#ffffff]"></span>
          </h3>
          <h2 className="text-xl md:text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-center text-white mb-4 lg:mb-6">
            Choisis ton abonnement mensuel.
          </h2>
          <p className="mb-6 lg:text-[18px] text-[16px] text-white opacity-80">
            Commence gratuitement, évolue naturellement, puis accélère ton
            développement au rythme de ton ambition.
          </p>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 lg:gap-6 gap-4">
              {/* Plan Découverte */}
              <div className="col-span-12 lg:col-span-4">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#ffffff] h-full shadow-[0_10px_24px_#0000000a] relative flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl lg:text-3xl font-medium text-[#151516] mb-2">
                      Free
                    </h4>
                    <p className="text-[#151516] text-sm lg:text-5xl mb-6 font-medium tracking-[-0.02em]">
                      0 $
                    </p>

                    {/* Section POUR VOUS SI */}
                    <div className="mb-6">
                      <h5 className="text-base lg:text-lg font-semibold text-[#091626] mb-2">
                        Fais tes premiers pas dans la communauté :
                      </h5>
                    </div>

                    {/* Liste des avantages */}
                    <ul className="flex flex-col gap-3 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Accès à la communauté WhatsApp
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Accès à la newsletter
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Bouton */}
                  <Button
                    className="w-full  bg-transparent text-[#a55b46] border border-[#a55b46] h-14 hover:bg-[#a55b46] hover:text-[#ffffff] transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <Link href="/inscription?plan=free">
                      Rejoins le Club M
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Plan Premium */}
              <div className="col-span-12 lg:col-span-4 relative">
                {/* Badge Recommandé */}

                <div className="h-full p-1 bg-[#151516] rounded-2xl flex flex-col">
                  <div className=" text-center text-white font-medium py-4">
                    Recommandé
                  </div>
                  <div className="card lg:p-8 p-4 mt-auto   rounded-2xl bg-[#ffffff]  shadow-[0_10px_24px_#0000000a] relative flex flex-col justify-between">
                    <div>
                      <h4 className="text-2xl lg:text-3xl font-medium text-[#091626] mb-2">
                        Premium
                      </h4>
                      <p className="text-[#151516] text-sm lg:text-5xl mb-6 font-medium tracking-[-0.02em] inline-flex items-center gap-1">
                        90 $ <span className="text-sm lg:text-base">/ 3 mois</span>
                      </p>

                      {/* Section POUR VOUS SI */}
                      <div className="mb-6">
                        <h5 className="text-base lg:text-lg font-semibold text-[#091626] mb-2">
                          Structure ton business tout en gagnant en visibilité :
                        </h5>
                      </div>

                      {/* Liste des avantages */}
                      <ul className="flex flex-col gap-3 mb-8">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm lg:text-base">
                            Accès à la communauté WhatsApp
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm lg:text-base">
                            Accès à la newsletter
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm lg:text-base">
                            Accès à l’annuaire des membres
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm lg:text-base">
                            Mise en avant sur nos réseaux
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm lg:text-base">
                            Tarifs préférentiels (–10 % sur tous nos produits et
                            services)
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Bouton */}
                    <Button
                      className="w-full bg-[#a55b46] text-[#ffffff] border border-[#a55b46] h-14 hover:bg-[#a55b46]/80 hover:text-[#ffffff] transition-all duration-300 rounded-xl"
                      asChild
                    >
                      <Link href="/inscription?plan=premium">
                        Rejoins le Club M
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Plan Business */}
              <div className="col-span-12 lg:col-span-4">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#ffffff] h-full shadow-[0_10px_24px_#0000000a] relative flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl lg:text-3xl font-medium text-[#091626] mb-2">
                      Business
                    </h4>
                    <p className="text-[#151516] text-sm lg:text-5xl mb-6 font-medium tracking-[-0.02em] inline-flex items-center gap-1">
                      180 $ <span className="text-sm lg:text-base">/ 6 mois</span>
                    </p>

                    {/* Section POUR VOUS SI */}
                    <div className="mb-6">
                      <h5 className="text-base lg:text-lg font-semibold text-[#091626] mb-2">
                        Passe à un niveau supérieur de collaboration et
                        d’opportunités :
                      </h5>
                    </div>

                    {/* Liste des avantages */}
                    <ul className="flex flex-col gap-3 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Accès à la communauté WhatsApp
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Accès à la newsletter
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Accès à l’annuaire des membres
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Mise en avant sur nos réseaux sociaux
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Tarifs préférentiels (–15 % sur tous nos produits et
                          services)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Accès aux insights (data)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#091626] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm lg:text-base">
                          Accès à la marketplace
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Bouton */}
                  <Button
                    className="w-full  bg-transparent text-[#a55b46] border border-[#a55b46] h-14 hover:bg-[#a55b46] hover:text-[#ffffff] transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <Link href="/inscription?plan=business">
                      Rejoins le Club M
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockPrice;
