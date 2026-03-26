import type { Metadata } from 'next'
import { getEventById } from "@/domains/events/queries";
import { notFound } from "next/navigation";
import Container from "./_layout/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) return { title: 'Evenement | Club M' }

  return {
    title: `${event.title} | Club M`,
    description: event.description?.slice(0, 160) || 'Evenement Club M a Kinshasa',
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160),
      ...(event.coverImage ? { images: [event.coverImage] } : {}),
    },
  }
}

export default async function EvenementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    // Fall back to the static showcase page (no DB event found)
    return <Container />;
  }

  const serializedEvent = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    coverImage: event.coverImage,
    location: event.location,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    capacity: event.capacity,
    status: event.status,
    accessLevel: event.accessLevel,
    prices: event.prices.map((p) => ({
      price: Number(p.price),
      currency: p.currency,
      targetRole: p.targetRole,
    })),
    ticketsSold: event._count.tickets,
  };

  return <Container event={serializedEvent} />;
}
