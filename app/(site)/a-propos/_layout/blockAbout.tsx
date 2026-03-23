import Image from "next/image";
import { Check } from "lucide-react";

const BlockAbout = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
            <div className="card-img w-full relative mx-auto 2xl:w-[80%] lg:w-[90%] md:min-h-[500px] min-h-[350px] h-full z-10">
              <div className="absolute left-[-5%] w-[80%] h-[110%] border-2 border-[#a55b46] -z-10 top-1/2 -translate-y-1/2 rounded-2xl"></div>
              <div className="md:min-h-[650px] min-h-[350px] h-full relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-2.jpg"
                  alt="devenir membre"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="flex flex-col justify-center h-full 2xl:pr-24 lg:pr-14">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                La communauté qui transforme ta vision en business.
                <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[44px] 2xl:text-[38px] leading-[1.2] font-semibold text-[#151516] mb-1 lg:mb-2 tracking-[-0.02em]">
                Le Club M est un réseau de femmes entrepreneures qui veulent
                construire un business rentable, sans avancer seules.
              </h4>
              <div>
                <p className="text-muted-foreground mb-3 lg:text-[18px] text-[16px]">
                  Ici, tu ne trouves pas seulement de l’inspiration.
                </p>
                <p className="text-muted-foreground mb-3 lg:text-[18px] text-[16px]">
                  Tu trouves :
                </p>
                <ul className="flex flex-wrap gap-3 mb-4 md:mb-6">
                  <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    Un réseau stratégique
                  </li>
                  <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    Des outils concrets
                  </li>
                  <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    Des échanges entre entrepreneures
                  </li>
                  <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    Un cadre pour passer à l’action
                  </li>
                </ul>
                <div >
                  <h6 className="text-[#091626] mb-1 text-xl md:text-xl lg:text-2xl font-medium">
                    Parce qu’un business ne se développe pas seulement avec des
                    idées.
                  </h6>
                  <p className="text-muted-foreground mb-3 lg:text-[18px] text-[16px]">
                    Il se développe avec :
                  </p>
                  <ul className="flex flex-wrap gap-3">
                    <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                      <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      Les bonnes méthodes
                    </li>
                    <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                      <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      Les bonnes connexions
                    </li>
                    <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
                      <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      Le bon environnement
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockAbout;
