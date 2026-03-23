import Link from "next/link";
import { X, Check , ArrowRight } from "lucide-react";
import Image from "next/image";

const BlockStep = () => {
  return (
    <div
      id="comment-ca-marche"
      className="block-difference lg:py-[100px] py-[50px] bg-[#091626] relative z-20"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center lg:max-w-2xl mx-auto lg:mb-14">
          <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
            Avantages
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
          </h3>
          <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-center text-white tracking-[-0.02em]">
            Ce que Business Aligné transforme
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 lg:gap-6 gap-4">
              <div className="col-span-12 md:col-span-4">
                <div className="card bg-white lg:p-7 rounded-2xl h-full">
                  <h3 className="text-2xl lg:text-2xl font-semibold text-[#091626] mb-1 relative inline-block">
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
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                          Isolement
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Pas de regard extérieur. Tu décides seule, sans
                          feedback professionnel.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="card bg-white lg:p-7 rounded-2xl h-full">
                  <h3 className="text-2xl lg:text-2xl font-semibold text-[#091626] mb-1 relative inline-block">
                    Avec Business Aligné
                  </h3>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px] md:mb-6">
                    Ce que tu obtiens en 4 semaines.
                  </p>
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                          Une vision claire de ton projet
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Ton idée est posée, structurée, facile à expliquer à
                          n&apos;importe qui.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                          Un positionnement cohérent
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Ton projet est aligné avec ta vie, tes ressources et
                          ton marché.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                          Un plan d&apos;action concret
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Tu sais exactement quoi faire ensuite : ajuster,
                          pivoter ou structurer ton Business Plan.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-[#091626]">
                          Un accompagnement humain
                        </h4>
                        <p className="text-muted-foreground lg:text-base text-[14px]">
                          Pas un algorithme. Maurelle, en face de toi, qui
                          connaît ton contexte.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="card rounded-2xl h-full relative overflow-hidden">
                  <div className="overlay-img absolute inset-0">
                    <div
                      className="overlay absolute inset-0 z-10"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 32.16%, rgba(0, 0, 0, 0.60) 79.94%)",
                      }}
                    ></div>
                    <Image
                      src="/images/banner12.jpg"
                      alt="Business Aligné"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                    <h3 className="text-2xl lg:text-2xl font-semibold text-white mb-1 relative inline-block">
                      Business Aligné
                    </h3>
                    <p className="text-white lg:text-[16px] text-[14px]">
                      Un parcours structuré et humain. Pas un cours en ligne. Un
                      vrai accompagnement individuel.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/business-aligne/commencer"
                        className="text-[#ffffff] hover:text-[#a55b46] flex items-center gap-2 font-semibold transition-all duration-300"
                      >
                        Réserver ma session <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
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

export default BlockStep;
