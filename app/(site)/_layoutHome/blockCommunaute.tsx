"use client";

import Image from "next/image";
import { Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

// Vidéo : Fatou Fofana, l'histoire inspirante d'une cheffe d'entreprise (femme entrepreneure)
const YOUTUBE_VIDEO_ID = "4DwYAt27pE4";

const BlockCommunaute = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="block-difference bg-[#581621] relative z-20 py-[50px] lg:py-0">
      {/* Overlay avec dots blancs */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container-full px-4 md:px-0">
        <div className="grid grid-cols-12 lg:gap-6 gap-3">
          {/* Statistique 1 */}
          <div className="col-span-12 md:col-span-6">
            <div className="h-full lg:p-[50px] 2xl:p-[80px] lg:py-[100px] flex items-center">
              <div>
                <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a85e49] mb-3 relative inline-block pb-3">
                  Des événements ciblés
                  <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a85e49]"></span>
                </h3>
                <h2 className="text-2xl lg:text-[44px] leading-[1.2] font-semibold text-white mb-2 lg:mb-4 tracking-[-0.02em]">
                  On transforme des <br /> rencontres  en opportunités.
                </h2>
                <h4 className="text-xl md:text-xl lg:text-2xl leading-[1.2] font-medium text-white mb-2 lg:mb-4 tracking-[-0.02em]">
                  On se retrouve. On partage. On construit.
                </h4>
                <p className="text-white/80 text-base md:text-lg w-full md:w-[550px] leading-relaxed mb-2">
                  Nos événements réunissent des femmes entrepreneures
                  ambitieuses prêtes à développer leur business avec du concret
                  : stratégies, connexions qualifiées, collaborations réelles
                </p>
                <p className="text-white/80 text-base md:text-lg w-full md:w-[550px] leading-relaxed mb-4 md:mb-6">
                  Ce ne sont pas que des évènements. Ce sont des espaces où :
                </p>
                <ul className="flex flex-wrap gap-3 mb-4 md:mb-6">
                  <li className="flex gap-2 items-center text-white text-base md:text-lg leading-relaxed py-2 px-2 bg-[#151516]/30 backdrop-blur-sm rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-white rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-[#a85e49]" />
                    </div>
                    Des partenariats naissent.
                  </li>
                  <li className="flex gap-2 items-center text-white text-base md:text-lg leading-relaxed py-2 px-2 bg-[#151516]/30 backdrop-blur-sm rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-white rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-[#a85e49]" />
                    </div>
                    Des clientes se rencontrent.
                  </li>
                  <li className="flex gap-2 items-center text-white text-base md:text-lg leading-relaxed py-2 px-2 bg-[#151516]/30 backdrop-blur-sm rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-white rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-[#a85e49]" />
                    </div>
                    Des projets prennent forme.
                  </li>
                  <li className="flex gap-2 items-center text-white text-base md:text-lg leading-relaxed py-2 px-2 bg-[#151516]/30 backdrop-blur-sm rounded-full">
                    <div className="icon flex items-center justify-center w-6 h-6 bg-white rounded-full flex-shrink-0">
                      <Check className="w-4 h-4 text-[#a85e49]" />
                    </div>
                    Des décisions se prennent.
                  </li>
                </ul>
                <h6 className="text-white mb-6 text-xl md:text-xl lg:text-2xl font-medium md:mb-6">
                  Chaque événement est pensé pour accélérer ton business.
                </h6>
                <div className="flex items-center gap-4">
                  <Button
                    className="bg-[#a85e49] text-white h-14 hover:bg-[#a85e49]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <Link href="/devenir-membre">Découvre nos événements</Link>
                  </Button>
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    className="cursor-pointer w-14 h-14 backdrop-blur-lg bg-white text-black rounded-full flex md:hidden items-center justify-center flex-col gap-2 hover:bg-black/60 transition-colors"
                    aria-label="Lire la vidéo"
                  >
                    <Play className="w-6 h-6 text-black" fill="#000" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="relative md:mb-4 h-full lg:min-h-[500px] w-full overflow-hidden">
              <Image
                src="/images/img-comm-1.jpg"
                alt="Temoignage"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 cursor-pointer w-[100px] h-[100px] backdrop-blur-lg bg-black/50 rounded-full flex items-center justify-center text-white flex-col gap-2 hover:bg-black/60 transition-colors"
                aria-label="Lire la vidéo"
              >
                <Play className="w-10 h-10 text-white" />
              </button>
            </div>

            <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
              <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden border-0 bg-black">
                <DialogTitle className="sr-only">
                  Vidéo de présentation Club M
                </DialogTitle>
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1`}
                    title="Vidéo YouTube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockCommunaute;
