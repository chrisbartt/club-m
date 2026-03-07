import { Star } from "lucide-react";
import Image from "next/image";

// Logos dans public/logos/partners/
const PREMIUM_PARTNER = {
  name: "Rawbank",
  logo: "/logos/partners/rawbank.png",
};

const PARTNERS = [
  { name: "Equity BCDC", logo: "/logos/partners/equity-bcdc.png" },
  { name: "TMB", logo: "/logos/partners/tmb.png" },
  { name: "BGFI Bank", logo: "/logos/partners/bgfi.png" },
  { name: "First Bank", logo: "/logos/partners/firstbank.png" },
  { name: "UBA", logo: "/logos/partners/uba.png" },
  { name: "Afriland First Bank", logo: "/logos/partners/afriland.png" },
  { name: "Vodacom", logo: "/logos/partners/vodacom.png" },
  { name: "Airtel Africa", logo: "/logos/partners/airtel.png" },
  { name: "Africell", logo: "/logos/partners/africell.png" },
  { name: "TotalEnergies", logo: "/logos/partners/total.png" },
  { name: "TFM", logo: "/logos/partners/tfm.png" },
  { name: "WANEC", logo: "/logos/partners/wanec.png" },
];

const BlockPartenaire = () => {
  return (
    <div className="block-intro lg:py-[100px] bg-[#f8f8f8] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block" />
          <div className="col-span-12 lg:col-span-10">
            <div className="text-center lg:max-w-3xl mx-auto lg:mb-14">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Nos partenaires
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]" />
              </h3>
              <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-center text-black mb-2 lg:mb-6 tracking-[-0.02em]">
                Ils nous font confiance
              </h2>
            </div>

            {/* Partenaire Premium */}
            <div className="flex flex-col items-center mb-3 lg:mb-4">
              <span className="inline-flex items-center gap-2 bg-[#a55b46]/10 text-[#a55b46] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Star className="w-3.5 h-3.5" />
                Partenaire Premium
              </span>
              <div className="bg-white rounded-2xl p-8 md:p-12 mx-auto md:mb-4 mb-3 max-w-[400px] w-full flex items-center justify-center min-h-[120px] border border-[#a55b46]/20">
                <div className="relative w-full h-16 max-w-[200px]">
                  <Image
                    src={PREMIUM_PARTNER.logo}
                    alt={PREMIUM_PARTNER.name}
                    fill
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[1000px] mx-auto">
              {PARTNERS.map((partner) => (
                <div
                  key={partner.name}
                  className="card rounded-2xl bg-white p-6 flex items-center justify-center min-h-[100px] border border-[#e9eef5] hover:border-[#a55b46]/30 transition-colors duration-300"
                >
                  <div className="relative w-full h-12">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 hidden md:block" />
        </div>
      </div>
    </div>
  );
};

export default BlockPartenaire;
