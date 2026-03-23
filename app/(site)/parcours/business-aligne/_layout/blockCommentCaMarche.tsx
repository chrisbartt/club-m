import { Clock, FileText } from "lucide-react";

const BlockCommentCaMarche = () => {
  const steps = [
    {
      number: 1,
      title: "Définition de l'idée",
      description: "Présente ton idée de business en détail via notre formulaire guidé.",
      duration: "1 semaine",
      icon: Clock,
    },
    {
      number: 2,
      title: "Analyse de cohérence",
      description: "Notre équipe analyse ton projet et sa cohérence avec ta vie.",
      duration: "1-2 semaines",
      icon: Clock,
    },
    {
      number: 3,
      title: "Session de feedback",
      description: "Un échange en visio pour discuter de l'analyse avec Maurelle.",
      duration: "1h de session",
      icon: Clock,
    },
    {
      number: 4,
      title: "Plan d'action",
      description: "Tu reçois ta restitution avec les prochaines étapes recommandées.",
      duration: "Document final",
      icon: FileText,
    },
  ];

  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-[#f8f8f8]">
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-2xl mx-auto lg:mb-14">
          <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
            COMMENT ÇA MARCHE
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
          </h3>
          <h2 className="text-2xl lg:text-4xl font-medium text-center text-[#091626] mb-4">
            Un parcours en 4 étapes
          </h2>
          <p className="text-muted-foreground mb-6 lg:text-[18px] text-[16px]">
            Nous t&apos;accompagnons pas à pas pour clarifier ton idée
          </p>
        </div>

        <div className="grid grid-cols-12 lg:gap-6 gap-4">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="col-span-12 lg:col-span-3">
                <div className="card lg:p-8 p-4 rounded-2xl bg-[#ffffff] h-full shadow-[0_10px_24px_#0000000a] border border-[#0000000f]">
                  {/* Numéro */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#a55b46] flex items-center justify-center text-white text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>

                  {/* Titre */}
                  <h4 className="text-xl lg:text-2xl font-medium text-[#091626] mb-3 text-center">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-muted-foreground lg:text-[16px] text-[14px] mb-4 text-center">
                    {step.description}
                  </p>

                  {/* Durée */}
                  <div className="flex items-center justify-center gap-2 text-sm text-[#a55b46]">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{step.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlockCommentCaMarche;
