import { notFound } from "next/navigation";
import { getProfileById } from "@/domains/directory/queries";
import { getPublicProfiles } from "@/domains/directory/queries";
import { getServiceDetail } from "../_layout/annuaireData";
import Container from "./_layout/container";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnnuaireDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Try to fetch real profile from DB
  const profile = await getProfileById(id);

  if (profile) {
    // Fetch other profiles for the "related" carousel
    const allProfiles = await getPublicProfiles();
    const otherProfiles = allProfiles.filter((p) => p.id !== profile.id);
    return <Container profile={profile} otherProfiles={otherProfiles} />;
  }

  // Fallback to static data for old hardcoded IDs
  const service = getServiceDetail(id);
  if (!service) notFound();
  return <Container service={service} />;
}
