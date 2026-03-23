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
        <Image
          src="/images/img-faq.jpg"
          alt="FAQ"
          fill
          className="object-cover"
        />
      </div>
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-1 hidden 2xl:block"></div>
          <div className="col-span-12 2xl:col-span-10">
            <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center">
              <div className="col-span-12 lg:col-span-6">
                <div>
                  <h3 className="text-base uppercase font-semibold text-[#ffffff] mb-3 relative inline-block pb-3">
                    QUESTIONS FRÉQUENTES
                    <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
                  </h3>
                  <h4 className="text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-[#ffffff] mb-3">
                    Toutes tes questions, <br /> nos réponses
                  </h4>
                  <p className="text-white opacity-80 text-[18px] mb-6 w-[500px] max-w-full">
                    Nous sommes là pour t&apos;aider. Contacte-nous pour toute question ou demande&nbsp;!
                  </p>
                  <Button
                    className="bg-[#a55b46] text-white h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <Link href="/contact">Contacte-nous</Link>
                  </Button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-2xl bg-black/30 backdrop-blur-[54px] border border-[#ffffff1c]"
                  defaultValue="item-1"
                >
                  <AccordionItem value="item-1" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left cursor-pointer trigger-faq">
                      Qu’est-ce que le Club M ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <p className="text-white text-sm lg:text-base">
                        Le Club M est une communauté de femmes entrepreneures
                        qui veulent développer un business aligné et rentable ?
                        Tu y trouves un réseau, des ressources concrètes et des
                        opportunités pour structurer ton activité, trouver des
                        clientes et avancer entourée.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left cursor-pointer trigger-faq">
                      À qui s’adresse le Club M ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <p className="text-white text-sm lg:text-base">
                        Le Club M s’adresse aux femmes qui ont un projet, un
                        side business ou une activité déjà lancée et qui veulent
                        passer au niveau supérieur. Que tu sois au début de ton
                        projet ou déjà entrepreneure, tu trouveras un espace
                        pour apprendre, échanger et créer des opportunités.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#ffffff1c] text-left cursor-pointer trigger-faq">
                      Quelle est la différence entre Free, Premium et Business ?
                      Free
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <h6 className="mb-1 text-white text-lg font-semibold">
                            Free
                          </h6>
                          <p className="text-white text-sm lg:text-base">
                            Découvre l’univers du Club M et fais tes premières
                            connexions dans la communauté.
                          </p>
                        </div>
                        <div>
                          <h6 className="mb-1 text-white text-lg font-semibold">
                            Premium
                          </h6>
                          <p className="text-white text-sm lg:text-base">
                            Structure ton business, gagne en visibilité et
                            profite d’avantages sur nos produits et services.
                          </p>
                        </div>
                        <div>
                          <h6 className="mb-1 text-white text-lg font-semibold">
                            Business
                          </h6>
                          <p className="text-white text-sm lg:text-base">
                            Accède à plus d’opportunités de collaboration, de
                            visibilité et de croissance pour ton business.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left cursor-pointer trigger-faq">
                      Puis-je commencer gratuitement ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <p className="text-white text-sm lg:text-base">
                        Oui. L’abonnement Free te permet de découvrir la
                        communauté et l’univers du Club M.
                      </p>
                      <p className="text-white text-sm lg:text-base mb-2">
                        Tu peux ensuite évoluer vers Premium ou Business selon
                        les besoins de ton business.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left cursor-pointer trigger-faq">
                      Je ne connais personne dans la communauté. Est-ce que je
                      vais m’y sentir à ma place ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <p className="text-white text-sm lg:text-base">
                        Oui. L’abonnement Free te permet de découvrir la
                        communauté et l’univers du Club M.
                      </p>
                      <p className="text-white text-sm lg:text-base mb-2">
                        Oui. Beaucoup de membres arrivent avec cette même
                        question.
                        <br />
                        Le Club M est justement conçu pour créer des connexions
                        entre femmes qui vivent les mêmes défis
                        entrepreneuriaux. Très vite, tu réalises que tu n’es
                        plus seule dans ton parcours.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left cursor-pointer trigger-faq">
                      Est-ce que le Club M peut vraiment m’aider à développer
                      mon business ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <p className="text-white text-sm lg:text-base">
                        Oui. Le Club M favorise les connexions, la visibilité et
                        les collaborations entre membres.
                      </p>
                      <p className="text-white text-sm lg:text-base">
                        Beaucoup d’entrepreneures y trouvent des clientes, des
                        partenaires et un environnement qui les aide à
                        structurer et développer leur activité.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-7" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left cursor-pointer trigger-faq">
                      Puis-je changer ou arrêter mon abonnement ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <p className="text-white text-sm lg:text-base">
                        Oui. Tu peux évoluer vers un autre abonnement ou arrêter
                        à tout moment selon les besoins de ton business.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-8" className="border-b border-[#ffffff1c]">
                    <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-white px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left cursor-pointer trigger-faq">
                      Que se passe-t-il après mon inscription ?
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                      <p className="text-white text-sm lg:text-base">
                        Dès ton inscription, tu entres dans l’univers du Club M.
                        Tu reçois les informations pour accéder à la communauté,
                        rejoindre les espaces d’échange et profiter des
                        ressources et opportunités réservées aux membres.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden 2xl:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockFaq;
