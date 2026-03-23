"use client";

import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";
import BlockArticle from "./blockInfovents";
import Banner from "./banner";
import { useParams } from "next/navigation";
import BlockStartMembre from "./blockStartMembre";

// Données mock pour l'article (à remplacer par un fetch avec params.id)
const getArticleData = (id: string | undefined) => ({
  id: id ?? "1",
  category: "temoignage" as const,
  categoryLabel: "Témoignage",
  title:
    "De l'idée à l'impact : comment Michelle a bâti son entreprise grâce à Club M",
  author: {
    name: "Michelle T.",
    role: "Membre Business · Secteur Mode",
    avatar: "/images/michelle.jpeg",
  },
  date: "28 Janvier 2025",
  readingTime: "8 min de lecture",
  featuredImage: "/images/maurelle.jpeg",
});

const Container = () => {
  const params = useParams();
  const article = getArticleData(params?.id as string | undefined);

  return (
    <AppContainerWebSite>
      <Banner
        categoryLabel={article.categoryLabel}
        title={article.title}
        featuredImage={article.featuredImage}
        date={article.date}
        readingTime={article.readingTime}
      />
      <BlockArticle />
      <BlockStartMembre />
    </AppContainerWebSite>
  );
};

export default Container;
