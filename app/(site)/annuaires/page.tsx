import { getPublicProfiles } from "@/domains/directory/queries";
import Container from "./_layout/container";

export default async function AnnuairesPage() {
  const profiles = await getPublicProfiles();
  return <Container profiles={profiles} />;
}
