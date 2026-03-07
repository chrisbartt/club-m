import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlockFaq = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-[#f8f8f8] relative z-30">
      <div className="img-bg absolute inset-0 -z-10">
        <div className="overlay absolute inset-0 z-10 bg-black opacity-50"></div>
        <Image src="/images/img-faq.jpg" alt="FAQ" fill className="object-cover" />
      </div>
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-1 hidden lg:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center">
              <div className="col-span-12 lg:col-span-6">
                <div >
                  <h3 className="text-base uppercase font-semibold text-[#ffffff] mb-3 relative inline-block pb-3">
                    QUESTIONS FRÉQUENTES
                    <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
                  </h3>
                  <h4 className="text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-[#ffffff] mb-3">
                    Toutes tes questions, <br /> nos réponses
                  </h4>
                  <p className="text-white opacity-80 text-[18px] mb-6">
                    Nous sommes là pour vous aider. Contactez-nous pour toute question ou demande.
                  </p>
                  <Button
                  className="bg-[#a55b46] text-white h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                  asChild
                >
                  <Link href="/contact">
                    Contactez-nous
                  </Link>
                </Button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-2xl bg-white"
                  defaultValue="item-1"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg lg:text-xl font-medium text-[#091626] px-5 py-6 border-[#0000000f]">
                      Que se passe-t-il après le Business Aligné?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-5 pb-6">
                      <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                        Après le Business Aligné, vous pouvez approfondir avec
                        nos Ateliers & Masterclass ou développer votre
                        visibilité via l&apos;Annuaire Business. Ces ressources
                        vous aideront à passer à l&apos;action et à structurer
                        votre développement entrepreneurial.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg lg:text-xl font-medium text-[#091626] px-5 py-6 border-[#0000000f]">
                      Que se passe-t-il si mon idée n&apos;est pas validée ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-5 pb-6">
                      <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                        Nous te donnons un retour constructif avec des pistes
                        d&apos;amélioration. Tu peux soit ajuster ton idée et
                        revenir, soit explorer d&apos;autres opportunités avec
                        notre aide.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg lg:text-xl font-medium text-[#091626] px-5 py-6 border-[#0000000f]">
                      Dois-je avoir une idée entièrement développée pour
                      commencer?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-5 pb-6">
                      <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                        Non ! Le Business Aligné est justement conçu pour
                        clarifier votre idée, même si elle est encore floue.
                        Nous vous aidons à la structurer et à valider sa
                        cohérence avant d&apos;avancer.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockFaq;
