"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlightItems = [
  "Une vision claire et alignée avec ses valeurs personnelles",
  "Un positionnement différenciant sur le marché",
  "Une cible cliente précise et identifiée",
  "La confiance pour avancer sans douter",
];

const relatedArticles = [
  {
    id: "2",
    category: "Témoignage",
    title: "Grace : Comment le réseau Club M a transformé mon activité",
    description: "Découvrez le parcours de Grace et l'impact du réseau Club M sur son activité.",
    date: "24 Jan 2025",
    image: "/images/banner7.jpg",
  },
  {
    id: "3",
    category: "Entrepreneuriat",
    title: "Comment construire une offre commerciale qui séduit vos clientes",
    description: "Les clés pour structurer une offre qui attire et fidélise votre cible.",
    date: "20 Jan 2025",
    image: "/images/banner4.jpg",
  },
  {
    id: "4",
    category: "Actualités",
    title: "Club M lance son nouveau programme de mentorat 2025",
    description: "Un programme inédit pour accompagner les entrepreneures dans leur croissance.",
    date: "18 Jan 2025",
    image: "/images/banner1.jpg",
  },
];

const BlockArticle = () => {
  return (
    <>
      
      {/* Corps de l'article */}
      <div className="block-intro lg:py-[60px] py-8 bg-[#f8f8f8]">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2 hidden lg:block" />
            <article className="col-span-12 lg:col-span-8">
              <div>
                <div className="text-[#091626] text-base md:text-lg leading-[1.85]">
                  <p className="mb-6">
                    <strong className="text-[#091626]">
                      Il y a deux ans, Michelle avait un rêve :
                    </strong>{" "}
                    créer une boutique de mode qui mettrait en valeur les créations
                    africaines contemporaines. Aujourd&apos;hui, Mika Fashion emploie 3
                    personnes et vient de signer un partenariat avec une chaîne de
                    distribution locale. Voici son histoire.
                  </p>

                  <h2 className="text-[#091626] text-xl md:text-2xl font-semibold mt-10 mb-4 leading-tight tracking-[-0.02em]">
                    Le déclic : passer de l&apos;idée à l&apos;action
                  </h2>
                  <p className="mb-6 text-[#717b86]">
                    Comme beaucoup d&apos;entrepreneures, Michelle avait cette idée
                    qui tournait dans sa tête depuis des années. &quot;Je savais que je
                    voulais faire quelque chose dans la mode, mais je ne savais pas par
                    où commencer. J&apos;avais peur de me lancer, peur d&apos;échouer,
                    peur de ne pas être à la hauteur.&quot;
                  </p>
                  <p className="mb-6 text-[#717b86]">
                    C&apos;est en participant à un événement gratuit organisé par Club
                    M qu&apos;elle a eu le déclic. &quot;J&apos;ai rencontré d&apos;autres
                    femmes qui avaient les mêmes doutes que moi, mais qui avançaient
                    quand même. Ça m&apos;a donné le courage de franchir le pas.&quot;
                  </p>

                  <blockquote className="bg-[#f8f9fc] border-l-4 border-[#a55b46] py-5 px-6 md:px-8 my-8 rounded-r-2xl italic text-[#091626] text-base">
                    &quot;Le parcours Club M m&apos;a donné la confiance et les outils
                    pour transformer mon rêve en réalité. Ce n&apos;est pas juste une
                    formation, c&apos;est une transformation complète.&quot;
                  </blockquote>

                  <h2 className="text-[#091626] text-xl md:text-2xl font-semibold mt-10 mb-4 leading-tight tracking-[-0.02em]">
                    Structuration & Vision : clarifier son offre
                  </h2>
                  <p className="mb-6 text-[#717b86]">
                    Les ateliers Club M ont été décisifs pour Michelle. &quot;Au début,
                    j&apos;avais une idée, mais je ne savais pas comment la structurer
                    ou la présenter. Les workshops m&apos;ont donné les outils pour
                    affiner mon offre et clarifier ma vision.&quot;
                  </p>
                  <p className="mb-6 text-[#717b86]">
                    À travers les ateliers &quot;Business Aligné&quot; et les sessions
                    de coaching, Michelle a identifié sa cible (femmes actives de 25-45
                    ans cherchant des vêtements professionnels avec une touche
                    africaine), son positionnement (mode africaine contemporaine,
                    qualité premium, prix accessibles), et ses valeurs (authenticité,
                    qualité, empowerment féminin).
                  </p>

                  {/* Encadré highlight */}
                  <div className="bg-[#091626] rounded-2xl p-6 md:p-8 my-10 border border-[#091626]">
                    <h4 className="text-[#a55b46] text-lg font-semibold mb-4">
                      Ce que Michelle a obtenu grâce aux ateliers Club M :
                    </h4>
                    <ul className="space-y-3 list-none p-0 m-0">
                      {highlightItems.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-white/90 text-sm md:text-base"
                        >
                          <Check className="w-5 h-5 text-[#a55b46] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h2 className="text-[#091626] text-xl md:text-2xl font-semibold mt-10 mb-4 leading-tight tracking-[-0.02em]">
                    Communauté & Réseau : les clés de sa croissance
                  </h2>
                  <p className="mb-6 text-[#717b86]">
                    Mais le vrai tournant a été sa présence active dans la communauté
                    Club M. &quot;Les ateliers m&apos;ont outillée, mais ce sont les
                    Business Lunchs et l&apos;annuaire qui ont vraiment accéléré ma
                    croissance. J&apos;ai rencontré mes premières clientes, mais aussi
                    des partenaires que je n&apos;aurais jamais trouvées seule.&quot;
                  </p>
                  <p className="mb-4 text-[#091626] font-medium">Michelle a tiré parti des avantages du réseau Club M :</p>
                  <ul className="mb-6 pl-6 space-y-2 text-[#717b86] list-disc">
                    <li>Les Business Lunchs mensuels où elle a présenté Mika Fashion et reçu des premiers commandements</li>
                    <li>L&apos;annuaire business qui lui a permis de développer des partenariats (fabricants, logistique)</li>
                    <li>Les sessions de coaching personnalisé pour affiner son modèle économique</li>
                    <li>La visibilité accrue auprès des autres membres et de la communauté élargie</li>
                  </ul>

                  <blockquote className="bg-[#f8f9fc] border-l-4 border-[#a55b46] py-5 px-6 md:px-8 my-8 rounded-r-2xl italic text-[#091626] text-base">
                    &quot;Je n&apos;aurais jamais pu atteindre ces résultats sans le
                    réseau Club M. C&apos;est une famille professionnelle.&quot;
                  </blockquote>

                  {/* CTA mid-article */}
                  <div className="bg-[#a55b46] rounded-2xl p-8 md:p-10 my-10 text-center">
                    <h3 className="text-white text-xl md:text-2xl font-semibold mb-3">
                      Vous aussi, vous avez un projet ?
                    </h3>
                    <p className="text-white/90 text-base mb-6 max-w-xl mx-auto">
                      Rejoignez Club M et accédez à une communauté entrepreneuriale,
                      des ateliers, du networking intensif et une visibilité
                      professionnelle incomparable.
                    </p>
                    <Button
                      asChild
                      className="bg-white text-[#a55b46] hover:bg-white/90 rounded-xl font-semibold h-12 px-6"
                    >
                      <Link href="/devenir-membre">
                        Découvrir les formules
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>

                  <h2 className="text-[#091626] text-xl md:text-2xl font-semibold mt-10 mb-4 leading-tight tracking-[-0.02em]">
                    Aujourd&apos;hui : une entrepreneure épanouie
                  </h2>
                  <p className="mb-6 text-[#717b86]">
                    Deux ans après son lancement, Mika Fashion est devenue une
                    référence de la mode africaine contemporaine à Kinshasa. Michelle
                    emploie maintenant 3 personnes (2 couturières et 1 vendeuse) et
                    vient de signer un partenariat avec une chaîne de distribution
                    locale.
                  </p>
                  <p className="mb-6 text-[#717b86]">
                    &quot;Ce qui me rend le plus fière, ce n&apos;est pas le chiffre
                    d&apos;affaires. C&apos;est de voir que mon rêve est devenu réalité,
                    et que je peux maintenant aider d&apos;autres femmes à vivre de
                    leur passion.&quot;
                  </p>

                  <h3 className="text-[#091626] text-lg md:text-xl font-semibold mt-10 mb-4">
                    Les conseils de Michelle aux futures entrepreneures
                  </h3>
                  <ol className="list-decimal pl-6 mb-6 space-y-3 text-[#717b86]">
                    <li>
                      <strong className="text-[#091626]">N&apos;attendez pas d&apos;être prête.</strong>{" "}
                      &quot;On n&apos;est jamais vraiment prête. Lancez-vous et apprenez en chemin.&quot;
                    </li>
                    <li>
                      <strong className="text-[#091626]">Entourez-vous bien.</strong>{" "}
                      &quot;Rejoindre Club M a été la meilleure décision. Le réseau, les conseils, le soutien… c&apos;est inestimable.&quot;
                    </li>
                    <li>
                      <strong className="text-[#091626]">Croyez en votre projet.</strong>{" "}
                      &quot;Si vous y croyez, les autres y croiront aussi. La confiance, ça se transmet.&quot;
                    </li>
                  </ol>

                  <blockquote className="bg-[#f8f9fc] border-l-4 border-[#a55b46] py-5 px-6 md:px-8 my-8 rounded-r-2xl italic text-[#091626] text-base">
                    &quot;À toutes celles qui hésitent encore : faites le premier pas.
                    Club M sera là pour vous accompagner sur le reste du chemin.&quot;
                  </blockquote>
                </div>

                {/* Pied d'article : tags + partage */}
                <footer className="border-t border-[#e9eef5] pt-8 mt-10">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-sm font-semibold text-[#717b86]">Tags :</span>
                    {["Témoignage", "Mode", "Networking", "Success Story", "Stratégie"].map((tag) => (
                      <Link
                        key={tag}
                        href="/journal"
                        className="px-3 py-1.5 bg-[#f8f9fc] rounded-lg text-sm text-[#091626] hover:bg-[#a55b46]/10 hover:text-[#a55b46] transition-colors border border-[#e9eef5]"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-[#717b86]">Partager :</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-full border-[#e9eef5] bg-white hover:bg-[#a55b46] hover:text-white hover:border-[#a55b46] transition-colors"
                      aria-label="Partager"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </footer>

                {/* Bio auteur */}
                <div className="bg-[#f8f9fc] rounded-2xl p-6 md:p-8 mt-10 flex flex-col sm:flex-row gap-6 items-start border border-[#e9eef5]">
                  <Image
                    src="/images/michelle.jpeg"
                    alt="Michelle T."
                    width={80}
                    height={80}
                    className="rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-[#091626] font-semibold text-lg mb-1">
                      Michelle T.
                    </h4>
                    <p className="text-[#a55b46] font-medium text-sm mb-3">
                      Membre Business Club M · Fondatrice de Mika Fashion
                    </p>
                    <p className="text-[#717b86] text-sm leading-relaxed">
                      Michelle a rejoint Club M en 2023 avec une simple idée.
                      Aujourd&apos;hui, elle dirige Mika Fashion, une marque de mode
                      africaine contemporaine basée à Kinshasa. Elle partage
                      régulièrement son expérience pour inspirer d&apos;autres
                      entrepreneures.
                    </p>
                  </div>
                </div>
              </div>
            </article>
            <div className="col-span-2 hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Articles similaires */}
      <div className="block-intro lg:py-[100px] py-12 bg-[#f5f5f5]">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1 hidden lg:block" />
            <div className="col-span-12 lg:col-span-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="text-[#091626] text-xl md:text-2xl font-semibold tracking-[-0.02em]">
                  Articles similaires
                </h2>
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-[#e9eef5] hover:border-[#a55b46] hover:text-[#a55b46] text-[#091626]"
                  asChild
                >
                  <Link href="/journal">
                    Voir toutes les chroniques
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-12 lg:gap-6 gap-4">
                {relatedArticles.map((item) => (
                  <Link
                    key={item.id}
                    href={`/journal/${item.id}`}
                    className="col-span-12 sm:col-span-6 lg:col-span-4 group"
                  >
                    <div className="card rounded-2xl bg-[#ffffff] h-full hover:shadow-[0_10px_24px_#0000000a] transition-all duration-300 overflow-hidden border border-[#0000000f] p-3">
                      <div className="relative h-52 w-full overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-all duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-sm text-white">
                          <span>{item.category}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[#a55b46] text-sm mb-2">
                          {item.date}
                        </p>
                        <h4 className="text-xl lg:text-2xl font-medium text-[#091626] mb-3">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-1 hidden lg:block" />
          </div>
        </div>
      </div>

    </>
  );
};

export default BlockArticle;
