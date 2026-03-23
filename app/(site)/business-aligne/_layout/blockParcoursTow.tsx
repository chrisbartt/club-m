// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, Globe, Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlockParcoursTow = () => {
  return (
    <div id="etape-2" className="block-difference lg:py-[100px] py-[50px] bg-[#091626] relative z-20">
      {/* Overlay avec dots blancs */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center lg:max-w-2xl mx-auto lg:mb-14">
          {/* Badge ÉTAPE 2 */}
          <div className="mb-3">
            <span className="bg-[#a55b46] text-white px-4 py-1.5 rounded-lg text-xs font-semibold uppercase inline-block">
              ÉTAPE 2 - FORMATION
            </span>
          </div>
          
          {/* Titre avec badge PREMIUM */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="text-2xl lg:text-4xl font-medium text-center text-white">
              Ateliers & Masterclass
            </h2>
            <div className="bg-[#a55b46] text-white px-3 py-1 rounded-lg flex items-center gap-1.5">
              <Star className="w-3 h-3" />
              <span className="text-xs font-semibold uppercase">PREMIUM</span>
            </div>
          </div>
          
          {/* Sous-titre */}
          <p className="text-white italic mb-4 lg:text-[18px] text-[16px]">
            Apprenez, échangez et progressez avec d&apos;autres entrepreneures.
          </p>
          
          {/* Paragraphe descriptif */}
          <p className="mb-6 lg:text-[18px] text-[16px] text-white opacity-80">
            Toutes les membres souhaitant développer leurs compétences et leur réseau peuvent participer à nos sessions de formation pratiques et ciblées.
          </p>
        </div>
        
        {/* Grille de 4 cartes */}
        <div className="grid grid-cols-12 gap-4 lg:mb-8">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 lg:gap-6 gap-4">
              {/* Carte 1: Formations pratiques */}
              <div className="col-span-12 lg:col-span-6">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#1a2638] h-full shadow-[0_10px_24px_#0000000a] relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl lg:text-2xl font-medium text-white mb-1">
                        Formations pratiques
                      </h4>
                      <p className="text-white/80 text-sm lg:text-base">
                        Des contenus ciblés et directement applicables à votre activité
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Carte 2: Échanges d'expériences */}
              <div className="col-span-12 lg:col-span-6">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#1a2638] h-full shadow-[0_10px_24px_#0000000a] relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl lg:text-2xl font-medium text-white mb-1">
                        Échanges d&apos;expériences
                      </h4>
                      <p className="text-white/80 text-sm lg:text-base">
                        Partagez et apprenez des parcours d&apos;autres entrepreneures
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Carte 3: Réseau actif */}
              <div className="col-span-12 lg:col-span-6">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#1a2638] h-full shadow-[0_10px_24px_#0000000a] relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl lg:text-2xl font-medium text-white mb-1">
                        Réseau actif
                      </h4>
                      <p className="text-white/80 text-sm lg:text-base">
                        Connectez-vous avec une communauté d&apos;entrepreneures engagées
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Carte 4: Conseils applicables */}
              <div className="col-span-12 lg:col-span-6">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#1a2638] h-full shadow-[0_10px_24px_#0000000a] relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#a55b46] flex items-center justify-center shrink-0">
                      <Star className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl lg:text-2xl font-medium text-white mb-1">
                        Conseils applicables
                      </h4>
                      <p className="text-white/80 text-sm lg:text-base">
                        Repartez avec des actions concrètes à mettre en œuvre
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden md:block"></div>
        </div>
        
        {/* Barre CTA en bas */}
        <div className="grid grid-cols-12 gap-4 mt-8">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="bg-[#1a2638] rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white" />
                <p className="text-white text-base lg:text-lg font-medium">
                  Quand participer ? Tout au long de votre parcours entrepreneurial.
                </p>
              </div>
              <Button
                className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46]/80 hover:text-white transition-all duration-300 rounded-lg flex items-center gap-2"
                asChild
              >
                <Link href="/evenements">
                  Voir les prochains ateliers <Calendar className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="col-span-1 hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockParcoursTow;
