import Image from "next/image";
import { Calendar, Instagram, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BLOG_ARTICLES = [
  {
    id: "1",
    image: "/images/actus-1.jpg",
    title: "Tu choisis mal tes investissements !",
    description:
      "Le problème, c’est que tu mets TOUT dedans et RIEN dans ce qui pourrait te faire gagner plus d’argent.",
    link: "https://www.instagram.com/reel/DSp2mRBAs2l/",
    type: "Reel",
    date: "12 Mar 2026",
  },
  {
    id: "2",
    image: "/images/actus-2.jpg",
    title: "Raïssa était au Businesswomen Lunch",
    description:
      "L’événement où les femmes entrepreneures se connectent, apprennent et transforment chaque rencontre en opportunité de business.",
    link: "https://www.instagram.com/reel/DUC9Wa8Atoj/",
    type: "Reel",
    date: "5 Mar 2026",
  },
  {
    id: "3",
    image: "/images/actus-3.jpg",
    title: "Ce qu’on ne voit pas sur les photos",
    description: "Beaucoup de femmes entrepreneures avancent en silence.",
    link: "https://www.instagram.com/p/DU3cBevAp7A/",
    type: "Post",
    date: "28 Fév 2026",
  },
];

const BlockBlog = () => {
  return (
    <div className="block-intro lg:py-[100px] bg-[#ffffff] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden 2xl:block"></div>
          <div className="col-span-12 2xl:col-span-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-10">
              <div className="flex-1 text-center max-w-3xl mx-auto">
                <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3 flex items-center gap-2">
                  Le Journal du Club M
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
                </h3>
                <h2 className="text-2xl lg:text-[44px] leading-[1.2] font-semibold text-[#091626] mb-0 tracking-[-0.02em]">
                  Des contenus stratégiques pour t&apos;aider à structurer,
                  vendre et évoluer.
                </h2>
              </div>
            </div>

            {/* Grille d’articles */}
            <div className="grid grid-cols-12 lg:gap-6 gap-4 mb-10">
              {BLOG_ARTICLES.map((article) => (
                <div key={article.id} className="col-span-12 lg:col-span-4">
                  <div className="card h-full overflow-hidden">
                    {/* Miniature avec bouton play */}
                    <Link
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative lg:h-[470px] h-[300px] w-full overflow-hidden rounded-xl group cursor-pointer overflow-hidden"
                    >
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      {/* Overlay sombre */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
                      {/* Bouton play central */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                          <Play
                            size={20}
                            className="text-[#a55b46] ml-1"
                            fill="#a55b46"
                          />
                        </div>
                      </div>
                      {/* Badge type */}
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm text-white flex items-center gap-1.5">
                        <Instagram size={14} />
                        <span>{article.type}</span>
                      </div>
                      <div className="absolute bottom-3 left-0 w-full p-5">
                      <span className="inline-flex items-center gap-1.5 text-white/80 text-xs mb-2">
                        <Calendar size={12} />
                        {article.date}
                      </span>
                      <h4 className="text-xl lg:text-[24px] font-medium text-[#ffffff] lg:pr-10">
                        {article.title}
                      </h4>
                      <p className="text-muted-foreground lg:text-[16px] text-[14px] mb-4 hidden">
                        {article.description}
                      </p>
                      {/* Bouton voir sur Instagram */}
                     
                    </div>
                    </Link>
                  </div>
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
