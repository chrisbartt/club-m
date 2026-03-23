import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const BlockPrice = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-[#f8f8f8] relative z-30">
      <div className="img-bg absolute inset-0 -z-10">
        <div className="overlay absolute inset-0 z-10 bg-black opacity-50"></div>
        <Image
          src="/images/banner6.jpg"
          alt="FAQ"
          fill
          className="object-cover"
        />
      </div>
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-1 hidden lg:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center">
              <div className="col-span-12 lg:col-span-6">
                <div>
                  <h3 className="text-base uppercase font-semibold text-[#ffffff] mb-3 relative inline-block pb-3">
                    Tarif transparent
                    <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
                  </h3>
                  <h4 className="text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-[#ffffff] mb-3">
                    Un investissement. Pas une dépense.
                  </h4>
                  <p className="text-white opacity-80 text-[18px]">
                    Business Aligné est un service indépendant de l'abonnement
                    Club M. Pas d'engagement, pas de surprise.
                  </p>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6">
                <div className="card bg-[#091626]  backdrop-blur-[100px] lg:p-8 lg:w-[90%] ml-auto rounded-2xl relative">
                <div className="absolute inset-0 pointer-events-none -z-10 opacity-20" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
                  <h5 className="text-base font-semibold text-[#ffffff] mb-3">
                    Business Aligné - Session complète
                  </h5>
                  <h6 className="text-5xl font-semibold text-[#ffffff] mb-3">
                    100 USD
                  </h6>
                  <p className="text-[#ffffff] opacity-80 md:text-[16px] text-[14px]">
                    Paiment unique / pas d&apos;abonnement
                  </p>
                  <hr className="my-4 border-[#ffffff17]" />
                  <p className="text-[#ffffff] md:text-[16px] text-[14px] mb-3">
                    Ce qui est inclus 
                  </p>
                  <ul className="flex flex-col gap-3 bg-[#ffffff12] p-4 rounded-xl backdrop-blur-[10px]">
                    <li className="flex items-start gap-2 text-[#ffffff] font-medium">
                      <Check className="w-5 h-5 text-[#ffffff] shrink-0 mt-0.5" />
                      <span className="text-[#ffffff] text-sm lg:text-base">
                      Formulaire guidé de définition de ton idée
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-[#ffffff] font-medium">
                      <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-[#ffffff] text-sm lg:text-base">
                      Analyse complète de cohérence de ton projet
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-white font-medium">
                      <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-white text-sm lg:text-base">
                      Session de feedback individuelle avec Maurelle (1h en visio)
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-white font-medium">
                      <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-white text-sm lg:text-base">
                      Document de restitution personnalisé avec plan d&apos;action
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-white font-medium">
                      <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-white text-sm lg:text-base">
                      Recommandations de prochaines étapes (ajuster, pivoter ou Business Plan)
                      </span>
                    </li>
                  </ul>
                  <hr className="my-4 border-[#ffffff17]" />
                  <p className="text-white md:text-[16px] text-[14px] mb-3">
                    Modes de paiement
                  </p>
                  <ul className="flex flex-col gap-3 bg-[#ffffff12] p-4 rounded-xl backdrop-blur-[10px]">
                    <li className="flex items-start gap-2 text-white font-medium">
                      <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-white text-sm lg:text-base">
                      Mobile Money (M-Pesa, Airtel Money, Orange Money)
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-white font-medium">
                      <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-white text-sm lg:text-base">
                      Carte bancaire (Visa, Mastercard)
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-white font-medium">
                      <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-white text-sm lg:text-base">
                      Virement bancaire (Transfert direct)
                      </span>
                    </li>
                  </ul>
                  <Button className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer w-full h-14 rounded-xl px-5 md:mt-8" asChild>
                  <Link href="/business-aligne/commencer">
                    Réserver ma session
                  </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockPrice;
