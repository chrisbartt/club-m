"use client";

import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Field {
  name: string;
  type: string;
  instructions: string;
  example: string;
}

interface SectionBlock {
  id: string;
  name: string;
  visual: string;
  fields: Field[];
}

interface PageDef {
  id: string;
  name: string;
  route: string;
  description: string;
  sections: SectionBlock[];
}

// ─── Données ──────────────────────────────────────────────────────────────────
const PAGES: PageDef[] = [
  // ──────────────────────────────── ACCUEIL ────────────────────────────────────
  {
    id: "accueil",
    name: "Accueil",
    route: "/",
    description:
      "Page d'entrée du site. Présente l'identité du Club M, l'écosystème, les chiffres clés, les témoignages et les articles récents.",
    sections: [
      {
        id: "accueil-banniere",
        name: "Bannière Hero",
        visual:
          "Plein écran. Vidéo en fond, léger voile sombre. Titre grand format à gauche. Boutons CTA. Bloc 'social proof' avec photos en défilement à droite.",
        fields: [
          {
            name: "Vidéo de fond",
            type: "Vidéo MP4",
            instructions:
              "Vidéo courte (5–15 s), lecture en boucle automatique, sans son. Format 16:9, minimum 1920×1080 px. Nommer le fichier : accueil-banniere-video-01.mp4",
            example: "accueil-banniere-video-01.mp4",
          },
          {
            name: "Titre principal (H1)",
            type: "Texte court",
            instructions:
              "Phrase d'accroche forte. Maximum 70 caractères. Affiché en très grand sur desktop.",
            example: "Tu n'es pas seule. Et ton ambition mérite un cadre.",
          },
          {
            name: "Sous-titre",
            type: "Texte court",
            instructions: "Description courte en dessous du titre. Maximum 120 caractères.",
            example:
              "Club M, le premier incubateur féminin structurant en République Démocratique du Congo.",
          },
          {
            name: "Bouton CTA 1 – Libellé",
            type: "Texte court",
            instructions: "Bouton principal (brun). Maximum 30 caractères.",
            example: "Rejoindre le Club",
          },
          {
            name: "Bouton CTA 2 – Libellé",
            type: "Texte court",
            instructions: "Bouton secondaire (blanc). Maximum 30 caractères.",
            example: "Parler de ton projet",
          },
          {
            name: "Stat sociale – Nombre",
            type: "Texte court",
            instructions:
              "Chiffre affiché dans le bloc 'social proof' à droite, sur les photos de membres.",
            example: "+250",
          },
          {
            name: "Stat sociale – Description",
            type: "Texte court",
            instructions: "Texte sous le chiffre. Maximum 40 caractères.",
            example: "femmes depuis 2022 à Kinshasa",
          },
          {
            name: "Photos de membres (défilement) – Photo 1",
            type: "Image JPEG/PNG",
            instructions:
              "Portrait carré ou portrait (ratio 1:1 ou 3:4). Minimum 200×200 px. Fond neutre préférable. Nommer : accueil-banniere-membre-01.jpg",
            example: "accueil-banniere-membre-01.jpg",
          },
          {
            name: "Photos de membres (défilement) – Photo 2",
            type: "Image JPEG/PNG",
            instructions: "Même consignes que la photo 1. Nommer : accueil-banniere-membre-02.jpg",
            example: "accueil-banniere-membre-02.jpg",
          },
          {
            name: "Photos de membres (défilement) – Photo 3",
            type: "Image JPEG/PNG",
            instructions: "Nommer : accueil-banniere-membre-03.jpg",
            example: "accueil-banniere-membre-03.jpg",
          },
          {
            name: "Photos de membres (défilement) – Photo 4",
            type: "Image JPEG/PNG",
            instructions: "Nommer : accueil-banniere-membre-04.jpg",
            example: "accueil-banniere-membre-04.jpg",
          },
          {
            name: "Photos de membres (défilement) – Photo 5",
            type: "Image JPEG/PNG",
            instructions: "Nommer : accueil-banniere-membre-05.jpg",
            example: "accueil-banniere-membre-05.jpg",
          },
          {
            name: "Photos de membres (défilement) – Photo 6",
            type: "Image JPEG/PNG",
            instructions: "Nommer : accueil-banniere-membre-06.jpg",
            example: "accueil-banniere-membre-06.jpg",
          },
        ],
      },
      {
        id: "accueil-ecosysteme",
        name: "Section « Comment ça marche »",
        visual:
          "Fond foncé (#091626). Titre centré. 4 cartes semi-transparentes disposées en arc, chacune numérotée avec un titre et une description courte.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label au-dessus du titre principal, en majuscules. Maximum 40 caractères.",
            example: "COMMENT ÇA MARCHE",
          },
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères. Peut contenir un saut de ligne.",
            example: "Plus qu'un réseau. Un écosystème.",
          },
          {
            name: "Pilier 1 – Titre",
            type: "Texte court",
            instructions: "Titre de la carte 1. Maximum 25 caractères.",
            example: "Communauté",
          },
          {
            name: "Pilier 1 – Description",
            type: "Texte court",
            instructions: "Phrase courte. Maximum 60 caractères.",
            example: "Entraide 24/7, WhatsApp, solidarité.",
          },
          {
            name: "Pilier 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 25 caractères.",
            example: "Structuration",
          },
          {
            name: "Pilier 2 – Description",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Cadre, méthode, plan d'action.",
          },
          {
            name: "Pilier 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 25 caractères.",
            example: "Mentorat",
          },
          {
            name: "Pilier 3 – Description",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Expertes, coaching Business Aligné.",
          },
          {
            name: "Pilier 4 – Titre",
            type: "Texte court",
            instructions: "Maximum 25 caractères.",
            example: "Activation",
          },
          {
            name: "Pilier 4 – Description",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Événements physiques, réseau, opportunités.",
          },
        ],
      },
      {
        id: "accueil-communaute",
        name: "Section « Communauté qui te soutient »",
        visual:
          "Fond blanc. Colonne gauche : deux colonnes de photos en défilement vertical, badge central avec chiffre. Colonne droite : titre, 2 paragraphes, bouton.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label au-dessus du titre. Maximum 50 caractères.",
            example: "Une communauté qui te soutient",
          },
          {
            name: "Titre principal",
            type: "Texte court",
            instructions: "Maximum 60 caractères. Peut contenir un saut de ligne (<br/>).",
            example: "Entreprendre seule, c'est fini.",
          },
          {
            name: "Paragraphe 1",
            type: "Texte long",
            instructions: "Premier paragraphe descriptif. Maximum 200 caractères.",
            example:
              "Le Club M est une communauté de femmes entrepreneures qui se soutiennent mutuellement et partagent leurs expériences.",
          },
          {
            name: "Paragraphe 2",
            type: "Texte long",
            instructions: "Deuxième paragraphe. Maximum 250 caractères.",
            example:
              "Vous avez des idées, mais vous manquez de cadre, de réseau, d'informations fiables et de soutien.",
          },
          {
            name: "Bouton – Libellé",
            type: "Texte court",
            instructions: "Texte du bouton brun. Maximum 30 caractères.",
            example: "Explorer la communauté",
          },
          {
            name: "Badge central – Chiffre",
            type: "Texte court",
            instructions: "Nombre affiché dans le badge rond au centre des photos.",
            example: "+250",
          },
          {
            name: "Badge central – Label",
            type: "Texte court",
            instructions: "Label sous le chiffre. Maximum 20 caractères.",
            example: "Femmes membres",
          },
          {
            name: "Photos galerie (6 portraits – mêmes que bannière)",
            type: "Image JPEG/PNG",
            instructions:
              "Réutiliser les photos accueil-banniere-membre-01 à 06. Si différentes, nommer : accueil-galerie-portrait-01.jpg à 06.jpg",
            example: "accueil-galerie-portrait-01.jpg",
          },
        ],
      },
      {
        id: "accueil-problemes",
        name: "Section « Le problème ressenti »",
        visual:
          "Fond gris clair (#f8f8f8). Titre centré. 5 cartes blanches en grille, chacune avec une icône et un titre de problème.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label au-dessus du titre. Majuscules. Maximum 40 caractères.",
            example: "Le problème ressenti",
          },
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 120 caractères.",
            example:
              "Beaucoup de femmes ont une idée. Peu ont un cadre. Encore moins ont un réseau solide.",
          },
          {
            name: "Problème 1 – Titre",
            type: "Texte court",
            instructions: "Titre court du problème. Maximum 40 caractères.",
            example: "Peur de perdre de l'argent",
          },
          {
            name: "Problème 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Peur de mal commencer",
          },
          {
            name: "Problème 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Manque de modèle",
          },
          {
            name: "Problème 4 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Pression familiale",
          },
          {
            name: "Problème 5 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Solitude entrepreneuriale",
          },
        ],
      },
      {
        id: "accueil-business-aligne",
        name: "Section « Business Aligné »",
        visual:
          "Fond blanc. Colonne gauche : titre, description, 3 fonctionnalités (icône + titre + sous-titre), bouton. Colonne droite : grande image avec badge statistique.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label rouge-brun au-dessus du titre. Maximum 30 caractères.",
            example: "Business Aligné",
          },
          {
            name: "Titre principal",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Une idée ne suffit pas. Elle doit être structurée.",
          },
          {
            name: "Description",
            type: "Texte long",
            instructions: "Paragraphe d'introduction. Maximum 200 caractères.",
            example:
              "Business Aligné : le cadre qui transforme les idées en projets. Une idée ne suffit pas. Elle doit être structurée.",
          },
          {
            name: "Fonctionnalité 1 – Titre",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Diagnostic",
          },
          {
            name: "Fonctionnalité 1 – Description",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Identifier tes forces et axes de progression",
          },
          {
            name: "Fonctionnalité 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Plan d'action",
          },
          {
            name: "Fonctionnalité 2 – Description",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Structurer ton projet étape par étape",
          },
          {
            name: "Fonctionnalité 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Suivi",
          },
          {
            name: "Fonctionnalité 3 – Description",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Accompagnement pour tenir le cap",
          },
          {
            name: "Bouton – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Découvrir le parcours",
          },
          {
            name: "Image principale",
            type: "Image JPEG/PNG",
            instructions:
              "Photo illustrant l'accompagnement. Format portrait ou paysage, minimum 800×600 px. Nommer : accueil-businessaligne-photo-01.jpg",
            example: "accueil-businessaligne-photo-01.jpg",
          },
          {
            name: "Badge stat – Chiffre",
            type: "Texte court",
            instructions: "Chiffre affiché dans le badge sur l'image.",
            example: "+150",
          },
          {
            name: "Badge stat – Label",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Femmes accompagnées",
          },
        ],
      },
      {
        id: "accueil-temoignages",
        name: "Section « Témoignages »",
        visual:
          "Fond gris clair. Carrousel centré (70% de largeur). Chaque slide : photo à gauche, citation + nom + rôle à droite. Navigation par points et flèches.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Majuscules. Maximum 30 caractères.",
            example: "Témoignages",
          },
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères. Peut contenir un <br/>.",
            example: "Elles l'ont vécu. Elles le racontent.",
          },
          {
            name: "Témoignage 1 – Prénom",
            type: "Texte court",
            instructions: "Prénom ou prénom + nom de la membre.",
            example: "Malu",
          },
          {
            name: "Témoignage 1 – Rôle / Titre",
            type: "Texte court",
            instructions: "Titre professionnel. Maximum 40 caractères.",
            example: "Fondatrice & Consultante",
          },
          {
            name: "Témoignage 1 – Ville",
            type: "Texte court",
            instructions: "Ville de résidence.",
            example: "Kinshasa",
          },
          {
            name: "Témoignage 1 – Citation",
            type: "Texte long",
            instructions:
              "Citation authentique entre guillemets « ». Maximum 300 caractères. Doit être validée par la personne concernée.",
            example:
              "« Avant le Club M, j'avais une idée. Aujourd'hui j'ai une entreprise, un business plan validé, et un réseau qui me pousse chaque jour. »",
          },
          {
            name: "Témoignage 1 – Photo",
            type: "Image JPEG/PNG",
            instructions:
              "Portrait (ratio 2:3). Minimum 300×450 px. Fond neutre ou naturel. Nommer : accueil-temoignage-portrait-01.jpg",
            example: "accueil-temoignage-portrait-01.jpg",
          },
          {
            name: "Témoignage 2 – Prénom",
            type: "Texte court",
            instructions: "Même consignes que témoignage 1.",
            example: "Ornella",
          },
          {
            name: "Témoignage 2 – Rôle",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Directrice Créative",
          },
          {
            name: "Témoignage 2 – Ville",
            type: "Texte court",
            instructions: "",
            example: "Kinshasa",
          },
          {
            name: "Témoignage 2 – Citation",
            type: "Texte long",
            instructions: "Maximum 300 caractères.",
            example: "« Je me sentais seule dans mon parcours. Le Club M m'a donné des sœurs d'armes. »",
          },
          {
            name: "Témoignage 2 – Photo",
            type: "Image JPEG/PNG",
            instructions: "Nommer : accueil-temoignage-portrait-02.jpg",
            example: "accueil-temoignage-portrait-02.jpg",
          },
          {
            name: "Témoignage 3 – Prénom",
            type: "Texte court",
            instructions: "",
            example: "Chloé",
          },
          {
            name: "Témoignage 3 – Rôle",
            type: "Texte court",
            instructions: "",
            example: "Entrepreneure Tech",
          },
          {
            name: "Témoignage 3 – Ville",
            type: "Texte court",
            instructions: "",
            example: "Kinshasa",
          },
          {
            name: "Témoignage 3 – Citation",
            type: "Texte long",
            instructions: "Maximum 300 caractères.",
            example:
              "« Business Aligné a transformé ma façon de penser mon entreprise. En 3 mois, j'avais une stratégie claire. »",
          },
          {
            name: "Témoignage 3 – Photo",
            type: "Image JPEG/PNG",
            instructions: "Nommer : accueil-temoignage-portrait-03.jpg",
            example: "accueil-temoignage-portrait-03.jpg",
          },
          {
            name: "Témoignage 4 – Prénom",
            type: "Texte court",
            instructions: "",
            example: "Vanessa",
          },
          {
            name: "Témoignage 4 – Rôle",
            type: "Texte court",
            instructions: "",
            example: "Entrepreneure",
          },
          {
            name: "Témoignage 4 – Ville",
            type: "Texte court",
            instructions: "",
            example: "Kinshasa",
          },
          {
            name: "Témoignage 4 – Citation",
            type: "Texte long",
            instructions: "Maximum 300 caractères.",
            example: "« Les lunchs networking ont changé ma vie professionnelle. »",
          },
          {
            name: "Témoignage 4 – Photo",
            type: "Image JPEG/PNG",
            instructions: "Nommer : accueil-temoignage-portrait-04.jpg",
            example: "accueil-temoignage-portrait-04.jpg",
          },
        ],
      },
      {
        id: "accueil-valeurs",
        name: "Section « Communauté & vidéo »",
        visual:
          "Fond foncé (#091626). Colonne gauche : titre, texte, 4 tags (valeurs), bouton. Colonne droite : image pleine hauteur avec bouton play vidéo centré.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Communauté",
          },
          {
            name: "Titre",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Les aînées transmettent. Les jeunes bousculent.",
          },
          {
            name: "Description",
            type: "Texte long",
            instructions: "Maximum 200 caractères.",
            example:
              "Le Club M est une communauté de femmes entrepreneures qui se soutiennent mutuellement et partagent leurs expériences.",
          },
          {
            name: "Valeur 1 – Tag",
            type: "Texte court",
            instructions: "Tag court affiché comme badge arrondi. Maximum 35 caractères.",
            example: "Transmission intergénérationnelle",
          },
          {
            name: "Valeur 2 – Tag",
            type: "Texte court",
            instructions: "Maximum 35 caractères.",
            example: "Solidarité active",
          },
          {
            name: "Valeur 3 – Tag",
            type: "Texte court",
            instructions: "Maximum 35 caractères.",
            example: "Partage des échecs",
          },
          {
            name: "Valeur 4 – Tag",
            type: "Texte court",
            instructions: "Maximum 35 caractères.",
            example: "Réseau actif 24/7",
          },
          {
            name: "Bouton – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Rejoindre le Club",
          },
          {
            name: "Image fond (côté vidéo)",
            type: "Image JPEG/PNG",
            instructions:
              "Photo pleine hauteur. Minimum 800×600 px. La vidéo se lance par-dessus au clic. Nommer : accueil-communaute-image-01.jpg",
            example: "accueil-communaute-image-01.jpg",
          },
          {
            name: "Vidéo YouTube – ID",
            type: "Texte court",
            instructions:
              "Identifiant YouTube uniquement (partie après 'watch?v=' dans l'URL). Pas l'URL complète.",
            example: "bpLXcC08FLo",
          },
        ],
      },
      {
        id: "accueil-chiffres",
        name: "Section « Chiffres clés »",
        visual:
          "Carte blanche centrée, 4 colonnes de statistiques. Chaque colonne : grand chiffre + label.",
        fields: [
          {
            name: "Statistique 1 – Chiffre",
            type: "Texte court",
            instructions: "Valeur affichée en grand. Peut inclure '+', '%', etc.",
            example: "+250",
          },
          {
            name: "Statistique 1 – Label",
            type: "Texte court",
            instructions: "Description sous le chiffre. Maximum 40 caractères.",
            example: "Entrepreneures accompagnées",
          },
          {
            name: "Statistique 2 – Chiffre",
            type: "Texte court",
            instructions: "",
            example: "+120",
          },
          {
            name: "Statistique 2 – Label",
            type: "Texte court",
            instructions: "",
            example: "Business Plans validés",
          },
          {
            name: "Statistique 3 – Chiffre",
            type: "Texte court",
            instructions: "",
            example: "87%",
          },
          {
            name: "Statistique 3 – Label",
            type: "Texte court",
            instructions: "",
            example: "Taux de financement",
          },
          {
            name: "Statistique 4 – Chiffre",
            type: "Texte court",
            instructions: "",
            example: "+50",
          },
          {
            name: "Statistique 4 – Label",
            type: "Texte court",
            instructions: "",
            example: "Ateliers par an",
          },
        ],
      },
      {
        id: "accueil-faq",
        name: "Section « FAQ »",
        visual:
          "Fond foncé avec image de fond et voile noir. Colonne gauche : titre, description, bouton. Colonne droite : accordéon de 3 questions/réponses (fond blanc).",
        fields: [
          {
            name: "Image de fond",
            type: "Image JPEG/PNG",
            instructions:
              "Image pleine section, 70% occultée par voile noir. Minimum 1920×600 px. Nommer : accueil-faq-fond-01.jpg",
            example: "accueil-faq-fond-01.jpg",
          },
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Majuscules. Maximum 40 caractères.",
            example: "QUESTIONS FRÉQUENTES",
          },
          {
            name: "Titre",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Toutes tes questions, nos réponses",
          },
          {
            name: "Description",
            type: "Texte long",
            instructions: "Phrase sous le titre. Maximum 150 caractères.",
            example: "Nous sommes là pour vous aider. Contactez-nous pour toute question ou demande.",
          },
          {
            name: "Bouton – Libellé",
            type: "Texte court",
            instructions: "Maximum 25 caractères.",
            example: "Contactez-nous",
          },
          {
            name: "Question 1",
            type: "Texte court",
            instructions: "Question fréquente. Maximum 100 caractères.",
            example: "Que se passe-t-il après le Business Aligné ?",
          },
          {
            name: "Réponse 1",
            type: "Texte long",
            instructions: "Réponse complète. Maximum 400 caractères.",
            example:
              "Après le Business Aligné, vous pouvez approfondir avec nos Ateliers & Masterclass ou développer votre visibilité via l'Annuaire Business.",
          },
          {
            name: "Question 2",
            type: "Texte court",
            instructions: "Maximum 100 caractères.",
            example: "Que se passe-t-il si mon idée n'est pas validée ?",
          },
          {
            name: "Réponse 2",
            type: "Texte long",
            instructions: "Maximum 400 caractères.",
            example:
              "Nous te donnons un retour constructif avec des pistes d'amélioration. Tu peux ajuster ton idée et revenir.",
          },
          {
            name: "Question 3",
            type: "Texte court",
            instructions: "Maximum 100 caractères.",
            example: "Dois-je avoir une idée entièrement développée pour commencer ?",
          },
          {
            name: "Réponse 3",
            type: "Texte long",
            instructions: "Maximum 400 caractères.",
            example:
              "Non ! Le Business Aligné est justement conçu pour clarifier votre idée, même si elle est encore floue.",
          },
        ],
      },
      {
        id: "accueil-blog",
        name: "Section « Journal » (aperçu articles)",
        visual:
          "Fond blanc. Titre centré. Grille de 3 cartes d'articles côte à côte. Bouton 'Explorer' en bas.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Majuscules. Maximum 20 caractères.",
            example: "JOURNAL",
          },
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Découvrez nos articles",
          },
          {
            name: "Bouton – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Explorer le journal",
          },
          {
            name: "Article 1 – Image",
            type: "Image JPEG/PNG",
            instructions:
              "Image de couverture de l'article. Format 16:9. Minimum 800×450 px. Nommer : journal-article-01-image-01.jpg",
            example: "journal-article-01-image-01.jpg",
          },
          {
            name: "Article 1 – Catégorie",
            type: "Texte court",
            instructions: "Badge affiché sur la photo. Ex : Témoignage, Entrepreneuriat, Actualités.",
            example: "Témoignage",
          },
          {
            name: "Article 1 – Date",
            type: "Texte court",
            instructions: "Format : JJ Mois AAAA.",
            example: "28 Jan 2025",
          },
          {
            name: "Article 1 – Titre",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "De l'idée à la croissance : le parcours de Michelle",
          },
          {
            name: "Article 1 – Description courte",
            type: "Texte long",
            instructions: "Accroche de l'article. Maximum 150 caractères.",
            example:
              "Comment elle a structuré sa boutique mode et triplé son chiffre d'affaires grâce à Club M.",
          },
          {
            name: "Article 2 – Image",
            type: "Image JPEG/PNG",
            instructions: "Nommer : journal-article-02-image-01.jpg",
            example: "journal-article-02-image-01.jpg",
          },
          {
            name: "Article 2 – Catégorie",
            type: "Texte court",
            instructions: "",
            example: "Entrepreneuriat",
          },
          {
            name: "Article 2 – Date",
            type: "Texte court",
            instructions: "",
            example: "24 Jan 2025",
          },
          {
            name: "Article 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "5 erreurs à éviter quand on lance son business en RDC",
          },
          {
            name: "Article 2 – Description courte",
            type: "Texte long",
            instructions: "Maximum 150 caractères.",
            example: "Les pièges courants et nos conseils pour réussir votre lancement.",
          },
          {
            name: "Article 3 – Image",
            type: "Image JPEG/PNG",
            instructions: "Nommer : journal-article-03-image-01.jpg",
            example: "journal-article-03-image-01.jpg",
          },
          {
            name: "Article 3 – Catégorie",
            type: "Texte court",
            instructions: "",
            example: "Actualités",
          },
          {
            name: "Article 3 – Date",
            type: "Texte court",
            instructions: "",
            example: "20 Jan 2025",
          },
          {
            name: "Article 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Retour sur notre atelier « Pitch parfait » de janvier",
          },
          {
            name: "Article 3 – Description courte",
            type: "Texte long",
            instructions: "Maximum 150 caractères.",
            example: "Plus de 40 entrepreneures ont participé. Les moments forts en images.",
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── DEVENIR MEMBRE ─────────────────────────────
  {
    id: "devenir-membre",
    name: "Devenir membre",
    route: "/devenir-membre",
    description:
      "Page de conversion principale. Présente les formules d'adhésion, les tarifs, les témoignages et un CTA final pour rejoindre le Club.",
    sections: [
      {
        id: "membre-banniere",
        name: "Bannière",
        visual: "Image ou fond coloré plein écran. Titre centré, sous-titre, bouton CTA.",
        fields: [
          {
            name: "Image de fond",
            type: "Image JPEG/PNG",
            instructions:
              "Photo pleine largeur, aspect cinématique. Minimum 1920×800 px. Nommer : devenir-membre-banniere-fond-01.jpg",
            example: "devenir-membre-banniere-fond-01.jpg",
          },
          {
            name: "Titre (H1)",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Rejoins la communauté Club M",
          },
          {
            name: "Sous-titre",
            type: "Texte court",
            instructions: "Maximum 150 caractères.",
            example: "Choisis ta formule et commence dès aujourd'hui ton parcours d'entrepreneuriat structuré.",
          },
          {
            name: "Bouton CTA – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Voir les formules",
          },
        ],
      },
      {
        id: "membre-choix",
        name: "Section « Choix de formule »",
        visual:
          "Fond clair. Titre centré. Grille de 2 ou 3 cartes représentant chaque formule avec ses avantages.",
        fields: [
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Quelle formule te correspond ?",
          },
          {
            name: "Formule 1 – Nom",
            type: "Texte court",
            instructions: "Nom de la formule. Maximum 30 caractères.",
            example: "Essentielle",
          },
          {
            name: "Formule 1 – Description courte",
            type: "Texte long",
            instructions: "Phrase de positionnement. Maximum 120 caractères.",
            example: "Pour celles qui débutent et cherchent à construire leur réseau.",
          },
          {
            name: "Formule 1 – Avantage 1",
            type: "Texte court",
            instructions: "Point listé. Maximum 60 caractères.",
            example: "Accès au groupe WhatsApp",
          },
          {
            name: "Formule 1 – Avantage 2",
            type: "Texte court",
            instructions: "",
            example: "Accès aux événements mensuels",
          },
          {
            name: "Formule 1 – Avantage 3",
            type: "Texte court",
            instructions: "",
            example: "Annuaire des membres",
          },
          {
            name: "Formule 2 – Nom",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Premium",
          },
          {
            name: "Formule 2 – Description courte",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Pour celles qui veulent structurer et accélérer leur business.",
          },
          {
            name: "Formule 2 – Avantage 1",
            type: "Texte court",
            instructions: "",
            example: "Tout de la formule Essentielle",
          },
          {
            name: "Formule 2 – Avantage 2",
            type: "Texte court",
            instructions: "",
            example: "Accès Business Aligné",
          },
          {
            name: "Formule 2 – Avantage 3",
            type: "Texte court",
            instructions: "",
            example: "Coaching individuel (2 sessions/mois)",
          },
          {
            name: "Badge formule recommandée",
            type: "Texte court",
            instructions: "Texte du badge sur la formule mise en avant. Maximum 20 caractères.",
            example: "Populaire",
          },
        ],
      },
      {
        id: "membre-prix",
        name: "Section « Tarifs »",
        visual: "Tableau de prix. Chaque colonne = une formule avec son prix et ses inclusions.",
        fields: [
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Des tarifs adaptés à chaque étape",
          },
          {
            name: "Formule 1 – Prix mensuel",
            type: "Texte court",
            instructions: "Montant + devise. Ex : 50 USD / mois.",
            example: "50 USD / mois",
          },
          {
            name: "Formule 1 – Prix annuel (si applicable)",
            type: "Texte court",
            instructions: "Montant annuel avec mention de l'économie réalisée.",
            example: "500 USD / an (2 mois offerts)",
          },
          {
            name: "Formule 2 – Prix mensuel",
            type: "Texte court",
            instructions: "",
            example: "120 USD / mois",
          },
          {
            name: "Formule 2 – Prix annuel",
            type: "Texte court",
            instructions: "",
            example: "1 200 USD / an (2 mois offerts)",
          },
          {
            name: "Note légale / frais d'inscription",
            type: "Texte court",
            instructions: "Information complémentaire (frais, engagement, politique d'annulation).",
            example: "Frais d'inscription unique : 30 USD. Sans engagement minimum.",
          },
        ],
      },
      {
        id: "membre-temoignages",
        name: "Section « Témoignages membres »",
        visual: "Fond clair. Carrousel ou grille de citations de membres.",
        fields: [
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Ce que disent nos membres",
          },
          {
            name: "(Réutiliser les témoignages de la page Accueil)",
            type: "—",
            instructions: "Sauf si de nouveaux témoignages spécifiques sont souhaités ici.",
            example: "Voir section Accueil > Témoignages",
          },
        ],
      },
      {
        id: "membre-faq",
        name: "Section « FAQ Adhésion »",
        visual: "Accordéon de questions spécifiques à l'adhésion.",
        fields: [
          {
            name: "Question 1",
            type: "Texte court",
            instructions: "Question spécifique à l'adhésion. Maximum 100 caractères.",
            example: "Comment puis-je résilier mon abonnement ?",
          },
          {
            name: "Réponse 1",
            type: "Texte long",
            instructions: "Maximum 400 caractères.",
            example: "Vous pouvez résilier à tout moment via votre espace membre ou en nous contactant par email.",
          },
          {
            name: "Question 2",
            type: "Texte court",
            instructions: "",
            example: "Puis-je changer de formule en cours d'abonnement ?",
          },
          {
            name: "Réponse 2",
            type: "Texte long",
            instructions: "",
            example: "Oui, vous pouvez passer à une formule supérieure à tout moment. Le changement est effectif immédiatement.",
          },
          {
            name: "Question 3",
            type: "Texte court",
            instructions: "",
            example: "Y a-t-il une période d'essai ?",
          },
          {
            name: "Réponse 3",
            type: "Texte long",
            instructions: "",
            example: "Nous proposons un mois découverte. Contactez-nous pour en bénéficier.",
          },
        ],
      },
      {
        id: "membre-cta",
        name: "Section CTA Final « Rejoindre »",
        visual: "Bloc centré, fond coloré. Titre accrocheur, sous-titre, bouton d'action.",
        fields: [
          {
            name: "Titre",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Prête à rejoindre une communauté qui te propulse ?",
          },
          {
            name: "Sous-titre",
            type: "Texte long",
            instructions: "Maximum 150 caractères.",
            example: "Rejoins plus de 250 femmes entrepreneures à Kinshasa.",
          },
          {
            name: "Bouton – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Rejoindre le Club maintenant",
          },
        ],
      },
    ],
  },

  // ────────────────────────────── BUSINESS ALIGNÉ ──────────────────────────────
  {
    id: "business-aligne",
    name: "Business Aligné",
    route: "/business-aligne",
    description:
      "Présente le programme Business Aligné en 9 sections : bannière, description du parcours, accroche problème, tableau comparatif avant/après, témoignages, présentation de la fondatrice Maurelle, tarifs, FAQ et CTA final.",
    sections: [
      // 1 ─ Banner
      {
        id: "ba-banniere",
        name: "Bannière Hero",
        visual:
          "Plein écran (95vh), image de fond avec voile sombre 40%. Titre très grand à gauche (7 colonnes), sous-titre, bouton 'Réserver ma session'.",
        fields: [
          {
            name: "Image de fond",
            type: "Image JPEG/PNG",
            instructions:
              "Photo pleine largeur, style cinématique. Minimum 1920×1080 px. Nommer : business-aligne-banniere-fond-01.jpg",
            example: "business-aligne-banniere-fond-01.jpg",
          },
          {
            name: "Titre (H1)",
            type: "Texte court",
            instructions: "Maximum 80 caractères. Phrase forte et percutante.",
            example: "Ton idée mérite un plan. Et ton plan mérite d'être imbattable.",
          },
          {
            name: "Sous-titre",
            type: "Texte court",
            instructions: "Maximum 150 caractères.",
            example:
              "Business Aligné, le parcours de la femme entrepreneuse en République Démocratique du Congo.",
          },
          {
            name: "Bouton CTA – Libellé",
            type: "Texte court",
            instructions: "Bouton principal brun. Maximum 30 caractères.",
            example: "Réserver ma session",
          },
        ],
      },

      // 2 ─ BlockDescrip
      {
        id: "ba-descrip",
        name: "Section « Comment ça marche ? »",
        visual:
          "Fond blanc. Colonne gauche : grande image avec badge stat superposé. Colonne droite : étiquette, titre, description, grille de 4 fonctionnalités (icône + titre + sous-titre), bouton CTA.",
        fields: [
          {
            name: "Image principale",
            type: "Image JPEG/PNG",
            instructions:
              "Portrait ou paysage. Minimum 800×600 px. Nommer : business-aligne-descrip-image-01.jpg",
            example: "business-aligne-descrip-image-01.jpg",
          },
          {
            name: "Badge image – Chiffre",
            type: "Texte court",
            instructions: "Chiffre clé affiché dans le badge foncé en bas de l'image.",
            example: "+150",
          },
          {
            name: "Badge image – Label",
            type: "Texte court",
            instructions: "Label sous le chiffre. Maximum 25 caractères.",
            example: "Femmes accompagnées",
          },
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Petit label brun au-dessus du titre. Maximum 40 caractères.",
            example: "Comment ça marche ?",
          },
          {
            name: "Titre principal",
            type: "Texte court",
            instructions: "Maximum 60 caractères. Peut contenir un saut de ligne.",
            example: "4 étapes. 4 semaines. 1 vision claire.",
          },
          {
            name: "Description",
            type: "Texte long",
            instructions: "Paragraphe sous le titre. Maximum 200 caractères.",
            example:
              "Un parcours structuré et humain. Pas un cours en ligne. Un vrai accompagnement individuel.",
          },
          {
            name: "Fonctionnalité 1 – Titre",
            type: "Texte court",
            instructions: "Titre de la 1re mini-carte. Maximum 30 caractères.",
            example: "Clarification",
          },
          {
            name: "Fonctionnalité 1 – Description",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Clarifie ton idée de business avant de te lancer",
          },
          {
            name: "Fonctionnalité 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Structuration",
          },
          {
            name: "Fonctionnalité 2 – Description",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Cadre, méthode, plan d'action.",
          },
          {
            name: "Fonctionnalité 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Plan d'action",
          },
          {
            name: "Fonctionnalité 3 – Description",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Mise en place de ton plan d'action.",
          },
          {
            name: "Fonctionnalité 4 – Titre",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Suivi",
          },
          {
            name: "Fonctionnalité 4 – Description",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Suivi de ton projet et de ton avancement.",
          },
          {
            name: "Bouton CTA – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Réserver ma session",
          },
        ],
      },

      // 3 ─ BlockAccompagn
      {
        id: "ba-accompagn",
        name: "Section « Le problème ressenti »",
        visual:
          "Fond gris clair (#f8f8f8). Bloc de titre centré uniquement : étiquette brun + grand titre d'accroche. Pas de cartes ici (contrairement à la page Accueil).",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label brun, majuscules. Maximum 40 caractères.",
            example: "Le problème ressenti",
          },
          {
            name: "Titre d'accroche",
            type: "Texte court",
            instructions:
              "Grande phrase percutante, centrée. Maximum 80 caractères.",
            example: "Tu sais que tu peux. Mais tu tournes en rond.",
          },
        ],
      },

      // 4 ─ BlockStep (comparatif Avant / Après)
      {
        id: "ba-step",
        name: "Section « Ce que Business Aligné transforme »",
        visual:
          "Fond foncé (#091626) avec motif de points blancs. Titre centré. 3 colonnes : colonne 'Sans Business Aligné' (carte blanche, croix rouges), colonne 'Avec Business Aligné' (carte blanche, coches brunes), colonne image avec lien CTA.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label brun, majuscules. Maximum 30 caractères.",
            example: "Avantages",
          },
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Ce que Business Aligné transforme",
          },
          {
            name: "Colonne 'Sans' – Sous-titre",
            type: "Texte court",
            instructions: "Phrase descriptive sous le titre 'Sans Business Aligné'. Maximum 80 caractères.",
            example: "La situation dans laquelle beaucoup restent bloquées.",
          },
          {
            name: "Colonne 'Sans' – Point négatif 1 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Vision floue",
          },
          {
            name: "Colonne 'Sans' – Point négatif 1 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Tu as des idées, mais rien de structuré. Tu ne sais pas par où commencer.",
          },
          {
            name: "Colonne 'Sans' – Point négatif 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Doutes permanents",
          },
          {
            name: "Colonne 'Sans' – Point négatif 2 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Tu hésites sur le positionnement, le marché, la viabilité. Tu tournes en boucle.",
          },
          {
            name: "Colonne 'Sans' – Point négatif 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Temps et argent perdus",
          },
          {
            name: "Colonne 'Sans' – Point négatif 3 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Sans cadre ni méthode, tu avances à tâtons en perdant des ressources précieuses.",
          },
          {
            name: "Colonne 'Sans' – Point négatif 4 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Isolement",
          },
          {
            name: "Colonne 'Sans' – Point négatif 4 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Pas de regard extérieur. Tu décides seule, sans feedback professionnel.",
          },
          {
            name: "Colonne 'Avec' – Sous-titre",
            type: "Texte court",
            instructions: "Phrase descriptive sous le titre 'Avec Business Aligné'. Maximum 80 caractères.",
            example: "Ce que tu obtiens en 4 semaines.",
          },
          {
            name: "Colonne 'Avec' – Point positif 1 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Une vision claire de ton projet",
          },
          {
            name: "Colonne 'Avec' – Point positif 1 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Ton idée est posée, structurée, facile à expliquer à n'importe qui.",
          },
          {
            name: "Colonne 'Avec' – Point positif 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Un positionnement cohérent",
          },
          {
            name: "Colonne 'Avec' – Point positif 2 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Ton projet est aligné avec ta vie, tes ressources et ton marché.",
          },
          {
            name: "Colonne 'Avec' – Point positif 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Un plan d'action concret",
          },
          {
            name: "Colonne 'Avec' – Point positif 3 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Tu sais exactement quoi faire ensuite : ajuster, pivoter ou structurer ton Business Plan.",
          },
          {
            name: "Colonne 'Avec' – Point positif 4 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Un accompagnement humain",
          },
          {
            name: "Colonne 'Avec' – Point positif 4 – Description",
            type: "Texte long",
            instructions: "Maximum 120 caractères.",
            example: "Pas un algorithme. Maurelle, en face de toi, qui connaît ton contexte.",
          },
          {
            name: "Colonne image – Photo",
            type: "Image JPEG/PNG",
            instructions:
              "Photo pleine hauteur (3e colonne). Minimum 600×700 px. Nommer : business-aligne-step-image-01.jpg",
            example: "business-aligne-step-image-01.jpg",
          },
          {
            name: "Colonne image – Texte superposé",
            type: "Texte court",
            instructions: "Phrase courte affichée en bas de l'image avec lien. Maximum 80 caractères.",
            example: "Un parcours structuré et humain. Pas un cours en ligne.",
          },
          {
            name: "Colonne image – Lien CTA – Libellé",
            type: "Texte court",
            instructions: "Texte du lien blanc en bas de la 3e colonne. Maximum 25 caractères.",
            example: "Réserver ma session",
          },
        ],
      },

      // 5 ─ BlockTestimonial
      {
        id: "ba-testimonial",
        name: "Section « Témoignages »",
        visual:
          "Fond gris clair. Carrousel centré (70% largeur). Chaque slide : photo portrait à gauche, citation + nom + rôle à droite. Navigation par points et flèches.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Majuscules. Maximum 30 caractères.",
            example: "Témoignages",
          },
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Elles l'ont vécu. Elles le racontent.",
          },
          {
            name: "(Réutiliser les témoignages de la page Accueil)",
            type: "—",
            instructions:
              "Les mêmes 4 témoignages (Malu, Ornella, Chloé, Vanessa) sont affichés ici. Si vous souhaitez des témoignages spécifiques au parcours Business Aligné, fournir de nouveaux profils avec les mêmes champs.",
            example: "Voir section Accueil > Témoignages",
          },
          {
            name: "Nouveau témoignage BA (optionnel) – Prénom",
            type: "Texte court",
            instructions: "Si témoignage spécifique au parcours BA.",
            example: "Grâce",
          },
          {
            name: "Nouveau témoignage BA (optionnel) – Rôle",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Créatrice de mode",
          },
          {
            name: "Nouveau témoignage BA (optionnel) – Ville",
            type: "Texte court",
            instructions: "",
            example: "Kinshasa",
          },
          {
            name: "Nouveau témoignage BA (optionnel) – Citation",
            type: "Texte long",
            instructions: "Entre guillemets « ». Maximum 300 caractères.",
            example: "« Business Aligné m'a permis de clarifier mon idée en 4 semaines. »",
          },
          {
            name: "Nouveau témoignage BA (optionnel) – Photo",
            type: "Image JPEG/PNG",
            instructions: "Portrait 2:3. Minimum 300×450 px. Nommer : business-aligne-temoignage-portrait-01.jpg",
            example: "business-aligne-temoignage-portrait-01.jpg",
          },
        ],
      },

      // 6 ─ BlockLuch (présentation Maurelle)
      {
        id: "ba-luch",
        name: "Section « Accompagnement – Présentation Maurelle »",
        visual:
          "Fond blanc. Colonne gauche : étiquette, titre, description, 3 points forts (icône + titre + sous-titre), carte portrait de Maurelle avec citation. Colonne droite : photo pleine hauteur de Maurelle.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label brun au-dessus du titre. Maximum 30 caractères.",
            example: "Accompagnement",
          },
          {
            name: "Titre principal",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Idée sans structure, Activité sans cadre, Besoin de financement.",
          },
          {
            name: "Description",
            type: "Texte long",
            instructions: "Paragraphe présentant Maurelle et son approche. Maximum 300 caractères.",
            example:
              "Fondatrice de Club M, Maurelle accompagne les femmes entrepreneures en RDC depuis 2019. Business Aligné n'est pas un programme automatisé, c'est une session individuelle, humaine, avec quelqu'un qui comprend ton contexte.",
          },
          {
            name: "Point fort 1 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Approche bienveillante",
          },
          {
            name: "Point fort 1 – Description",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Pas de jugement. Un regard honnête et constructif sur ton idée.",
          },
          {
            name: "Point fort 2 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Contexte RDC intégré",
          },
          {
            name: "Point fort 2 – Description",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Les réalités du terrain à Kinshasa, les contraintes locales, les opportunités réelles.",
          },
          {
            name: "Point fort 3 – Titre",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "150+ entrepreneures accompagnées",
          },
          {
            name: "Point fort 3 – Description",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Une expérience concrète avec des profils variés du tout début au pivot.",
          },
          {
            name: "Carte Maurelle – Prénom Nom",
            type: "Texte court",
            instructions: "Nom complet affiché dans la carte signature.",
            example: "Maurelle Kitebi",
          },
          {
            name: "Carte Maurelle – Titre / Rôle",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Fondatrice",
          },
          {
            name: "Carte Maurelle – Citation",
            type: "Texte long",
            instructions: "Citation personnelle entre guillemets « ». Maximum 200 caractères. Validée par Maurelle.",
            example:
              "« Mon rôle, ce n'est pas de te dire si ton idée est bonne ou mauvaise. C'est de t'aider à y voir clair toi-même. »",
          },
          {
            name: "Carte Maurelle – Photo miniature",
            type: "Image JPEG/PNG",
            instructions:
              "Petit portrait carré (apparaît dans la carte signature à gauche). Minimum 100×100 px. Nommer : business-aligne-luch-maurelle-mini-01.jpg",
            example: "business-aligne-luch-maurelle-mini-01.jpg",
          },
          {
            name: "Photo principale Maurelle (colonne droite)",
            type: "Image JPEG/PNG",
            instructions:
              "Grande photo pleine hauteur. Minimum 600×700 px. Style professionnel ou naturel. Nommer : business-aligne-luch-maurelle-photo-01.jpg",
            example: "business-aligne-luch-maurelle-photo-01.jpg",
          },
        ],
      },

      // 7 ─ BlockPrice
      {
        id: "ba-prix",
        name: "Section « Tarifs »",
        visual:
          "Fond avec image de fond et voile noir 50%. Colonne gauche : étiquette, titre, description. Colonne droite : carte sombre (#091626) avec nom du pack, prix, liste des inclusions, modes de paiement, bouton CTA.",
        fields: [
          {
            name: "Image de fond",
            type: "Image JPEG/PNG",
            instructions:
              "Photo pleine section avec voile sombre 50%. Minimum 1920×600 px. Nommer : business-aligne-prix-fond-01.jpg",
            example: "business-aligne-prix-fond-01.jpg",
          },
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Label blanc. Maximum 30 caractères.",
            example: "Tarif transparent",
          },
          {
            name: "Titre",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Un investissement. Pas une dépense.",
          },
          {
            name: "Description",
            type: "Texte long",
            instructions: "Maximum 150 caractères.",
            example:
              "Business Aligné est un service indépendant de l'abonnement Club M. Pas d'engagement, pas de surprise.",
          },
          {
            name: "Pack – Nom",
            type: "Texte court",
            instructions: "Titre du pack dans la carte tarif. Maximum 50 caractères.",
            example: "Business Aligné - Session complète",
          },
          {
            name: "Pack – Prix",
            type: "Texte court",
            instructions: "Montant + devise. Affiché en très grand.",
            example: "100 USD",
          },
          {
            name: "Pack – Note de paiement",
            type: "Texte court",
            instructions: "Précision sous le prix. Maximum 50 caractères.",
            example: "Paiement unique / pas d'abonnement",
          },
          {
            name: "Inclusion 1",
            type: "Texte court",
            instructions: "Ligne de la liste 'Ce qui est inclus'. Maximum 80 caractères.",
            example: "Formulaire guidé de définition de ton idée",
          },
          {
            name: "Inclusion 2",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Analyse complète de cohérence de ton projet",
          },
          {
            name: "Inclusion 3",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Session de feedback individuelle avec Maurelle (1h en visio)",
          },
          {
            name: "Inclusion 4",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Document de restitution personnalisé avec plan d'action",
          },
          {
            name: "Inclusion 5",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Recommandations de prochaines étapes (ajuster, pivoter ou Business Plan)",
          },
          {
            name: "Mode de paiement 1",
            type: "Texte court",
            instructions: "Mode de paiement accepté. Maximum 60 caractères.",
            example: "Mobile Money (M-Pesa, Airtel Money, Orange Money)",
          },
          {
            name: "Mode de paiement 2",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Carte bancaire (Visa, Mastercard)",
          },
          {
            name: "Mode de paiement 3",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Virement bancaire (Transfert direct)",
          },
          {
            name: "Bouton CTA – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Réserver ma session",
          },
        ],
      },

      // 8 ─ BlockFaq
      {
        id: "ba-faq",
        name: "Section « FAQ »",
        visual:
          "Fond gris clair. Accordéon centré (8/12 colonnes). Étiquette + titre centré en haut, puis accordéon blanc avec 3 questions/réponses.",
        fields: [
          {
            name: "Étiquette de section",
            type: "Texte court",
            instructions: "Majuscules. Maximum 40 caractères.",
            example: "QUESTIONS FRÉQUENTES",
          },
          {
            name: "Titre",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Toutes tes questions, nos réponses",
          },
          {
            name: "Question 1",
            type: "Texte court",
            instructions: "Maximum 100 caractères.",
            example: "Que se passe-t-il après le Business Aligné ?",
          },
          {
            name: "Réponse 1",
            type: "Texte long",
            instructions: "Maximum 400 caractères.",
            example:
              "Après le Business Aligné, vous pouvez approfondir avec nos Ateliers & Masterclass ou développer votre visibilité via l'Annuaire Business.",
          },
          {
            name: "Question 2",
            type: "Texte court",
            instructions: "Maximum 100 caractères.",
            example: "Que se passe-t-il si mon idée n'est pas validée ?",
          },
          {
            name: "Réponse 2",
            type: "Texte long",
            instructions: "Maximum 400 caractères.",
            example:
              "Nous te donnons un retour constructif avec des pistes d'amélioration. Tu peux ajuster ton idée et revenir, soit explorer d'autres opportunités avec notre aide.",
          },
          {
            name: "Question 3",
            type: "Texte court",
            instructions: "Maximum 100 caractères.",
            example: "Dois-je avoir une idée entièrement développée pour commencer ?",
          },
          {
            name: "Réponse 3",
            type: "Texte long",
            instructions: "Maximum 400 caractères.",
            example:
              "Non ! Le Business Aligné est justement conçu pour clarifier votre idée, même si elle est encore floue. Nous vous aidons à la structurer et à valider sa cohérence avant d'avancer.",
          },
        ],
      },

      // 9 ─ BlockCta
      {
        id: "ba-cta",
        name: "Section CTA Final",
        visual:
          "Plein largeur. Image de fond avec voile noir 40%. Titre centré en blanc, sous-titre, 2 boutons côte à côte : 'Rejoindre le club' (brun) et 'Parler de ton projet' (blanc).",
        fields: [
          {
            name: "Image de fond",
            type: "Image JPEG/PNG",
            instructions:
              "Photo inspirante pleine largeur. Minimum 1920×700 px. Nommer : business-aligne-cta-fond-01.jpg",
            example: "business-aligne-cta-fond-01.jpg",
          },
          {
            name: "Titre",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Prête à clarifier ton idée ?",
          },
          {
            name: "Sous-titre",
            type: "Texte long",
            instructions: "Maximum 180 caractères.",
            example:
              "Rejoins les 150+ femmes qui ont transformé leur vision en projet concret grâce au Business Aligné du Club M.",
          },
          {
            name: "Bouton 1 – Libellé (principal, brun)",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Rejoindre le club",
          },
          {
            name: "Bouton 2 – Libellé (secondaire, blanc)",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Parler de ton projet",
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── À PROPOS ───────────────────────────────────
  {
    id: "a-propos",
    name: "À propos",
    route: "/a-propos",
    description:
      "Présente l'histoire, la vision, la mission, l'équipe et les partenaires du Club M.",
    sections: [
      {
        id: "apropos-banniere",
        name: "Bannière",
        visual: "Image de fond avec titre de page.",
        fields: [
          {
            name: "Image de fond",
            type: "Image JPEG/PNG",
            instructions: "Minimum 1920×800 px. Nommer : a-propos-banniere-fond-01.jpg",
            example: "a-propos-banniere-fond-01.jpg",
          },
          {
            name: "Titre (H1)",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "À propos de Club M",
          },
        ],
      },
      {
        id: "apropos-intro",
        name: "Section « À propos du Club »",
        visual: "Image à gauche, texte à droite. Titre, 2 paragraphes, bouton.",
        fields: [
          {
            name: "Image",
            type: "Image JPEG/PNG",
            instructions: "Photo illustrant l'ambiance du Club. Minimum 600×500 px. Nommer : a-propos-intro-image-01.jpg",
            example: "a-propos-intro-image-01.jpg",
          },
          {
            name: "Titre",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Le Club M, c'est quoi exactement ?",
          },
          {
            name: "Paragraphe 1",
            type: "Texte long",
            instructions: "Maximum 300 caractères.",
            example:
              "Club M est le premier incubateur féminin structurant de la République Démocratique du Congo, fondé en 2022.",
          },
          {
            name: "Paragraphe 2",
            type: "Texte long",
            instructions: "Maximum 300 caractères.",
            example:
              "Notre mission : offrir aux femmes entrepreneures un cadre, un réseau et des outils pour transformer leurs idées en projets viables.",
          },
        ],
      },
      {
        id: "apropos-vision",
        name: "Section « Vision & Mission »",
        visual: "Deux colonnes ou deux blocs côte à côte : Vision d'un côté, Mission de l'autre.",
        fields: [
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 50 caractères.",
            example: "Notre Vision & Notre Mission",
          },
          {
            name: "Vision – Titre",
            type: "Texte court",
            instructions: "Maximum 20 caractères.",
            example: "Notre Vision",
          },
          {
            name: "Vision – Texte",
            type: "Texte long",
            instructions: "Maximum 300 caractères.",
            example:
              "Un Congo où chaque femme qui ose entreprendre dispose d'un écosystème solide pour réussir.",
          },
          {
            name: "Mission – Titre",
            type: "Texte court",
            instructions: "Maximum 20 caractères.",
            example: "Notre Mission",
          },
          {
            name: "Mission – Texte",
            type: "Texte long",
            instructions: "Maximum 300 caractères.",
            example:
              "Structurer, connecter et accélérer les projets des femmes entrepreneures en RDC à travers la communauté, l'accompagnement et l'activation.",
          },
        ],
      },
      {
        id: "apropos-equipe",
        name: "Section « L'équipe »",
        visual: "Grille de cartes membres d'équipe : photo, prénom + nom, rôle.",
        fields: [
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "L'équipe Club M",
          },
          {
            name: "Membre 1 – Prénom Nom",
            type: "Texte court",
            instructions: "Nom complet.",
            example: "Adèle Morel",
          },
          {
            name: "Membre 1 – Rôle",
            type: "Texte court",
            instructions: "Titre du poste. Maximum 50 caractères.",
            example: "Fondatrice & Directrice",
          },
          {
            name: "Membre 1 – Photo",
            type: "Image JPEG/PNG",
            instructions:
              "Portrait carré ou 3:4. Fond neutre recommandé. Minimum 400×400 px. Nommer : a-propos-equipe-membre-01.jpg",
            example: "a-propos-equipe-membre-01.jpg",
          },
          {
            name: "Membre 2 – Prénom Nom",
            type: "Texte court",
            instructions: "",
            example: "Sophie Kalala",
          },
          {
            name: "Membre 2 – Rôle",
            type: "Texte court",
            instructions: "",
            example: "Responsable Programmes",
          },
          {
            name: "Membre 2 – Photo",
            type: "Image JPEG/PNG",
            instructions: "Nommer : a-propos-equipe-membre-02.jpg",
            example: "a-propos-equipe-membre-02.jpg",
          },
          {
            name: "Membre 3 – Prénom Nom",
            type: "Texte court",
            instructions: "",
            example: "Clara Mutombo",
          },
          {
            name: "Membre 3 – Rôle",
            type: "Texte court",
            instructions: "",
            example: "Coordinatrice Événements",
          },
          {
            name: "Membre 3 – Photo",
            type: "Image JPEG/PNG",
            instructions: "Nommer : a-propos-equipe-membre-03.jpg",
            example: "a-propos-equipe-membre-03.jpg",
          },
        ],
      },
      {
        id: "apropos-partenaires",
        name: "Section « Partenaires »",
        visual: "Logos partenaires en ligne horizontale.",
        fields: [
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 40 caractères.",
            example: "Nos partenaires",
          },
          {
            name: "Partenaire 1 – Nom",
            type: "Texte court",
            instructions: "Nom de l'organisation partenaire.",
            example: "ONG Femmes RDC",
          },
          {
            name: "Partenaire 1 – Logo",
            type: "Image PNG/SVG",
            instructions:
              "Logo fond transparent. Hauteur recommandée : 60 px. Nommer : a-propos-partenaire-logo-01.png",
            example: "a-propos-partenaire-logo-01.png",
          },
          {
            name: "Partenaire 2 – Nom",
            type: "Texte court",
            instructions: "",
            example: "Fonds Impact Congo",
          },
          {
            name: "Partenaire 2 – Logo",
            type: "Image PNG/SVG",
            instructions: "Nommer : a-propos-partenaire-logo-02.png",
            example: "a-propos-partenaire-logo-02.png",
          },
          {
            name: "Partenaire 3 – Nom",
            type: "Texte court",
            instructions: "",
            example: "Banque XYZ",
          },
          {
            name: "Partenaire 3 – Logo",
            type: "Image PNG/SVG",
            instructions: "Nommer : a-propos-partenaire-logo-03.png",
            example: "a-propos-partenaire-logo-03.png",
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── ÉVÉNEMENTS ─────────────────────────────────
  {
    id: "evenements",
    name: "Événements",
    route: "/evenements",
    description:
      "Liste tous les événements à venir et passés du Club. Chaque événement a une fiche détaillée.",
    sections: [
      {
        id: "events-banniere",
        name: "Bannière de page",
        visual: "Titre de page 'Événements' sur fond coloré ou image.",
        fields: [
          {
            name: "Titre de page",
            type: "Texte court",
            instructions: "Titre affiché dans la bannière.",
            example: "Événements",
          },
          {
            name: "Image de fond (optionnel)",
            type: "Image JPEG/PNG",
            instructions: "Nommer : evenements-banniere-fond-01.jpg",
            example: "evenements-banniere-fond-01.jpg",
          },
        ],
      },
      {
        id: "events-liste",
        name: "Liste des événements",
        visual:
          "Grille de cartes événements. Chaque carte : image, badge type, prix, date, titre, lieu.",
        fields: [
          {
            name: "Événement 1 – Image de couverture",
            type: "Image JPEG/PNG",
            instructions:
              "Photo de l'événement ou visuel promotionnel. Format 16:9. Minimum 800×450 px. Nommer : evenements-event-01-image-01.jpg",
            example: "evenements-event-01-image-01.jpg",
          },
          {
            name: "Événement 1 – Type",
            type: "Texte court",
            instructions: "Badge affiché sur la carte. Ex : Conférence, Lunch, Atelier.",
            example: "Lunch",
          },
          {
            name: "Événement 1 – Titre",
            type: "Texte court",
            instructions: "Maximum 80 caractères.",
            example: "Business Women Lunch",
          },
          {
            name: "Événement 1 – Date",
            type: "Texte court",
            instructions: "Format : JJ/MM/AAAA ou JJ Mois AAAA.",
            example: "16/12/2025",
          },
          {
            name: "Événement 1 – Heure",
            type: "Texte court",
            instructions: "Format : HH:MM.",
            example: "12:00",
          },
          {
            name: "Événement 1 – Lieu",
            type: "Texte court",
            instructions: "Nom du lieu + ville.",
            example: "La Maison Hobah, Kinshasa",
          },
          {
            name: "Événement 1 – Prix",
            type: "Texte court",
            instructions: "Montant + devise. Indiquer 'Gratuit' si applicable.",
            example: "60 USD",
          },
          {
            name: "Événement 1 – Description courte",
            type: "Texte long",
            instructions: "Accroche de l'événement. Maximum 200 caractères.",
            example:
              "Un déjeuner networking exclusif pour connecter les femmes entrepreneures de Kinshasa.",
          },
          {
            name: "Événement 1 – Lien d'inscription",
            type: "URL",
            instructions: "URL vers le formulaire d'inscription ou la billetterie.",
            example: "https://www.clubm.cd/evenements/business-women-lunch",
          },
          {
            name: "(Répéter pour chaque événement supplémentaire)",
            type: "—",
            instructions:
              "Créer un bloc identique pour chaque nouvel événement (event-02, event-03, etc.).",
            example: "evenements-event-02-image-01.jpg",
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── JOURNAL ────────────────────────────────────
  {
    id: "journal",
    name: "Journal",
    route: "/journal",
    description: "Blog du Club M. Liste tous les articles publiés avec filtres par catégorie.",
    sections: [
      {
        id: "journal-banniere",
        name: "Bannière de page",
        visual: "Titre de page 'Journal' sur fond coloré.",
        fields: [
          {
            name: "Titre de page",
            type: "Texte court",
            instructions: "",
            example: "Journal",
          },
        ],
      },
      {
        id: "journal-liste",
        name: "Liste des articles",
        visual: "Grille de cartes articles. Chaque carte : image, catégorie, date, titre, extrait.",
        fields: [
          {
            name: "Article – Image de couverture",
            type: "Image JPEG/PNG",
            instructions:
              "Format 16:9 recommandé. Minimum 800×450 px. Nommer : journal-article-XX-image-01.jpg (XX = numéro de l'article)",
            example: "journal-article-04-image-01.jpg",
          },
          {
            name: "Article – Catégorie",
            type: "Texte court",
            instructions:
              "Choisir parmi : Témoignage, Entrepreneuriat, Actualités, Atelier, Ressources.",
            example: "Entrepreneuriat",
          },
          {
            name: "Article – Date de publication",
            type: "Texte court",
            instructions: "Format : JJ Mois AAAA.",
            example: "15 Mars 2025",
          },
          {
            name: "Article – Titre",
            type: "Texte court",
            instructions: "Maximum 100 caractères. Accrocheur et descriptif.",
            example: "Comment structurer son business plan en 7 étapes",
          },
          {
            name: "Article – Extrait",
            type: "Texte long",
            instructions: "Résumé de 2-3 phrases. Maximum 200 caractères.",
            example:
              "Un business plan solide est la base de tout projet réussi. Voici les 7 étapes essentielles pour en construire un.",
          },
          {
            name: "Article – Auteure",
            type: "Texte court",
            instructions: "Prénom Nom de l'auteure de l'article.",
            example: "Adèle Morel",
          },
          {
            name: "Article – Contenu complet",
            type: "Texte riche (HTML/Markdown)",
            instructions:
              "Corps de l'article. Peut inclure titres, paragraphes, listes, images. Fournir en fichier Word ou Google Doc.",
            example: "Fichier : journal-article-04-contenu.docx",
          },
          {
            name: "(Répéter pour chaque nouvel article)",
            type: "—",
            instructions: "Incrémenter le numéro d'article (05, 06, etc.)",
            example: "journal-article-05-image-01.jpg",
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── ANNUAIRES ──────────────────────────────────
  {
    id: "annuaires",
    name: "Annuaires / Expertes",
    route: "/annuaires",
    description: "Répertoire des expertes et mentors disponibles pour les membres du Club.",
    sections: [
      {
        id: "annuaires-hero",
        name: "Section Hero",
        visual: "Titre, sous-titre centré, bouton CTA. Fond coloré ou image.",
        fields: [
          {
            name: "Titre (H1)",
            type: "Texte court",
            instructions: "Maximum 70 caractères.",
            example: "Rencontrez nos expertes",
          },
          {
            name: "Sous-titre",
            type: "Texte long",
            instructions: "Maximum 150 caractères.",
            example:
              "Des professionnelles expérimentées pour vous guider, coacher et développer votre projet.",
          },
          {
            name: "Bouton CTA – Libellé",
            type: "Texte court",
            instructions: "Maximum 30 caractères.",
            example: "Explorer l'annuaire",
          },
        ],
      },
      {
        id: "annuaires-grille",
        name: "Grille des expertes",
        visual:
          "Grille de cartes. Filtres par catégorie au-dessus. Chaque carte : photo, nom, rôle, catégorie, note.",
        fields: [
          {
            name: "Experte 1 – Prénom Nom",
            type: "Texte court",
            instructions: "Nom complet de l'experte.",
            example: "Marie Lukusa",
          },
          {
            name: "Experte 1 – Rôle / Titre",
            type: "Texte court",
            instructions: "Titre professionnel. Maximum 50 caractères.",
            example: "Coach Business & Stratégie",
          },
          {
            name: "Experte 1 – Catégorie",
            type: "Texte court",
            instructions:
              "Ex : Finance, Marketing, Juridique, Ressources Humaines, Tech, Communication.",
            example: "Finance",
          },
          {
            name: "Experte 1 – Description courte",
            type: "Texte long",
            instructions: "Bio courte. Maximum 200 caractères.",
            example:
              "10 ans d'expérience en stratégie financière pour PME en Afrique centrale. Spécialisée en levée de fonds.",
          },
          {
            name: "Experte 1 – Photo",
            type: "Image JPEG/PNG",
            instructions:
              "Portrait carré ou 3:4. Fond neutre. Minimum 300×300 px. Nommer : annuaires-experte-01-photo-01.jpg",
            example: "annuaires-experte-01-photo-01.jpg",
          },
          {
            name: "(Répéter pour chaque experte)",
            type: "—",
            instructions: "Incrémenter le numéro (experte-02, experte-03, etc.)",
            example: "annuaires-experte-02-photo-01.jpg",
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── CONTACT ────────────────────────────────────
  {
    id: "contact",
    name: "Contact",
    route: "/contact",
    description: "Page de contact avec formulaire et informations de contact du Club.",
    sections: [
      {
        id: "contact-banniere",
        name: "Bannière",
        visual: "Titre de page 'Contact' sur fond coloré.",
        fields: [
          {
            name: "Titre de page",
            type: "Texte court",
            instructions: "",
            example: "Contact",
          },
        ],
      },
      {
        id: "contact-formulaire",
        name: "Section « Formulaire & Infos »",
        visual:
          "Colonne gauche : informations de contact (email, téléphone, adresse, horaires). Colonne droite : formulaire (Nom, Email, Sujet, Message).",
        fields: [
          {
            name: "Titre de section",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Parlez-nous de votre projet",
          },
          {
            name: "Description",
            type: "Texte long",
            instructions: "Maximum 200 caractères.",
            example:
              "Notre équipe est disponible du lundi au vendredi pour répondre à toutes vos questions.",
          },
          {
            name: "Email de contact",
            type: "Email",
            instructions: "Adresse email publique.",
            example: "contact@clubm.cd",
          },
          {
            name: "Numéro de téléphone",
            type: "Texte court",
            instructions: "Avec indicatif pays.",
            example: "+243 97 000 0000",
          },
          {
            name: "Adresse physique",
            type: "Texte court",
            instructions: "Adresse complète si applicable.",
            example: "Kinshasa, République Démocratique du Congo",
          },
          {
            name: "Horaires d'ouverture",
            type: "Texte court",
            instructions: "Maximum 60 caractères.",
            example: "Lundi – Vendredi : 9h00 – 17h00",
          },
          {
            name: "Message de confirmation (après envoi formulaire)",
            type: "Texte court",
            instructions: "Message affiché après soumission du formulaire.",
            example: "Merci ! Nous vous répondons sous 48h.",
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── MENTIONS LÉGALES ───────────────────────────
  {
    id: "mentions-legales",
    name: "Mentions légales",
    route: "/mentions-legales",
    description: "Page légale obligatoire. Contient les informations sur l'éditeur du site.",
    sections: [
      {
        id: "legal-contenu",
        name: "Contenu légal",
        visual: "Page textuelle simple. Sections : Éditeur, Hébergeur, Propriété intellectuelle.",
        fields: [
          {
            name: "Nom de l'entreprise / association",
            type: "Texte court",
            instructions: "Raison sociale officielle.",
            example: "Club M ASBL",
          },
          {
            name: "Numéro RCCM / immatriculation",
            type: "Texte court",
            instructions: "Numéro d'enregistrement officiel si applicable.",
            example: "RCCM/KIN/XXXXXXX",
          },
          {
            name: "Adresse du siège social",
            type: "Texte court",
            instructions: "Adresse légale complète.",
            example: "Avenue XYZ, Commune de Gombe, Kinshasa, RDC",
          },
          {
            name: "Directeur de la publication",
            type: "Texte court",
            instructions: "Prénom et Nom du responsable légal du site.",
            example: "Adèle Morel",
          },
          {
            name: "Email de contact légal",
            type: "Email",
            instructions: "Email pour les demandes légales.",
            example: "legal@clubm.cd",
          },
          {
            name: "Nom de l'hébergeur",
            type: "Texte court",
            instructions: "Société hébergeant le site.",
            example: "Vercel Inc.",
          },
          {
            name: "Adresse de l'hébergeur",
            type: "Texte court",
            instructions: "Adresse de l'hébergeur.",
            example: "340 S Lemon Ave #4133, Walnut, CA 91789, USA",
          },
        ],
      },
    ],
  },
];

// ─── Helper utilities ─────────────────────────────────────────────────────────
const PAGE_CODES: Record<string, string> = {
  accueil: "HOME",
  "devenir-membre": "MEMBRE",
  "business-aligne": "BA",
  "a-propos": "ABOUT",
  evenements: "EVENTS",
  journal: "BLOG",
  annuaires: "ANNUAIRE",
  contact: "CONTACT",
  "mentions-legales": "MENTIONS",
};

function getPageCode(pageId: string): string {
  return PAGE_CODES[pageId] ?? pageId.toUpperCase().replace(/-/g, "_");
}

/** Route utilisée pour l’iframe d’aperçu (page réelle). */
function getPreviewRoute(page: PageDef): string {
  return page.route.startsWith("/") ? page.route : "/";
}

/** URL d’aperçu sans navbar ni footer (?nochrome=1). */
function getPreviewUrl(page: PageDef): string {
  const path = getPreviewRoute(page);
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}nochrome=1`;
}

function getSectionCode(index: number): string {
  return `S${String(index + 1).padStart(2, "0")}`;
}

function fieldCode(fieldName: string, idx: number): string {
  const n = fieldName.toLowerCase();
  if (n.includes("vidéo") || n.includes("video")) return "VIDEO01";
  if (
    n.includes("image") ||
    n.includes("photo") ||
    n.includes("portrait") ||
    n.includes("fond") ||
    n.includes("logo")
  ) {
    const m = n.match(/(\d+)/);
    return `IMG${m ? m[1].padStart(2, "0") : String(idx + 1).padStart(2, "0")}.jpg`;
  }
  if (n.includes("badge") || n.includes("étiquette")) return "BADGE";
  if (n.includes("(h1)") || n.includes("titre principal") || n.includes("titre (h1)"))
    return "TITLE";
  if (n.includes("sous-titre")) return "SUBTITLE";
  if (n.includes("titre") && (n.includes("section") || n.includes("de section")))
    return "TITLE";
  if (n.includes("titre")) {
    const m = n.match(/\d+/);
    const isItem =
      n.includes("card") ||
      n.includes("carte") ||
      n.includes("pilier") ||
      n.includes("fonctionnalité") ||
      n.includes("point");
    if (m && isItem) return `ITEM${m[0].padStart(2, "0")}_TITLE`;
    if (m) return `TITLE${m[0].padStart(2, "0")}`;
    return "TITLE";
  }
  if (n.includes("accroche")) return "SUBTITLE";
  if (n.includes("paragraphe") || n.includes("description") || n.includes("contenu")) {
    const m = n.match(/\d+/);
    return m ? `TEXT${m[0].padStart(2, "0")}` : "TEXT";
  }
  if (n.includes("bouton") || n.includes("cta")) return "CTA";
  if (n.includes("citation") || n.includes("quote")) return "QUOTE";
  if (n.includes("prénom") || n.includes("nom complet")) return "NAME";
  if (n.includes("rôle") || n.includes("titre profess")) return "ROLE";
  if (n.includes("question")) {
    const m = n.match(/\d/);
    return m ? `Q${m[0].padStart(2, "0")}` : "Q01";
  }
  if (n.includes("réponse")) {
    const m = n.match(/\d/);
    return m ? `ANS${m[0].padStart(2, "0")}` : "ANS01";
  }
  if (
    n.includes("avantage") ||
    n.includes("bénéfice") ||
    n.includes("inclusion") ||
    n.includes("liste")
  ) {
    const m = n.match(/\d/);
    return m ? `LIST${m[0].padStart(2, "0")}` : `LIST${String(idx + 1).padStart(2, "0")}`;
  }
  if (n.includes("url") || n.includes("lien")) return "URL";
  if (n.includes("email")) return "EMAIL";
  if (n.includes("prix") || n.includes("tarif")) return "PRICE";
  if (n.includes("chiffre") || n.includes("stat") || n.includes("nombre")) return "STAT";
  return `F${String(idx + 1).padStart(2, "0")}`;
}

type ContentKind = "text" | "image" | "cta" | "list" | "quote";
interface ContentType {
  label: string;
  kind: ContentKind;
}

function getContentTypes(fields: Field[]): ContentType[] {
  const seen = new Set<string>();
  const result: ContentType[] = [];
  fields.forEach((f) => {
    const t = f.type.toLowerCase();
    const n = f.name.toLowerCase();
    if (
      (t.includes("image") || t.includes("png") || t.includes("jpg") || t.includes("svg")) &&
      !seen.has("image")
    ) {
      seen.add("image");
      result.push({ label: "Image", kind: "image" });
    } else if (t.includes("vidéo") && !seen.has("video")) {
      seen.add("video");
      result.push({ label: "Vidéo", kind: "image" });
    } else if ((n.includes("citation") || n.includes("quote")) && !seen.has("quote")) {
      seen.add("quote");
      result.push({ label: "Citation", kind: "quote" });
    } else if (
      (n.includes("cta") || n.includes("bouton") || t.includes("url")) &&
      !seen.has("cta")
    ) {
      seen.add("cta");
      result.push({ label: "CTA", kind: "cta" });
    } else if (
      (n.includes("liste") || n.includes("avantage") || n.includes("bénéfice")) &&
      !seen.has("list")
    ) {
      seen.add("list");
      result.push({ label: "Liste", kind: "list" });
    } else if (t.includes("texte") && !seen.has("text")) {
      seen.add("text");
      result.push({ label: "Texte", kind: "text" });
    }
  });
  return result;
}

// ─── Right column: Naming system banner ───────────────────────────────────────
function NamingSystemBanner({ pageCode }: { pageCode: string }) {
  return (
    <div
      style={{
        background: "rgba(165,91,70,0.08)",
        border: "1px solid rgba(165,91,70,0.2)",
        borderRadius: 12,
        padding: "16px 18px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "rgba(165,91,70,0.85)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}
      >
        Système de nommage
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontFamily: "monospace",
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        {[
          { token: "PAGE", color: "#a55b46", bg: "rgba(165,91,70,0.2)" },
          { token: "__", color: "rgba(255,255,255,0.25)", bg: "transparent" },
          { token: "SECTION", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
          { token: "__", color: "rgba(255,255,255,0.25)", bg: "transparent" },
          { token: "TYPE", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
          { token: "__", color: "rgba(255,255,255,0.25)", bg: "transparent" },
          { token: "N°", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
        ].map((item, i) => (
          <span
            key={i}
            style={{
              color: item.color,
              background: item.bg,
              padding: item.bg !== "transparent" ? "2px 8px" : "0",
              borderRadius: 4,
              letterSpacing: "0.04em",
            }}
          >
            {item.token}
          </span>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 14px",
          fontSize: 11,
        }}
      >
        {[
          { label: "PAGE", color: "#a55b46", desc: `Ex : ${pageCode}` },
          { label: "SECTION", color: "#34d399", desc: "Ex : S01, S02, S03…" },
          { label: "TYPE", color: "#60a5fa", desc: "TITLE, TEXT, IMG, CTA…" },
          { label: "N°", color: "#fbbf24", desc: "Numérotation 01, 02…" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <span
              style={{
                color: item.color,
                fontFamily: "monospace",
                fontWeight: 700,
                flexShrink: 0,
                fontSize: 10,
              }}
            >
              {item.label}
            </span>
            <span style={{ color: "rgba(228,228,231,0.42)", fontSize: 10.5 }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right column: Mapping card ───────────────────────────────────────────────
function MappingCard({
  section,
  sectionIndex,
  pageCode,
  onScrollTo,
}: {
  section: SectionBlock;
  sectionIndex: number;
  pageCode: string;
  onScrollTo: (id: string) => void;
}) {
  const secCode = getSectionCode(sectionIndex);
  const fullId = `${pageCode}__${secCode}`;
  const contentTypes = getContentTypes(section.fields);
  const activeFields = section.fields.filter((f) => f.type !== "—");

  const ctColors: Record<ContentKind, { bg: string; color: string }> = {
    text: { bg: "rgba(96,165,250,0.15)", color: "#60a5fa" },
    image: { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
    cta: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
    list: { bg: "rgba(165,91,70,0.15)", color: "#a55b46" },
    quote: { bg: "rgba(244,114,182,0.15)", color: "#f472b6" },
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "16px 16px 14px",
        marginBottom: 12,
      }}
    >
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "linear-gradient(135deg,#a55b46,#091626)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {sectionIndex + 1}
        </div>
        <code
          style={{
            fontSize: 11,
            color: "#a55b46",
            background: "rgba(165,91,70,0.15)",
            padding: "2px 8px",
            borderRadius: 5,
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {fullId}
        </code>
      </div>

      {/* Section name */}
      <h4
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#e4e4e7",
          marginBottom: 8,
          lineHeight: 1.4,
        }}
      >
        {section.name}
      </h4>

      {/* Description */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(228,228,231,0.32)",
            marginBottom: 4,
          }}
        >
          Description visuelle
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(228,228,231,0.55)", lineHeight: 1.55 }}>
          {section.visual}
        </p>
      </div>

      {/* Content types */}
      {contentTypes.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
          {contentTypes.map((ct) => {
            const c = ctColors[ct.kind];
            return (
              <span
                key={ct.label}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "2px 8px",
                  borderRadius: 100,
                  background: c.bg,
                  color: c.color,
                }}
              >
                {ct.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Separator */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.05)",
          margin: "10px 0",
        }}
      />

      {/* Fields list */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(228,228,231,0.32)",
            marginBottom: 6,
          }}
        >
          Ce que vous devrez fournir
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {activeFields.slice(0, 8).map((f, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                marginBottom: 4,
                fontSize: 11.5,
                color: "rgba(228,228,231,0.62)",
                lineHeight: 1.45,
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#a55b46",
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <span>
                {f.name}
                {f.instructions ? (
                  <span style={{ color: "rgba(228,228,231,0.38)", fontStyle: "italic" }}>
                    {" "}
                    — {f.instructions}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
          {activeFields.length > 8 && (
            <li
              style={{
                fontSize: 10.5,
                color: "rgba(228,228,231,0.28)",
                paddingLeft: 10,
                fontStyle: "italic",
              }}
            >
              + {activeFields.length - 8} champs supplémentaires…
            </li>
          )}
        </ul>
      </div>

      {/* Codes box */}
      <div
        style={{
          background: "rgba(0,0,0,0.28)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 8,
          padding: "10px 12px",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(228,228,231,0.28)",
            marginBottom: 8,
          }}
        >
          Codes à utiliser dans le document Word
        </div>
        {activeFields.slice(0, 6).map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 5,
            }}
          >
            <code
              style={{
                fontSize: 10,
                color: "#a55b46",
                fontFamily: "monospace",
                fontWeight: 700,
                background: "rgba(165,91,70,0.12)",
                padding: "1px 6px",
                borderRadius: 4,
                flexShrink: 0,
              }}
            >
              {fullId}__{fieldCode(f.name, i)}
            </code>
            <span
              style={{
                fontSize: 10,
                color: "rgba(228,228,231,0.38)",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "48%",
              }}
            >
              {f.name.length > 28 ? f.name.substring(0, 28) + "…" : f.name}
            </span>
          </div>
        ))}
        {activeFields.length > 6 && (
          <div
            style={{
              fontSize: 10,
              color: "rgba(228,228,231,0.2)",
              fontStyle: "italic",
            }}
          >
            + {activeFields.length - 6} autres codes…
          </div>
        )}
      </div>

      {/* See link button */}
      <button
        onClick={() => onScrollTo(fullId)}
        style={{
          width: "100%",
          padding: "7px 12px",
          background: "rgba(165,91,70,0.1)",
          border: "1px solid rgba(165,91,70,0.22)",
          borderRadius: 7,
          fontSize: 11.5,
          fontWeight: 600,
          color: "#a55b46",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(165,91,70,0.22)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(165,91,70,0.1)";
        }}
      >
        Voir cette section <span>→</span>
      </button>
    </div>
  );
}

// ─── Right column: Word doc example ───────────────────────────────────────────
function WordDocExample({ page, pageCode }: { page: PageDef; pageCode: string }) {
  const s1 = page.sections[0];
  const s2 = page.sections[1];
  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.05)",
          marginBottom: 20,
        }}
      />
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#e4e4e7",
          marginBottom: 4,
        }}
      >
        Exemple de document à remettre
      </h2>
      <p
        style={{
          fontSize: 11.5,
          color: "rgba(228,228,231,0.42)",
          marginBottom: 14,
        }}
      >
        Voici à quoi doit ressembler votre fichier Word, section par section.
      </p>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Doc header */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ fontSize: 16 }}>📄</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(228,228,231,0.75)",
            }}
          >
            ClubM_Textes_{pageCode}.docx
          </span>
          <span
            style={{
              fontSize: 10,
              background: "rgba(96,165,250,0.15)",
              color: "#60a5fa",
              padding: "1px 6px",
              borderRadius: 4,
              fontWeight: 700,
            }}
          >
            .docx
          </span>
        </div>
        {/* Doc body */}
        <div style={{ padding: "12px 14px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 5,
              padding: "4px 8px",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#a55b46",
              }}
            >
              PAGE : {pageCode}
            </span>
          </div>
          {s1 &&
            s1.fields
              .filter((f) => f.type !== "—")
              .slice(0, 3)
              .map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "4px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <code
                    style={{
                      fontSize: 10,
                      color: "#a55b46",
                      fontFamily: "monospace",
                      flexShrink: 0,
                      background: "rgba(165,91,70,0.1)",
                      padding: "1px 5px",
                      borderRadius: 3,
                    }}
                  >
                    {pageCode}__S01__{fieldCode(f.name, i)}
                  </code>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: "rgba(228,228,231,0.45)",
                      fontStyle: "italic",
                    }}
                  >
                    {f.example}
                  </span>
                </div>
              ))}
          {s2 &&
            s2.fields
              .filter((f) => f.type !== "—")
              .slice(0, 2)
              .map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "4px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <code
                    style={{
                      fontSize: 10,
                      color: "#a55b46",
                      fontFamily: "monospace",
                      flexShrink: 0,
                      background: "rgba(165,91,70,0.1)",
                      padding: "1px 5px",
                      borderRadius: 3,
                    }}
                  >
                    {pageCode}__S02__{fieldCode(f.name, i)}
                  </code>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: "rgba(228,228,231,0.45)",
                      fontStyle: "italic",
                    }}
                  >
                    {f.example}
                  </span>
                </div>
              ))}
          <div style={{ display: "flex", gap: 10, padding: "4px 0" }}>
            <code
              style={{
                fontSize: 10,
                color: "rgba(228,228,231,0.2)",
                fontFamily: "monospace",
                fontStyle: "italic",
              }}
            >
              …
            </code>
            <span
              style={{
                fontSize: 10.5,
                color: "rgba(228,228,231,0.2)",
                fontStyle: "italic",
              }}
            >
              sections suivantes…
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right column: Observations box ───────────────────────────────────────────
function ObservationsBox() {
  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.05)",
          marginBottom: 20,
        }}
      />
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#e4e4e7",
            marginBottom: 4,
          }}
        >
          ✏️ Observations générales
        </h3>
        <p
          style={{
            fontSize: 11.5,
            color: "rgba(228,228,231,0.38)",
            marginBottom: 14,
          }}
        >
          Espace libre pour consigner vos remarques, idées, ajustements ou suggestions.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            "Remarques sur le contenu ou le ton éditorial",
            "Idées de visuels ou d'images à utiliser",
            "Ajustements souhaités sur la structure des sections",
            "Sections à supprimer ou à ajouter",
            "Suggestions visuelles (couleurs, ambiance, style)",
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 6,
                fontSize: 12,
                color: "rgba(228,228,231,0.52)",
                lineHeight: 1.45,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(165,91,70,0.5)",
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Right column: Guide footer ───────────────────────────────────────────────
function GuideFooter() {
  return (
    <div
      style={{
        marginTop: 24,
        paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        fontSize: 11,
        color: "rgba(228,228,231,0.28)",
        lineHeight: 1.65,
      }}
    >
      <p>
        En respectant cette structure, les modifications du site seront{" "}
        <strong style={{ color: "rgba(228,228,231,0.5)" }}>
          rapides, précises et sans interprétation
        </strong>
        . Ce guide est réutilisable pour toutes les pages futures du projet.
      </p>
      <div
        style={{
          marginTop: 8,
          fontWeight: 700,
          letterSpacing: "0.08em",
          fontSize: 10,
          textTransform: "uppercase",
        }}
      >
        Club M — Guide de production de contenu v1.0
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function CahierContenus() {
  const [activePageId, setActivePageId] = useState<string>("accueil");
  const leftColRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activePage = PAGES.find((p) => p.id === activePageId) ?? PAGES[0];
  const pageCode = getPageCode(activePage.id);

  const totalFields = PAGES.reduce(
    (acc, p) => acc + p.sections.reduce((a, s) => a + s.fields.length, 0),
    0
  );
  const totalSections = PAGES.reduce((acc, p) => acc + p.sections.length, 0);

  const scrollToSection = (id: string) => {
    const win = iframeRef.current?.contentWindow;
    if (win) {
      try {
        win.location.hash = id;
        const el = win.document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {
        try {
          win.location.hash = id;
        } catch {}
      }
    }
  };

  return (
    <div
      style={{
        background: "#07060b",
        color: "#e4e4e7",
        fontFamily: "Inter, sans-serif",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Global sticky header ── */}
      <header
        style={{
          flexShrink: 0,
          height: 53,
          background: "#091626",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          zIndex: 50,
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16 }}>📄</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#e4e4e7",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Cahier de contenus — Club M
          </span>
          <span
            style={{
              fontSize: 10,
              background: "rgba(165,91,70,0.25)",
              color: "#a55b46",
              padding: "2px 8px",
              borderRadius: 100,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            v1.0
          </span>
          <span
            style={{
              fontSize: 10,
              background: "rgba(52,211,153,0.13)",
              color: "#34d399",
              padding: "2px 8px",
              borderRadius: 100,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {PAGES.length} pages · {totalSections} sections · {totalFields} champs
          </span>
        </div>

        {/* Page tabs */}
        <nav
          style={{
            display: "flex",
            gap: 2,
            flex: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePageId(p.id)}
              style={{
                padding: "5px 11px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                background:
                  activePageId === p.id ? "rgba(165,91,70,0.22)" : "transparent",
                color:
                  activePageId === p.id
                    ? "#a55b46"
                    : "rgba(228,228,231,0.48)",
                outline: "none",
              }}
              onMouseOver={(e) => {
                if (activePageId !== p.id)
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(228,228,231,0.75)";
              }}
              onMouseOut={(e) => {
                if (activePageId !== p.id)
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(228,228,231,0.48)";
              }}
            >
              {p.name}
            </button>
          ))}
        </nav>

      </header>

      {/* ── Main 2-column layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 480px",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* ── Left column: aperçu de la vraie page ── */}
        <div
          ref={leftColRef}
          style={{
            overflow: "hidden",
            background: "#eeede9",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Bandeau page (sticky) */}
          <div
            style={{
              background: "#091626",
              padding: "12px 20px 10px",
              borderBottom: "2px solid rgba(165,91,70,0.35)",
              flexShrink: 0,
              zIndex: 5,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.38)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 2,
              }}
            >
              Aperçu de la page
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                {activePage.name}
              </span>
              <code
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.38)",
                  background: "rgba(255,255,255,0.07)",
                  padding: "2px 8px",
                  borderRadius: 5,
                  fontFamily: "monospace",
                }}
              >
                {getPreviewUrl(activePage)}
              </code>
            </div>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.38)",
                marginTop: 2,
                lineHeight: 1.45,
              }}
            >
              {activePage.description}
            </p>
          </div>

          {/* Iframe : rendu de la vraie page du site */}
          <iframe
            ref={iframeRef}
            key={activePageId}
            src={getPreviewUrl(activePage)}
            title={`Aperçu : ${activePage.name}`}
            style={{
              flex: 1,
              width: "100%",
              minHeight: 0,
              border: "none",
              display: "block",
            }}
          />
        </div>

        {/* ── Right column: guide panel ── */}
        <div
          style={{
            overflowY: "auto",
            background: "#091626",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sticky col header */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#091626",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(228,228,231,0.32)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 2,
                }}
              >
                Guide de contenu
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#e4e4e7",
                }}
              >
                {activePage.name}{" "}
                <span
                  style={{
                    color: "#a55b46",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                >
                  ({pageCode})
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(228,228,231,0.38)",
                background: "rgba(255,255,255,0.04)",
                padding: "4px 10px",
                borderRadius: 6,
              }}
            >
              {activePage.sections.length} section
              {activePage.sections.length > 1 ? "s" : ""}
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ padding: "20px 20px 40px", flex: 1 }}>
            <NamingSystemBanner pageCode={pageCode} />

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(228,228,231,0.3)",
                marginBottom: 12,
              }}
            >
              Cartographie des sections
            </div>

            {activePage.sections.map((section, i) => (
              <MappingCard
                key={section.id}
                section={section}
                sectionIndex={i}
                pageCode={pageCode}
                onScrollTo={scrollToSection}
              />
            ))}

            <WordDocExample page={activePage} pageCode={pageCode} />
            <ObservationsBox />
            <GuideFooter />
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(165,91,70,0.28); border-radius: 3px; }
        nav::-webkit-scrollbar { height: 0; }
        @media (max-width: 1100px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
        @media print {
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}
