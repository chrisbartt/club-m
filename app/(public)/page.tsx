import Banner from "@/app/(site)/_layoutHome/banner";
import BlockStep from "@/app/(site)/_layoutHome/blockStep";
import BlockAbout from "@/app/(site)/_layoutHome/blockAbout";
import BlockCommunaute from "@/app/(site)/_layoutHome/blockCommunaute";
import BlockEvent from "@/app/(site)/_layoutHome/blockEvents";
import BlockAnnuaire from "@/app/(site)/_layoutHome/blockAnnuaire";
import BlockIntroMembre from "@/app/(site)/_layoutHome/blockIntroMembre";
import BlockChiffre from "@/app/(site)/_layoutHome/blockChiffre";
import BlockFaq from "@/app/(site)/_layoutHome/blockFaq";
import BlockBlog from "@/app/(site)/_layoutHome/blockBlog";
import { getPublishedEvents } from "@/domains/events/queries";
import { getPublicProfiles } from "@/domains/directory/queries";

export default async function HomePage() {
  const [events, profiles] = await Promise.all([
    getPublishedEvents(),
    getPublicProfiles(),
  ]);

  // Serialize events for client components (dates -> ISO strings, Decimal -> number)
  const serializedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    coverImage: e.coverImage,
    location: e.location,
    startDate: e.startDate.toISOString(),
    category: "Conférence",
    prices: e.prices.map((p) => ({
      price: Number(p.price),
      currency: p.currency,
    })),
  }));

  return (
    <>
      <Banner />
      <BlockStep />
      <BlockAbout />
      <BlockCommunaute />
      <BlockEvent events={serializedEvents} />
      <BlockAnnuaire profiles={profiles} />
      <BlockIntroMembre />
      <BlockChiffre />
      <BlockFaq />
      <BlockBlog />
    </>
  );
}
