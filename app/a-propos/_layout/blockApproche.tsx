
import { Users, Monitor, TrendingUp } from "lucide-react";


const BlockApproche = () => {
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
            Notre approche 
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
          </h3>
          <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-center text-white tracking-[-0.02em]">
          Notre approche unique
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 lg:gap-6 gap-4">
              <div className="col-span-12 md:col-span-4">
                <div className="card bg-white lg:p-7 p-6 rounded-2xl h-full">
                  <div className="icon mb-4">
                    <TrendingUp className="md:w-10 md:h-10 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-2 relative inline-block">
                  Incubateur
                  </h3>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px] md:mb-6">
                  Accompagnement personnalisé avec ateliers pratiques, formations ciblées et mentorat par des experts. Un parcours structuré pour développer vos compétences entrepreneuriales.
                  </p>
                  
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="card bg-white lg:p-7 rounded-2xl h-full">
                <div className="icon mb-4">
                    <Monitor className="md:w-10 md:h-10 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-2 relative inline-block">
                  Plateforme Digitale
                  </h3>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px] md:mb-6">
                  Des outils en ligne puissants : Parcours structurants, Ateliers pratiques, Annuaire & Networking. Gérez et développez votre activité depuis votre téléphone.
                  </p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="card bg-white lg:p-7 rounded-2xl h-full">
                <div className="icon mb-4">
                    <Users className="md:w-10 md:h-10 w-6 h-6 text-[#a55b46]" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-2 relative inline-block">
                  Communauté
                  </h3>
                  <p className="text-muted-foreground lg:text-[18px] text-[16px] md:mb-6">
                  Un réseau dynamique d&apos;entrepreneures qui s&apos;entraident, partagent leurs expériences et créent des opportunités business ensemble.
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

export default BlockApproche;
