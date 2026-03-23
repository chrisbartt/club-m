// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const BlockStarter = () => {
  return (
    <div className="block-intro lg:py-[100px] p-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6">
            <div className="card-img relative lg:w-[90%] min-h-[500px] h-full rounded-2xl overflow-hidden">
              <div className="absolute lg:top-[-130px] left-0 w-[10px] h-full  bg-white z-10 rotate-45"></div>
              <div className="absolute lg:bottom-[-130px] right-0 w-[10px] h-full  bg-white z-10 rotate-45"></div>
              <Image
                src="/images/banner6.jpg"
                alt="devenir membre"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <h3 className="text-2xl lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
              {"Dès l'inscription"}
              <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
            </h3>
            <h4 className="text-2xl lg:text-4xl font-medium text-black mb-6">
              Un Starter Pack offert pour bien démarrer
            </h4>
            <div className="lg:pr-34">
              <p className="text-muted-foreground mb-4 lg:text-[18px] text-[16px]">
                {
                  "Dès que votre adhésion est validée, vous recevez un pack de ressources pour avancer sans perdre de temps. "
                }
              </p>
              <ul className="text-black font-medium flex flex-col gap-4 mb-6 lg:text-[18px] text-[16px]">
                <li className="flex gap-3 items-center">
                  <div className="icon flex items-center justify-center w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <p>{"Mini guide “Lancer son activité étape par étape”"}</p>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="icon flex items-center justify-center w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <p>{"Modèle de business plan Club M"}</p>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="icon flex items-center justify-center w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <p>{"Modèle de pitch deck spécial financement"}</p>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="icon flex items-center justify-center w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <p>{"Calendrier des ateliers & masterclass"}</p>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="icon flex items-center justify-center w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <p>{"Replay de plusieurs masterclass exclusives"}</p>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="icon flex items-center justify-center w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <p>{"Checklist Rawbank Lady’s First"}</p>
                </li>
              </ul>
              <Button
                className="bg-[#000000] text-white h-12 hover:bg-[#a55b46] hover:text-black cursor-pointer transition-all duration-300 rounded-lg"
                asChild
              >
                <Link href="/formulaire-membre">Adhérer maintenant</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockStarter;
