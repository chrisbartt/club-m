"use client";


const BlockAnnuaireHero = () => {
  return (
    <section className="min-h-[50vh] relative flex items-center bg-[#091626] overflow-hidden pt-24">
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[#091626]/92 via-[#091626]/80 to-[#091626]/70"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
        <div className="flex-1 w-full">
          <span className="inline-flex items-center gap-2 bg-[#e1c593]/15 text-[#e1c593] px-5 py-2 rounded-full text-sm font-semibold mb-6">
            Réseau exclusif de prestataires vérifiées
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Annuaire des{" "}
            <span className="bg-gradient-to-r from-[#e1c593] to-[#a55b46] bg-clip-text text-transparent">
              services
            </span>{" "}
            Club M
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-[550px] leading-relaxed">
            Découvrez les services proposés par nos membres Business : des femmes
            entrepreneures d&apos;origine africaine, sélectionnées et accompagnées
            par le Club M pour vous offrir des prestations de qualité.
          </p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-6 shrink-0">
          {[
            { number: "58", label: "Prestataires" },
            { number: "4.9", label: "Note moyenne" },
            { number: "1200+", label: "Missions réalisées" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-4 md:px-6 py-4 md:py-5 text-center min-w-[100px] md:min-w-[120px]"
            >
              <span className="block text-2xl md:text-3xl font-bold text-[#e1c593]">
                {stat.number}
              </span>
              <span className="text-sm text-white/70 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlockAnnuaireHero;
