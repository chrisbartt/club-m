import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BlockFaq = () => {
  return (
    <div className="block-intro lg:py-[100px] bg-white py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-2 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-8">
            <div className="lg:max-w-3xl mx-auto">
              <div className="flex justify-center">
                <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3 text-center">
                  FAQ
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
                </h3>
              </div>
              <h4 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-black mb-2 lg:mb-6 tracking-[-0.02em] text-center">
                Questions fréquentes
              </h4>
            </div>
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-2xl bg-[#f8f8f8]"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1 ">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  Qu’est-ce que le Club M ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Le Club M est une communauté de femmes entrepreneures qui
                    veulent développer un business aligné et rentable ? Tu y
                    trouves un réseau, des ressources concrètes et des
                    opportunités pour structurer ton activité, trouver des
                    clientes et avancer entourée.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  À qui s’adresse le Club M ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Le Club M s’adresse aux femmes qui ont un projet, un side
                    business ou une activité déjà lancée et qui veulent passer
                    au niveau supérieur. Que tu sois au début de ton projet ou
                    déjà entrepreneure, tu trouveras un espace pour apprendre,
                    échanger et créer des opportunités.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  Quelle est la différence entre Free, Premium et Business ?
                  Free
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h6 className="mb-1 text-black text-lg font-semibold">
                        Free
                      </h6>
                      <p className="text-muted-foreground text-sm lg:text-base">
                        Découvre l’univers du Club M et fais tes premières
                        connexions dans la communauté.
                      </p>
                    </div>
                    <div>
                      <h6 className="mb-1 text-black text-lg font-semibold">
                        Premium
                      </h6>
                      <p className="text-muted-foreground text-sm lg:text-base">
                        Structure ton business, gagne en visibilité et profite
                        d’avantages sur nos produits et services.
                      </p>
                    </div>
                    <div>
                      <h6 className="mb-1 text-black text-lg font-semibold">
                        Business
                      </h6>
                      <p className="text-muted-foreground text-sm lg:text-base">
                        Accède à plus d’opportunités de collaboration, de
                        visibilité et de croissance pour ton business.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  Puis-je commencer gratuitement ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Oui. L’abonnement Free te permet de découvrir la communauté
                    et l’univers du Club M.
                  </p>
                  <p className="text-muted-foreground text-sm lg:text-base mb-2">
                    Tu peux ensuite évoluer vers Premium ou Business selon les
                    besoins de ton business.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  Je ne connais personne dans la communauté. Est-ce que je vais
                  m’y sentir à ma place ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Oui. L’abonnement Free te permet de découvrir la communauté
                    et l’univers du Club M.
                  </p>
                  <p className="text-muted-foreground text-sm lg:text-base mb-2">
                    Oui. Beaucoup de membres arrivent avec cette même question.
                    <br />
                    Le Club M est justement conçu pour créer des connexions
                    entre femmes qui vivent les mêmes défis entrepreneuriaux.
                    Très vite, tu réalises que tu n’es plus seule dans ton
                    parcours.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  Est-ce que le Club M peut vraiment m’aider à développer mon
                  business ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Oui. Le Club M favorise les connexions, la visibilité et les
                    collaborations entre membres.
                  </p>
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Beaucoup d’entrepreneures y trouvent des clientes, des
                    partenaires et un environnement qui les aide à structurer et
                    développer leur activité.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  Puis-je changer ou arrêter mon abonnement ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Oui. Tu peux évoluer vers un autre abonnement ou arrêter à
                    tout moment selon les besoins de ton business.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium text-black px-4 py-4 md:px-5 md:py-6 border-[#0000000f] text-left">
                  Que se passe-t-il après mon inscription ?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 pb-4 md:px-5 md:pb-6">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Dès ton inscription, tu entres dans l’univers du Club M. Tu
                    reçois les informations pour accéder à la communauté,
                    rejoindre les espaces d’échange et profiter des ressources
                    et opportunités réservées aux membres.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="col-span-2 hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockFaq;
