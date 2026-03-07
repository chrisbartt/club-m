import Link from "next/link";
import { BookOpen, Users, Handshake } from "lucide-react";
const BlockStep = () => {
  return (
    <div
      id="comment-ca-marche"
      className="block-difference lg:py-[70px] lg:pb-[100px] py-[50px] bg-[#f5f5f5] relative z-20 overflow-hidden"
    >
      <div className="container px-4 lg:px-6 mx-auto relative z-10">
        <div className="text-center lg:max-w-4xl mx-auto lg:mb-14">
          <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
            COMMENT ÇA MARCHE
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
          </h3>
          <h2 className="text-2xl lg:text-[48px] font-semibold leading-[1.2] text-center text-[#091626] mb-4 lg:mb-6">
            Plus qu’un réseau, un écosystème qui structure et accélère ton
            business.
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden 2xl:block"></div>
          <div className="col-span-12 2xl:col-span-10">
            {/* Arc de cercle : sur desktop les cartes suivent une courbe (milieu plus haut) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-1 gap-4 lg:gap-6  relative">
              {/* Pilier 1 — gauche de l'arc (plus bas) */}
              <Link href="/devenir-membre" >
                <div className="card 2xl:p-8 lg:p-6 p-6 rounded-2xl overflow-hidden group bg-[#ffffff] h-full  relative hover:scale-105 transition-all duration-300">
                  <div className="flex mb-2 md:mb-2">
                    <div className="md:w-12 md:h-12 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold relative z-10">
                      <div className="absolute inset-0 bg-[#a55b46] opacity-0 group-hover:opacity-100 rounded-full group-hover:scale-[18] transition-all duration-300 -z-10"></div>
                      <div className="w-full icon items-center justify-center text-[#a55b46] text-xl font-bold relative z-10 rounded-full group-hover:text-[#fff] transition-all duration-300">
                        <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl md:text-xl lg:text-2xl font-medium text-[#091626] md:mb-3 mb-1 relative inline-block z-10 group-hover:text-[#fff] transition-all duration-300">
                    Structure
                  </h4>
                  <p className="text-[#091626]/80 md:text-[18px] text-[16px] relative z-10 group-hover:text-[#fff] transition-all duration-300">
                    Un accompagnement stratégique. Business aligné. Business
                    plan. Tu sais quoi faire, et dans quel ordre
                  </p>
                </div>
              </Link>
              {/* Pilier 2 — remonte vers le sommet de l'arc */}
              <Link href="/business-aligne" >
                <div className="card 2xl:p-8 lg:p-6 p-6 rounded-2xl overflow-hidden group bg-[#ffffff] h-full relative hover:scale-105 transition-all duration-300">
                  <div className="flex mb-2 md:mb-2">
                    <div className="md:w-12 md:h-12 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold relative z-10">
                      <div className="absolute inset-0 bg-[#a55b46] opacity-0 group-hover:opacity-100 rounded-full group-hover:scale-[18] transition-all duration-300 -z-10"></div>
                      <div className="w-full icon items-center justify-center text-[#a55b46] text-xl font-bold relative z-10 rounded-full group-hover:text-[#fff] transition-all duration-300">
                        <Users className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl md:text-xl lg:text-2xl font-medium text-[#091626] md:mb-3 mb-1 relative inline-block z-10 group-hover:text-[#fff] transition-all duration-300">
                    Solidarité
                  </h4>
                  <p className="text-[#091626]/80 md:text-[18px] text-[16px] relative z-10 group-hover:text-[#fff] transition-all duration-300">
                    Une communauté engagée. Échanges. Entraide. Soutien. Tu ne
                    portes plus ton business seule.
                  </p>
                </div>
              </Link>
              {/* Pilier 3 — sommet de l'arc */}
              <Link href="/annuaires" >
                <div className="card 2xl:p-8 lg:p-6 p-6 rounded-2xl overflow-hidden group bg-[#ffffff] h-full relative hover:scale-105 transition-all duration-300">
                  <div className="flex mb-2 md:mb-6">
                    <div className="md:w-12 md:h-12 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold relative z-10">
                      <div className="absolute inset-0 bg-[#a55b46] opacity-0 group-hover:opacity-100 rounded-full group-hover:scale-[18] transition-all duration-300 -z-10"></div>
                      <div className="w-full icon items-center justify-center text-[#a55b46] text-xl font-bold relative z-10 rounded-full group-hover:text-[#fff] transition-all duration-300">
                        <Handshake className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl md:text-xl lg:text-2xl font-medium text-[#091626] md:mb-3 mb-1 relative inline-block z-10 group-hover:text-[#fff] transition-all duration-300">
                    Opportunités
                  </h4>
                  <p className="text-[#091626]/80 md:text-[18px] text-[16px] relative z-10 group-hover:text-[#fff] transition-all duration-300">
                    Des connexions qui développent ton chiffre d’affaires.
                    Événements ciblés. Recommandations. Collaborations. Ton
                    réseau devient un levier de croissance.
                  </p>
                </div>
              </Link>
              
            </div>
          </div>
          <div className="col-span-1 hidden 2xl:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockStep;
