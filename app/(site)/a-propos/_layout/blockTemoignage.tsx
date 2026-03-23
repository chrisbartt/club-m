import Image from "next/image";
import { Calendar, Instagram, Play, LinkIcon } from "lucide-react";
import Link from "next/link";

const TEMOIGNAGES = [
  {
    id: "1",
    image: "/images/apropos-temoignage-1.jpg",
    title: "Un moment fort du Club M",
    description: "Retour en images sur nos événements.",
    link: "https://www.instagram.com/p/DVEUC0xghVi/",
    type: "Post",
    date: "10 Mar 2026",
  },
  {
    id: "2",
    image: "/images/apropos-temoignage-2.jpg",
    title: "La force de la communauté",
    description: "Quand les femmes s'entraident, tout change.",
    link: "https://www.instagram.com/p/DSkD7OCAnIB/",
    type: "Post",
    date: "1 Mar 2026",
  },
  {
    id: "3",
    image: "/images/apropos-temoignage-3.jpg",
    title: "Ensemble, on va plus loin",
    description: "Des rencontres qui transforment les parcours.",
    link: "https://www.instagram.com/p/DSHuhEYgrft/",
    type: "Post",
    date: "25 Fév 2026",
  },
];

const BlockTestimonial = () => {
  return (
    <div className="block-temoignage lg:py-[100px] py-[50px] bg-[#f5f5f5]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden 2xl:block"></div>
          <div className="col-span-12 2xl:col-span-10">
            {/* Header */}
            <div className="text-center lg:max-w-2xl mx-auto mb-6 lg:mb-10">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Témoignages
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-[#091626] mb-0 tracking-[-0.02em]">
              Elles en parlent.
              </h2>
            </div>

            {/* Grille de témoignages — même style que blockBlog */}
            <div className="grid grid-cols-12 lg:gap-6 gap-4">
              {TEMOIGNAGES.map((t) => (
                <div key={t.id} className="col-span-12 lg:col-span-4">
                  <div className="card h-full overflow-hidden">
                    <Link
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative lg:h-[470px] h-[300px] w-full overflow-hidden rounded-xl group cursor-pointer"
                    >
                      <Image
                        src={t.image}
                        alt={t.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      {/* Overlay sombre */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
                      {/* Bouton play central */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                          <LinkIcon
                            size={20}
                            className="text-[#a55b46] ml-1"
                            
                          />
                        </div>
                      </div>
                      {/* Badge type */}
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm text-white flex items-center gap-1.5">
                        <Instagram size={14} />
                        <span>{t.type}</span>
                      </div>
                      <div className="absolute bottom-3 left-0 w-full p-5 hidden">
                        <span className="inline-flex items-center gap-1.5 text-white/80 text-xs mb-3">
                          <Calendar size={12} />
                          {t.date}
                        </span>
                        <h4 className="text-xl lg:text-[24px] font-medium text-[#ffffff] lg:pr-10 mb-1">
                          {t.title}
                        </h4>
                        <p className="text-[#ffffff] lg:text-[16px] text-[14px]">
                          {t.description}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 hidden 2xl:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockTestimonial;
