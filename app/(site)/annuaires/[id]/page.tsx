import { notFound } from "next/navigation";
import { getServiceDetail } from "../_layout/annuaireData";
import Container from "./_layout/container";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnnuaireDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = getServiceDetail(id);
  if (!service) notFound();
  return <Container service={service} />;
}
