import type { Metadata } from 'next'
import Container from "./_layout/container";

export const metadata: Metadata = {
  title: 'Mentions Legales | Club M',
  description: 'Mentions legales de la plateforme Club M.',
}

export default function MentionsLegalesPage() {
  return <Container />;
}
