import type { Metadata } from 'next'
import Container from "./_layout/container";

export const metadata: Metadata = {
  title: 'Contact | Club M',
  description: 'Contactez l\'equipe Club M pour toute question ou suggestion.',
}

export default function ContactPage() {
  return <Container />;
}
