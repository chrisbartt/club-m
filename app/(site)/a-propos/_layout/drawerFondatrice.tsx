import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDrawer } from "@/context/drawer-context";
import { X, Check } from "lucide-react";
import Image from "next/image";

const DrawerFondatrice = () => {
  const { isDrawerOpen, closeDrawer } = useDrawer();

  return (
    <Sheet
      open={isDrawerOpen("DrawerFondatrice")}
      onOpenChange={() => closeDrawer("DrawerFondatrice")}
    >
      <SheetContent className="border-0 bg-bgCard w-[640px] max-w-[100%!important] sm:max-w-[100%!important] [&>button]:hidden p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-colorBorder">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[18px] font-semibold text-[#151516]">
              Mot de la fondatrice
            </SheetTitle>
            <Button
              onClick={() => closeDrawer("DrawerFondatrice")}
              className="p-2 h-auto cursor-pointer rounded-full bg-transparent hover:bg-bgGray hover:text-colorTitle transition-colors group shadow-none"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-colorMuted group-hover:text-colorTitle" />
            </Button>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 pt-0">
          <div className="relative h-[240px] lg:h-[400px] rounded-xl overflow-hidden shrink-0">
            <Image
              src="/images/morelle-min.jpg"
              alt={"Morelle"}
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="mt-3 mb-3">
            <h5 className="text-[#151516] lg:text-[24px] text-[16px] font-medium">
              Maurelle Kitebi Loambo
            </h5>
            <p className="text-[#a45a45]">
                Fondatrice du club M
            </p>
          </div>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            Je suis Maurelle Kitebi Loambo. Business consultant, entrepreneure
            depuis plus de 15 ans et titulaire d’un MBA. Mais au-delà des
            titres, je suis aussi épouse, mère de trois enfants et salariée dans
            une entreprise publique.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            Comme beaucoup de femmes, j&apos;ai longtemps jonglé entre mon
            travail, ma famille et mes projets entrepreneuriaux. Pendant
            plusieurs années, j&apos;ai lancé différentes activités. J&apos;ai
            essayé, appris, ajusté. Certaines expériences ont été
            enrichissantes. D&apos;autres ont été beaucoup plus difficiles.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            À un moment de mon parcours, j’ai dû prendre une décision
            douloureuse :fermer mon salon de beauté et mon restaurant. Avec du
            recul, j&apos;ai compris quelque chose d’essentiel.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            Ce n&apos;était pas un manque d’ambition. Ce n&apos;était pas un
            manque de travail.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            C&apos;était surtout un manque de cadre, de méthode et
            d’accompagnement. Et surtout… un manque d’environnement.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            Je n&apos;étais pas entourée de personnes qui vivaient les mêmes
            réalités entrepreneuriales. Je n&apos;avais pas accès à un espace où
            poser mes questions, partager mes difficultés et apprendre des
            expériences des autres.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            C&apos;est exactement pour cette raison que j’ai créé Le Club M.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            Aujourd&apos;hui, Le Club M est une communauté stratégique de 88
            membres, pensée pour aider les femmes entrepreneures à transformer
            leurs projets en entreprises solides, organisées et crédibles.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            Un espace où les femmes peuvent :
          </p>
          <ul className="flex flex-wrap gap-3 mb-3">
            <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
              <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              Se connecte
            </li>
            <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
              <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              Apprendre
            </li>
            <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
              <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              Partager leurs expériences
            </li>
            <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#f8f8f8] rounded-full">
              <div className="icon flex items-center justify-center w-6 h-6 bg-[#a55b46] rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              Et surtout grandir ensemble
            </li>
          </ul>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            <span className="font-medium text-[#151516]">
              Ma vision est simple :
            </span>{" "}
            créer un espace où les femmes entrepreneures africaines peuvent
            trouver la méthode, le réseau et le soutien dont elles ont besoin
            pour transformer leur ambition en business réel et durable.
          </p>
          <p className="text-muted-foreground mb-3 lg:text-[16px] text-[14px]">
            <span className="font-medium text-[#151516]">
              Parce que je suis convaincue d’une chose :
            </span>{" "}
            Quand une femme est entourée, structurée et soutenue, elle peut
            aller beaucoup plus loin que ce qu’elle imaginait.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerFondatrice;
