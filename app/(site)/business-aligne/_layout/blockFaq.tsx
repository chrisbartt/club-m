import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BlockFaq = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-[#f8f8f8]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-2 hidden lg:block"></div>
          <div className="col-span-12 lg:col-span-8">
            <div className="text-center mb-8">
              <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
                QUESTIONS FRÉQUENTES
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-[#091626] mb-6">
                Toutes tes questions, <br /> nos réponses
              </h4>
            </div>
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-2xl bg-white"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg lg:text-xl font-medium text-[#091626] cursor-pointer px-5 py-6 border-[#0000000f]">
                  Que se passe-t-il après le Business Aligné?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-5 pb-6">
                  <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                    Après le Business Aligné, vous pouvez approfondir avec nos
                    Ateliers & Masterclass ou développer votre visibilité via
                    l&apos;Annuaire Business. Ces ressources vous aideront à
                    passer à l&apos;action et à structurer votre développement
                    entrepreneurial.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg lg:text-xl font-medium text-[#091626] cursor-pointer px-5 py-6 border-[#0000000f]">
                  Que se passe-t-il si mon idée n&apos;est pas validée ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-5 pb-6">
                  <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                    Nous te donnons un retour constructif avec des pistes
                    d&apos;amélioration. Tu peux soit ajuster ton idée et
                    revenir, soit explorer d&apos;autres opportunités avec notre
                    aide.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg lg:text-xl font-medium text-[#091626] cursor-pointer px-5 py-6 border-[#0000000f]">
                  Dois-je avoir une idée entièrement développée pour commencer?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-5 pb-6">
                  <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                    Non ! Le Business Aligné est justement conçu pour clarifier
                    votre idée, même si elle est encore floue. Nous vous aidons
                    à la structurer et à valider sa cohérence avant
                    d&apos;avancer.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="col-span-2 hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockFaq;
