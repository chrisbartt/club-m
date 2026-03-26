import type { Metadata } from 'next'
import { getPublicProfiles } from "@/domains/directory/queries";
import Container from "./_layout/container";

export const metadata: Metadata = {
  title: 'Annuaire | Club M',
  description: 'Trouvez les meilleures entrepreneures de Kinshasa dans l\'annuaire Club M.',
}

export default async function AnnuairesPage() {
  const profiles = await getPublicProfiles();
  return <Container profiles={profiles} />;
}
