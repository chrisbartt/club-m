"use client";

const BusinessAligneHeader = () => {
    return (
        <div className="bg-primaryColor rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6 relative overflow-hidden md:mt-6 mt-4 lg:mt-6">
            {/* Pattern de fond */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
            
            <div className="relative z-10">
                {/* Message de bienvenue */}
                <h1 className="text-[28px] lg:text-[36px] font-bold text-white mb-1">
                    Bienvenue, Marie !
                </h1>
                <p className="text-[14px] lg:text-[16px] text-white/90 leading-relaxed mb-6 max-w-3xl">
                    Ton parcours Business Aligné est en cours. Nous analysons la cohérence de ton idée avec ta vie personnelle et professionnelle pour te donner un avis structuré et honnête.
                </p>

                {/* Indicateurs clés */}
                <div className="flex flex-wrap gap-3 lg:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30">
                        <div className="text-[20px] lg:text-[24px] font-bold text-white">3/4</div>
                        <div className="text-[12px] text-white/80">Étapes complétées</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30">
                        <div className="text-[20px] lg:text-[24px] font-bold text-white">Porte B</div>
                        <div className="text-[12px] text-white/80">Valider mon idée</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30">
                        <div className="text-[20px] lg:text-[24px] font-bold text-white">16 Fév</div>
                        <div className="text-[12px] text-white/80">Prochain RDV</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessAligneHeader;
