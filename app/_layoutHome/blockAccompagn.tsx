// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DollarSign, Clock, Star, Heart, Users } from "lucide-react";
const BlockAccompagn = () => {
  return (
    <div className="block-intro lg:py-[100px]  bg-[#f8f8f8] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="text-center lg:max-w-3xl mx-auto mb-8 lg:mb-14">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
              Le problème ressenti
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h2 className="text-3xl lg:text-[48px] leading-[1.2] font-semibold text-center text-black mb-2 lg:mb-6 tracking-[-0.02em]">
              Beaucoup de femmes ont une idée. Peu ont un cadre. Encore moins ont un réseau solide.
              </h2>
            </div>
            <div className="grid grid-cols-12 2xl:grid-cols-5 lg:gap-4 gap-3">
              <div className="col-span-6 lg:col-span-4 2xl:col-span-1">
                <div className="card lg:p-4 p-4 rounded-2xl bg-white h-full relative">
                  <div className="icon mb-2 md:mb-3">
                    <DollarSign className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h4 className="text-base md:text-xl lg:text-xl font-medium text-black relative inline-block">
                  Peur de perdre de l&apos;argent
                  </h4>

                </div>
              </div>
              <div className="col-span-6 lg:col-span-4 2xl:col-span-1">
                <div className="card lg:p-4 p-4 rounded-2xl bg-white h-full relative">
                  <div className="icon mb-2 md:mb-3">
                    <Clock className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h4 className="text-base md:text-xl lg:text-xl font-medium text-black   relative inline-block">
                  Peur de mal commencer
                  </h4>
                </div>
              </div>
              <div className="col-span-6 lg:col-span-4 2xl:col-span-1">
                <div className="card lg:p-4 p-4 rounded-2xl bg-white h-full relative">
                  <div className="icon mb-2 md:mb-3">
                    <Star className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h4 className="text-base md:text-xl lg:text-xl font-medium text-black relative inline-block">
                  Manque de modèle
                  </h4>
                </div>
              </div>
              <div className="col-span-6 lg:col-span-4 2xl:col-span-1">
                <div className="card lg:p-4 p-4 rounded-2xl bg-white h-full relative">
                  <div className="icon mb-2 md:mb-3">
                    <Heart className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h4 className="text-base md:text-xl lg:text-xl font-medium text-black relative inline-block">
                  Pression familiale
                  </h4>
                  
                </div>
              </div>
              <div className="col-span-6 lg:col-span-4 2xl:col-span-1">
                <div className="card lg:p-4 p-4 rounded-2xl bg-white h-full relative">
                  <div className="icon mb-2 md:mb-3">
                    <Users className="md:w-8 md:h-8 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h4 className="text-base md:text-xl lg:text-xl font-medium text-black relative inline-block">
                  Solitude entrepreneuriale
                  </h4>
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

export default BlockAccompagn;
