import { Star, Quote, Check, X } from "lucide-react";

const blockAvantages = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-[#f8f8f8]">
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-2xl mx-auto lg:mb-14">
          <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
            Avantages
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
          </h3>
          <h2 className="text-2xl lg:text-4xl font-medium text-center text-[#091626] mb-4">
            Ce que Business Aligné transforme
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2"></div>
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 lg:gap-6 gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="card bg-white lg:p-10 rounded-2xl">
                  <h3 className="text-2xl lg:text-2xl font-medium text-[#091626] mb-2 relative inline-block">
                    Sans Business Aligné
                  </h3>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px] md:mb-6">
                    La situation dans laquelle beaucoup restent bloquées.
                  </p>
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                          Vision floue
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Tu as des idées, mais rien de structuré. Tu ne sais
                          pas par où commencer.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                          Doutes permanents
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Tu hésites sur le positionnement, le marché, la
                          viabilité. Tu tournes en boucle.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                        Temps et argent perdus
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Tu hésites sur le positionnement, le marché, la
                          viabilité. Tu tournes en boucle.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
};

export default blockAvantages;
