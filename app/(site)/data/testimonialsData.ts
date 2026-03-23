export interface TestimonialImpact {
  number: string;
  label: string;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  quote: string;
  role: string;
  location: string;
  sector: string;
  impact: TestimonialImpact[];
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Malu",
    image: "/images/malu.jpeg",
    quote:
      "« Avant le Club M, j'avais une idée. Aujourd'hui j'ai une entreprise, un business plan validé, et un réseau qui me pousse chaque jour. Le groupe WhatsApp à lui seul vaut l'adhésion. »",
    role: "Fondatrice & Consultante",
    location: "Kinshasa",
    sector: "Conseil & Stratégie",
    impact: [
      { number: "+120%", label: "Chiffre d'affaires" },
      { number: "8", label: "Mois dans le Club" },
      { number: "3", label: "Contrats signés" },
    ],
  },
  {
    id: "2",
    name: "Ornella",
    image: "/images/ornella.jpeg",
    quote:
      "« Je me sentais seule dans mon parcours. Le Club M m'a donné des sœurs d'armes. On se challenge, on se réfère des clients, on pleure ensemble et on gagne ensemble. C'est ça, la puissance du collectif. »",
    role: "Directrice Créative",
    location: "Kinshasa",
    sector: "Mode & Design",
    impact: [
      { number: "+85%", label: "Visibilité" },
      { number: "12", label: "Mois dans le Club" },
      { number: "5", label: "Collaborations" },
    ],
  },
  {
    id: "3",
    name: "Chloé",
    image: "/images/chloe.jpeg",
    quote:
      "« Business Aligné a transformé ma façon de penser mon entreprise. En 3 mois, j'avais une stratégie claire, des objectifs chiffrés et une confiance que je n'avais jamais eue. Le Club M, c'est bien plus qu'un réseau. »",
    role: "Entrepreneure Tech",
    location: "Kinshasa",
    sector: "Tech & Digital",
    impact: [
      { number: "+200%", label: "Croissance" },
      { number: "6", label: "Mois dans le Club" },
      { number: "2", label: "Levées de fonds" },
    ],
  },
  {
    id: "4",
    name: "Vanessa",
    image: "/images/vanessa.jpeg",
    quote:
      "« Les lunchs networking ont changé ma vie professionnelle. J'y ai rencontré ma future associée, décroché 2 contrats et trouvé mon comptable. Tout ça en mangeant bien et en riant. C'est la magie du Club M. »",
    role: "Entrepreneure",
    location: "Kinshasa",
    sector: "Événementiel",
    impact: [
      { number: "+150%", label: "Réseau" },
      { number: "10", label: "Mois dans le Club" },
      { number: "4", label: "Événements" },
    ],
  },
];
