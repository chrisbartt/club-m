export interface ServiceOption {
  name: string;
  delay: string;
  price: string;
  selected?: boolean;
}

export interface ServiceReview {
  name: string;
  text: string;
  date: string;
  positive: boolean;
}

export interface ServiceGalleryItem {
  url: string;
  label: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  category: string;
  providerName: string;
  providerImage: string;
  providerRole: string;
  providerCompany: string;
  providerLocation: string;
  rating: number;
  reviewsCount: number;
  price: string;
  priceAmount?: string;
  image: string;
  description: string;
  includes: string[];
  process: string[];
  clientIdeal: string;
  options: ServiceOption[];
  reviews: ServiceReview[];
  gallery: ServiceGalleryItem[];
  videoThumb?: string;
  videoDuration?: string;
}

export const SERVICES_DETAIL: ServiceDetail[] = [
  {
    id: "1",
    title: "Création de logo & identité visuelle",
    category: "Marketing & Communication",
    providerName: "Emmanuela K.",
    providerImage: "/images/expertes/emmanuela.png",
    providerRole: "Designer graphique",
    providerCompany: "EK Creative",
    providerLocation: "Kinshasa · RDC",
    rating: 4.9,
    reviewsCount: 52,
    price: "À partir de 150 $",
    priceAmount: "150 $",
    image: "/images/banner4.jpg",
    description:
      "Je crée des identités visuelles qui racontent votre histoire et renforcent votre marque. Du brief à la livraison des fichiers finaux, un accompagnement sur-mesure pour les entrepreneures qui veulent une image professionnelle.",
    includes: [
      "Brief créatif détaillé",
      "3 propositions de direction artistique",
      "Logo finalisé (vectoriel + déclinaisons)",
      "Charte graphique de base",
      "Fichiers livrés (print & web)",
    ],
    process: [
      "Échange initial pour comprendre votre univers (30 min)",
      "Recherche et moodboard",
      "Proposition de 3 directions",
      "Révisions et finalisation",
      "Livraison des fichiers",
    ],
    clientIdeal:
      "Entrepreneures, startups et TPE qui souhaitent une identité visuelle professionnelle et cohérente.",
    options: [
      { name: "Logo + charte de base", delay: "Inclus", price: "Inclus", selected: true },
      { name: "Carte de visite & en-tête", delay: "+ 5 jours", price: "+ 50 $" },
      { name: "Pack réseaux sociaux (visuels)", delay: "+ 7 jours", price: "+ 80 $" },
    ],
    reviews: [
      { name: "Marie K.", text: "Résultat au top, très professionnelle et à l'écoute.", date: "28 janv. 2026", positive: true },
      { name: "Sandra M.", text: "Mon logo reflète parfaitement mon activité. Je recommande !", date: "15 déc. 2025", positive: true },
    ],
    gallery: [
      { url: "/images/banner4.jpg", label: "Exemple identité visuelle" },
      { url: "/images/banner1.jpg", label: "Logo entreprise" },
      { url: "/images/banner2.png", label: "Charte graphique" },
    ],
    videoThumb: "/images/banner4.jpg",
    videoDuration: "2:15",
  },
  {
    id: "2",
    title: "Gestion des réseaux sociaux",
    category: "Digital & Tech",
    providerName: "Michelle T.",
    providerImage: "/images/expertes/michelle.png",
    providerRole: "Community Manager",
    providerCompany: "MT Social",
    providerLocation: "Kinshasa · RDC",
    rating: 4.8,
    reviewsCount: 34,
    price: "À partir de 80 $/mois",
    priceAmount: "80 $",
    image: "/images/banner1.jpg",
    description:
      "Je gère votre présence sur les réseaux sociaux pour vous : contenu, planning, interactions. Vous gardez la main sur la stratégie, je m'occupe du quotidien pour faire grandir votre communauté.",
    includes: [
      "Audit de vos comptes existants",
      "Calendrier éditorial mensuel",
      "Création et publication des posts",
      "Réponses aux commentaires et messages",
      "Rapport mensuel de performance",
    ],
    process: [
      "Audit initial et définition des objectifs",
      "Validation de la ligne éditoriale",
      "Mise en place du calendrier",
      "Publication et suivi au quotidien",
      "Point mensuel avec chiffres clés",
    ],
    clientIdeal:
      "Chefs d'entreprise qui n'ont pas le temps de gérer leurs réseaux mais veulent une présence qualitative.",
    options: [
      { name: "Gestion 1 réseau (Instagram ou Facebook)", delay: "Inclus", price: "Inclus", selected: true },
      { name: "2 réseaux", delay: "Mensuel", price: "+ 40 $" },
      { name: "Stories quotidiennes", delay: "Mensuel", price: "+ 30 $" },
    ],
    reviews: [
      { name: "Claire M.", text: "Mon compte a pris une autre dimension. Pro et réactive.", date: "10 janv. 2026", positive: true },
      { name: "Nadine K.", text: "Enfin une CM qui comprend mon secteur. Super collaboration.", date: "3 déc. 2025", positive: true },
    ],
    gallery: [
      { url: "/images/banner1.jpg", label: "Feed Instagram" },
      { url: "/images/banner6.jpg", label: "Stories" },
    ],
    videoThumb: "/images/banner1.jpg",
    videoDuration: "1:45",
  },
  {
    id: "3",
    title: "Comptabilité & déclarations",
    category: "Comptabilité & Finance",
    providerName: "Vanessa M.",
    providerImage: "/images/expertes/vanessa.png",
    providerRole: "Experte-comptable",
    providerCompany: "VM Compta",
    providerLocation: "Kinshasa · RDC",
    rating: 5,
    reviewsCount: 28,
    price: "Sur devis",
    priceAmount: "À partir de 99 $/mois",
    image: "/images/banner5.jpg",
    description:
      "Je mets vos chiffres au propre, vous aide à comprendre votre rentabilité et présente des comptes irréprochables à la banque ou au fisc. Tenue comptable, déclarations et pilotage financier.",
    includes: [
      "Tenue comptable mensuelle",
      "Tableau de bord de suivi",
      "Déclarations fiscales trimestrielles",
      "1 RDV mensuel de 30 min",
      "Support WhatsApp illimité",
    ],
    process: [
      "Appel de cadrage initial (30 min)",
      "Récupération de vos documents",
      "Mise en place du tableau de bord",
      "Suivi mensuel & points réguliers",
    ],
    clientIdeal:
      "TPE, commerces et indépendantes qui veulent une comptabilité claire sans stress.",
    options: [
      { name: "Forfait mensuel de base", delay: "Inclus", price: "Sur devis", selected: true },
      { name: "Audit financier complet", delay: "+ 3 jours", price: "+ 150 $" },
      { name: "Business plan sur-mesure", delay: "+ 5 jours", price: "+ 200 $" },
    ],
    reviews: [
      { name: "Gabriel S.", text: "Intervention rapide et efficace, merci !", date: "28 janv. 2026", positive: true },
      { name: "Marie K.", text: "Excellente prestation, je recommande vivement.", date: "5 oct. 2025", positive: true },
    ],
    gallery: [
      { url: "/images/banner5.jpg", label: "Tableau de bord" },
      { url: "/images/banner3.jpg", label: "Bilan" },
    ],
    videoThumb: "/images/banner5.jpg",
    videoDuration: "2:30",
  },
  {
    id: "4",
    title: "Coaching entrepreneurial",
    category: "Coaching & Mindset",
    providerName: "Maurelle K.",
    providerImage: "/images/expertes/maurelle.jpeg",
    providerRole: "Coach business & mindset",
    providerCompany: "MK Coaching",
    providerLocation: "Kinshasa · RDC & en ligne",
    rating: 4.9,
    reviewsCount: 41,
    price: "À partir de 60 $/séance",
    priceAmount: "60 $",
    image: "/images/banner6.jpg",
    description:
      "Accompagnement personnalisé pour clarifier votre vision, structurer votre activité et dépasser les blocages. Pour les femmes qui veulent passer à l'action avec sérénité et clarté.",
    includes: [
      "Séance découverte 30 min offerte",
      "Coaching individuel 1h par séance",
      "Support entre les séances (messagerie)",
      "Ressources et exercices personnalisés",
      "Bilan à mi-parcours",
    ],
    process: [
      "Séance découverte gratuite",
      "Définition de vos objectifs",
      "Séances régulières (hebdo ou bi-mensuel)",
      "Exercices et suivi entre les séances",
      "Bilan et ajustements",
    ],
    clientIdeal:
      "Entrepreneures en création ou en développement qui veulent être accompagnées sans se sentir jugées.",
    options: [
      { name: "Séance unique", delay: "1 séance", price: "60 $", selected: true },
      { name: "Pack 5 séances", delay: "Valable 3 mois", price: "280 $" },
      { name: "Pack 10 séances", delay: "Valable 6 mois", price: "520 $" },
    ],
    reviews: [
      { name: "Faida M.", text: "Maurelle m'a aidée à y voir clair et à me lancer. Merci infiniment.", date: "20 janv. 2026", positive: true },
      { name: "Chloe N.", text: "Un coaching bienveillant et efficace. Je recommande.", date: "8 déc. 2025", positive: true },
    ],
    gallery: [
      { url: "/images/banner6.jpg", label: "Séance coaching" },
      { url: "/images/banner4.jpg", label: "Atelier" },
    ],
    videoThumb: "/images/banner6.jpg",
    videoDuration: "2:00",
  },
  {
    id: "5",
    title: "Formation Excel & outils",
    category: "Formation & Ateliers",
    providerName: "Ornella K.",
    providerImage: "/images/expertes/ornella.png",
    providerRole: "Formatrice bureautique",
    providerCompany: "OK Formation",
    providerLocation: "Kinshasa · RDC",
    rating: 4.7,
    reviewsCount: 19,
    price: "Pack 5 séances",
    priceAmount: "150 $",
    image: "/images/banner2.png",
    description:
      "Formation Excel et outils numériques adaptée à votre niveau. Tableaux, formules, tableaux croisés dynamiques, et bonnes pratiques pour gagner du temps au quotidien.",
    includes: [
      "Évaluation de votre niveau",
      "5 séances de 1h30 en individuel ou petit groupe",
      "Support de cours et exercices",
      "Cas pratiques issus de votre activité",
      "Certificat de suivi",
    ],
    process: [
      "Test de niveau et objectifs",
      "Programme personnalisé",
      "Séances en présentiel ou visio",
      "Exercices entre les séances",
      "Validation des acquis",
    ],
    clientIdeal:
      "Entrepreneures et salariées qui veulent maîtriser Excel pour leur activité ou leur évolution.",
    options: [
      { name: "Pack 5 séances", delay: "Inclus", price: "150 $", selected: true },
      { name: "Séance individuelle", delay: "1h30", price: "35 $" },
      { name: "Formation équipe (max 5)", delay: "Sur devis", price: "Sur devis" },
    ],
    reviews: [
      { name: "Magalie T.", text: "Très pédagogue, j'ai enfin compris les TCD !", date: "12 janv. 2026", positive: true },
      { name: "Samantha L.", text: "Formation claire et utile pour mon travail.", date: "30 nov. 2025", positive: true },
    ],
    gallery: [
      { url: "/images/banner2.png", label: "Formation Excel" },
      { url: "/images/banner5.jpg", label: "Atelier" },
    ],
    videoThumb: "/images/banner2.png",
    videoDuration: "1:30",
  },
  {
    id: "6",
    title: "Conseil juridique & statuts",
    category: "Juridique & Administratif",
    providerName: "Chantal M.",
    providerImage: "/images/expertes/chantal.png",
    providerRole: "Juriste",
    providerCompany: "CM Juridique",
    providerLocation: "Kinshasa · RDC",
    rating: 4.8,
    reviewsCount: 22,
    price: "Sur devis",
    priceAmount: "À partir de 220 $",
    image: "/images/banner7.jpg",
    description:
      "Sécurisez votre activité avec des statuts solides, des contrats clients blindés et une protection juridique adaptée à votre business. Création de société, CGV, contrats.",
    includes: [
      "Rédaction des statuts sur mesure",
      "3 modèles de contrats clients",
      "CGV adaptées à votre activité",
      "1 heure de conseil juridique",
    ],
    process: [
      "Échange sur votre projet (30 min)",
      "Rédaction des documents",
      "Version révisée selon vos retours",
      "Version finale et enregistrement si besoin",
    ],
    clientIdeal:
      "Créatrices d'entreprise et indépendantes qui veulent partir sur de bonnes bases juridiques.",
    options: [
      { name: "Statuts uniquement", delay: "Inclus", price: "Sur devis", selected: true },
      { name: "Pack statuts + 3 contrats", delay: "+ 5 jours", price: "+ 150 $" },
      { name: "Heure de conseil supplémentaire", delay: "À la demande", price: "80 $" },
    ],
    reviews: [
      { name: "Emmanuela K.", text: "Très professionnelle, documents clairs et rassurants.", date: "5 janv. 2026", positive: true },
      { name: "Malu D.", text: "Un accompagnement précieux pour mon lancement.", date: "18 déc. 2025", positive: true },
    ],
    gallery: [
      { url: "/images/banner7.jpg", label: "Conseil juridique" },
      { url: "/images/banner3.jpg", label: "Documents" },
    ],
    videoThumb: "/images/banner7.jpg",
    videoDuration: "2:10",
  },
];

export function getServiceDetail(id: string): ServiceDetail | null {
  return SERVICES_DETAIL.find((s) => s.id === id) ?? null;
}

export function getOtherServicesByProvider(providerName: string, excludeId: string): ServiceDetail[] {
  return SERVICES_DETAIL.filter((s) => s.providerName === providerName && s.id !== excludeId);
}

export function getRelatedServices(category: string, excludeId: string, limit = 3): ServiceDetail[] {
  return SERVICES_DETAIL.filter((s) => s.category === category && s.id !== excludeId).slice(0, limit);
}
