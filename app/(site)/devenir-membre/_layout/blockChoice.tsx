// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {  Users, BookOpen, Rocket } from "lucide-react";

const BlockChoice = () => {
  return (
    <div id="choice" className="block-intro lg:py-[100px] bg-[#ffff] py-[50px] scroll-mt-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="text-center lg:max-w-4xl mx-auto lg:mb-14">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-4 lg:mb-6 relative pb-3 inline-block items-center justify-center gap-2">
              Nos offres
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h2 className="text-xl md:text-2xl lg:text-[44px] leading-[1.2] tracking-[-0.02em] font-semibold text-center text-[#091626] mb-3 lg:mb-4">
              Entre dans l’univers du Club M et choisis l’accompagnement qui fera passer ton business au prochain niveau.

              </h2>
            </div>
            <div className="grid grid-cols-12 lg:gap-6 gap-4">
              {/* Carte 1: Une communauté soudée */}
              <div className="col-span-12 lg:col-span-4">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#f5f5f5] h-full relative">
                  <div className="icon mb-3 lg:mb-4 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#a55b46] text-white rounded-full font-semibold text-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  
                  <h4 className="text-xl md:text-2xl font-medium text-black mb-2 lg:mb-3 relative inline-block">
                  Free
                  </h4>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px]">
                  Découvre le mouvement, comprends l’univers du Club M et commence à créer des connexions avec la communauté.
                  </p>
                </div>
              </div>

              {/* Carte 2: Un accompagnement concret */}
              <div className="col-span-12 lg:col-span-4">
                <div className="card lg:p-7 p-4 rounded-2xl bg-[#f5f5f5] h-full relative">
                  <div className="icon mb-3 lg:mb-4 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#a55b46] text-white rounded-full font-semibold text-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-medium text-black mb-2 lg:mb-3 relative inline-block">
                  Premium
                  </h4>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px]">
                  Structure ton business avec une méthode claire, un réseau engagé et un accompagnement qui te fait réellement avancer. 
                  </p>
                </div>
              </div>

              {/* Carte 3: Des opportunités uniques */}
              <div className="col-span-12 lg:col-span-4">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#f5f5f5] h-full relative">
                  <div className="icon mb-3 lg:mb-4 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#a55b46] text-white rounded-full font-semibold text-lg">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-medium text-black mb-2 lg:mb-3 relative inline-block">
                  Business
                  </h4>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px]">
                  Accélère ta croissance, développe tes ventes et transforme ton activité en business solide et rentable. 
                  </p>
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

export default BlockChoice;
