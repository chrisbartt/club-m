import { getPublishedEvents } from "@/domains/events/queries";
import Container from "./_layout/container";

export default async function EvenementsPage() {
  const events = await getPublishedEvents();

  // Serialize dates and Decimal prices for client components
  const serializedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    coverImage: e.coverImage,
    location: e.location,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate.toISOString(),
    category: e.accessLevel === "PUBLIC" ? "Conférence" : "Conférence",
    status: e.status,
    prices: e.prices.map((p) => ({
      price: Number(p.price),
      currency: p.currency,
    })),
  }));

  return <Container events={serializedEvents} />;
}
