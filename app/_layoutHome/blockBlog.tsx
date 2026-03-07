import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BLOG_ARTICLES = [
  {
    id: "1",
    image: "/images/actus-1.jpg",
    alt: "L'apparence tue ton business !",
    category: "Instagram",
    date: "24 Décembre 2025",
    title: "Tu choisis mal tes investissements !",
    description:
      "Le problème, c'est que tu mets TOUT dedans et RIEN dans ce qui pourrait te faire gagner plus d'argent.",
    link: "https://www.instagram.com/reel/DSp2mRBAs2l/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: "2",
    image: "/images/actus-2.jpg",
    alt: "Raïssa était au Businesswomen Lunch",
    category: "Instagram",
    date: "28 Janvier 2026",
    title: "Raïssa était au Businesswomen Lunch",
    description:
      "L’événement où les femmes entrepreneures se connectent, apprennent et transforment chaque rencontre en opportunité de business.",
    link: "https://www.instagram.com/reel/DUC9Wa8Atoj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: "3",
    image: "/images/actus-3.jpg",
    alt: "Atelier Pitch parfait",
    category: "Instagram",
    date: "20 Jan 2025",
    title: "Ce qu'on ne voit pas sur les photos",
    description:
      "Beaucoup de femmes entrepreneures avancent en silence.",
    link: "https://www.instagram.com/p/DU3cBevAp7A/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
];

const BlockBlog = () => {
  return (
    <div className="block-intro lg:py-[100px] bg-[#f5f5f5]  py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden 2xl:block"></div>
          <div className="col-span-12 2xl:col-span-10">
            {/* Header avec titre et bouton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-10">
              <div className="flex-1 text-center">
                <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3 flex items-center gap-2">
                  JOURNAL
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
                </h3>
                <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-[#091626] mb-0 tracking-[-0.02em]">
                  Découvrez nos articles
                </h2>
              </div>
            </div>

            {/* Grille d'articles */}
            <div className="grid grid-cols-12 lg:gap-6 gap-4 mb-10">
              {BLOG_ARTICLES.map((article) => (
                <div key={article.id} className="col-span-12 lg:col-span-4">
                  <Link href={article.link} target="_blank">
                    <div className="card rounded-2xl bg-[#ffffff] h-full hover:shadow-[0_10px_24px_#0000000a] transition-all duration-300 overflow-hidden  p-3">
                      <div className="relative h-52 w-full overflow-hidden rounded-lg group">
                        <Image
                          src={article.image}
                          alt={article.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-sm text-white">
                          <span>{article.category}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[#a55b46] text-sm mb-2">
                          {article.date}
                        </p>
                        <h4 className="text-xl lg:text-2xl font-medium text-[#091626] mb-3">
                          {article.title}
                        </h4>
                        <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                          {article.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 hidden 2xl:block"></div>
        </div>

        {/* Bouton CTA */}
        <div className="text-center">
          <Button
            className="bg-[#a55b46] text-white h-14 px-5 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
            asChild
          >
            <Link href="/journal">Explorer le journal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockBlog;
