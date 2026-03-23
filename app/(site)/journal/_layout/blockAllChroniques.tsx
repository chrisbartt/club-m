// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

type Category = "tous" | "entrepreneuriat" | "temoignages" | "actualites";

interface Chronique {
  id: string;
  category: Category;
  date: string;
  title: string;
  description: string;
  image: string;
  badgeColor: string;
  badgeText: string;
}

const BlockAllChroniques = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("tous");
  const [searchQuery, setSearchQuery] = useState("");

  // Liste des chroniques
  const chroniques: Chronique[] = [
    {
      id: "1",
      category: "temoignages",
      date: "28 Jan 2025",
      title: "De l'idée à la croissance : le parcours de Michelle",
      description: "Comment elle a structuré sa boutique mode et triplé son chiffre d'affaires grâce à Club M.",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=800",
      badgeColor: "bg-yellow-400",
      badgeText: "Témoignage",
    },
    {
      id: "2",
      category: "entrepreneuriat",
      date: "24 Jan 2025",
      title: "5 erreurs à éviter quand on lance son business en RDC",
      description: "Les pièges courants et nos conseils pour réussir votre lancement.",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      badgeColor: "bg-[#a55b46]",
      badgeText: "Entrepreneuriat",
    },
    {
      id: "3",
      category: "actualites",
      date: "20 Jan 2025",
      title: 'Retour sur notre atelier "Pitch parfait" de janvier',
      description: "Plus de 40 entrepreneures ont participé. Les moments forts en images.",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
      badgeColor: "bg-green-500",
      badgeText: "Actualités",
    },
    {
      id: "4",
      category: "entrepreneuriat",
      date: "18 Jan 2025",
      title: "Comment structurer son business plan en 5 étapes",
      description: "Un guide pratique pour créer un business plan solide et convaincant.",
      image: "https://images.pexels.com/photos/7688332/pexels-photo-7688332.jpeg?auto=compress&cs=tinysrgb&w=800",
      badgeColor: "bg-[#a55b46]",
      badgeText: "Entrepreneuriat",
    },
    {
      id: "5",
      category: "temoignages",
      date: "15 Jan 2025",
      title: "De zéro à 100 clients : l'histoire de Sarah",
      description: "Comment Club M a aidé Sarah à développer sa clientèle et atteindre ses objectifs.",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=800",
      badgeColor: "bg-yellow-400",
      badgeText: "Témoignage",
    },
    {
      id: "6",
      category: "actualites",
      date: "12 Jan 2025",
      title: "Nouveau partenariat avec Rawbank Lady's First",
      description: "Découvrez les nouvelles opportunités de financement pour les membres Club M.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      badgeColor: "bg-green-500",
      badgeText: "Actualités",
    },
  ];

  // Filtrer les chroniques
  const filteredChroniques = useMemo(() => {
    return chroniques.filter((chronique) => {
      // Filtre par catégorie
      const matchesCategory =
        selectedCategory === "tous" || chronique.category === selectedCategory;

      // Filtre par recherche
      const matchesSearch =
        searchQuery === "" ||
        chronique.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chronique.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories: { key: Category; label: string }[] = [
    { key: "tous", label: "Tous les articles" },
    { key: "entrepreneuriat", label: "Entrepreneuriat" },
    { key: "temoignages", label: "Témoignages" },
    { key: "actualites", label: "Actualités club M" },
  ];

  return (
    <div className="block-contact lg:py-[100px] py-[50px] bg-[#f5f5f5] relative z-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 gap-4 items-center lg:mb-16 mb-6 lg:mt-[-128px]">
              <div className="col-span-12 lg:col-span-8">
                <div className="filters-category text-center flex">
                  <ul className="list-ctegory flex white-space-nowrap gap-2 overflow-x-auto p-2 rounded-lg bg-white">
                    {categories.map((category) => (
                      <li key={category.key}>
                        <button
                          onClick={() => setSelectedCategory(category.key)}
                          className={`rounded-md py-3 px-5 text-sm inline-flex items-center justify-center font-medium transition-colors cursor-pointer ${
                            selectedCategory === category.key
                              ? "text-[#091626] bg-[#f5f5f5]"
                              : "text-[#091626] hover:bg-[#f5f5f5]/50"
                          }`}
                        >
                          {category.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center relative w-full">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search size={18} className="text-[#a55b46]" />
                    </div>
                    <Input
                      placeholder="Rechercher un article"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-sm pl-10 border-none shadow-none bg-white h-[42px] rounded-lg placeholder:text-muted-foreground placeholder:opacity-70"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grille d'articles */}
            {filteredChroniques.length > 0 ? (
              <div className="grid grid-cols-12 lg:gap-6 gap-4 mb-10">
                {filteredChroniques.map((chronique) => (
                  <div key={chronique.id} className="col-span-12 lg:col-span-4">
                    <Link href={`/journal/${chronique.id}`}>
                      <div className="card rounded-2xl bg-[#ffffff] h-full hover:shadow-[0_10px_24px_#0000000a] transition-all duration-300 overflow-hidden border border-[#0000000f] p-3">
                        {/* Image */}
                        <div className="relative h-52 w-full overflow-hidden rounded-lg group">
                          <Image
                            src={chronique.image}
                            alt={chronique.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          {/* Badge */}
                          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-sm text-white">
                            <span>{chronique.badgeText}</span>
                          </div>
                        </div>

                        <div className="p-3">
                          <p className="text-[#a55b46] text-sm mb-2">
                            {chronique.date}
                          </p>
                          <h4 className="text-xl lg:text-2xl font-medium text-[#091626] mb-3">
                            {chronique.title}
                          </h4>
                          <p className="text-muted-foreground lg:text-[16px] text-[14px]">
                            {chronique.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Aucun article trouvé pour cette recherche.
                </p>
              </div>
            )}
          </div>
          <div className="col-span-1 hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockAllChroniques;
