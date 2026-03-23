import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="banner-business-aligne relative z-10 min-h-[80vh] lg:min-h-[90vh]">
      {/* Image en arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full -z-20">
        <Image
          src="/images/banner3.jpg"
          alt="Business Aligné"
          fill
          className="object-cover"
        />
      </div>
      {/* Overlay sombre */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-40"></div>

      <div className="content-banner lg:min-h-[90vh] flex flex-col justify-center pt-[140px] lg:py-[100px] py-[50px]">
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid grid-cols-12 gap-6 lg:gap-10">
            {/* Colonne gauche - Contenu principal */}
            <div className="col-span-12 lg:col-span-7">
              <h1 className="text-3xl lg:text-5xl font-medium text-white mb-4">
                Clarifie ton idée de business avant de te lancer
              </h1>
              <p className="text-white text-base lg:text-xl mb-8 opacity-90">
                Le Business Aligné te permet de vérifier si ton idée est réaliste, cohérente et alignée avec ta vie personnelle et professionnelle, avant de passer à l&apos;action et développer votre activité.
              </p>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-[#a55b46] mb-1">
                    150+
                  </div>
                  <div className="text-sm lg:text-base text-white opacity-90">
                    Femmes accompagnées
                  </div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-[#a55b46] mb-1">
                    4 sem
                  </div>
                  <div className="text-sm lg:text-base text-white opacity-90">
                    Durée moyenne
                  </div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-[#a55b46] mb-1">
                    92%
                  </div>
                  <div className="text-sm lg:text-base text-white opacity-90">
                    Satisfaction
                  </div>
                </div>
              </div>

              {/* Boutons CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg flex items-center gap-2"
                  asChild
                >
                  <Link href="/parcours/business-aligne/commencer">
                    Commencer maintenant <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  className="bg-white text-[#091626] h-12 hover:bg-white/90 hover:text-[#091626] cursor-pointer transition-all duration-300 rounded-lg"
                  asChild
                >
                  <Link href="#comment-ca-marche">
                    Comment ça marche ?
                  </Link>
                </Button>
              </div>
            </div>

            {/* Colonne droite - Box "Ce que tu obtiens" */}
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 shadow-xl">
              <h3 className="text-xl lg:text-2xl font-semibold text-[#091626] mb-6">
                Ce que tu obtiens
              </h3>
              
              <div className="space-y-6">
                {/* Avantage 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base lg:text-lg font-semibold text-[#091626] mb-1">
                      Une idée clarifiée
                    </h4>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Ton idée devient concrète, simple à expliquer et à comprendre par tous.
                    </p>
                  </div>
                </div>

                {/* Avantage 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base lg:text-lg font-semibold text-[#091626] mb-1">
                      Un avis structuré
                    </h4>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Un retour honnête et bienveillant sur la cohérence de ton projet.
                    </p>
                  </div>
                </div>

                {/* Avantage 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base lg:text-lg font-semibold text-[#091626] mb-1">
                      La prochaine étape claire
                    </h4>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Savoir si tu dois ajuster, pivoter ou passer à l&apos;action avec nos ateliers et ressources.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Banner;
