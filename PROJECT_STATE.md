# Club M — Etat du Projet

**Derniere mise a jour** : 25 mars 2026
**Version** : MVP 1.0
**Status global** : MVP fonctionnel, gaps identifies, pret pour Phase 2

## Architecture

- Next.js 16 monolithe modulaire avec route groups
- Prisma 7 + PostgreSQL (adapter PrismaPg)
- Auth.js v5 (JWT, Credentials, split config Edge/Server)
- 12 domaines metier, 4 integrations, 17 modeles DB
- 53 pages fonctionnelles, 106 composants, 0 erreur TypeScript

## Ce qui fonctionne (100%)

### Infrastructure
- Schema Prisma 17 modeles avec migration appliquee
- Auth.js v5 avec guards 3 niveaux (middleware + layout + action)
- Middleware route protection
- Audit logging sur actions sensibles
- Seed data realiste (50 commandes, 5 business, 15 produits, contexte Kinshasa)

### Espace Public / Site Vitrine
- Homepage avec design original (banner, blocs, FAQ)
- Pages : a-propos, contact (formulaire fonctionnel), devenir-membre, evenements, annuaires, journal, support, mentions-legales
- Navbar originale glassmorphism + footer dark
- Marketplace avec filtres (categorie, type, prix, commune, tri)
- Boutique publique /boutique/[slug] avec catalogue, tabs, trust badges
- Fiche produit (ajout panier, quantite, stock)
- Fiche service (UX differente : contact WhatsApp, "sur devis")

### Systeme e-commerce
- Panier (localStorage, mono-boutique, distinction produit/service)
- Checkout (adresse congolaise : commune, quartier, telephone)
- Confirmation commande avec code de livraison
- Systeme de code confirmation (6 chars, expiration 14j, validation vendeuse)
- Commission 10% calculee et stockee

### Espace Membre
- Dashboard adapte au role (Free/Premium/Business)
- Profil (edit + changement mot de passe)
- KYC (soumission documents + statut)
- Upgrade (state machine reprenable : KYC → Payment → Complete)
- Tickets evenements avec QR code
- Mes achats (historique commandes avec code)

### Module Business (dark theme premium)
- Dashboard avec KPIs, graphiques Recharts, activite recente
- Gestion commandes (liste, detail, expedier, confirmer livraison)
- Gestion produits (CRUD, stats performance, toggle actif)
- Gestion clients (liste, detail, stats, WhatsApp)
- Revenus (filtres periode, breakdown produit/type, comparaison)
- Sidebar + navbar dedies (design original dark)

### Admin
- Dashboard analytics (KPIs, charts croissance membres/revenus)
- Gestion membres (filtres, detail, KYC review, suspend/reactivate, change tier)
- Gestion evenements (CRUD, pricing dynamique, detail avec participants)
- Supervision commandes et paiements
- Moderation annuaire (approve/reject profils)
- Moderation produits
- Journal d'audit

### Integrations
- Cloudinary : OPERATIONNEL (upload, suppression, transformations)
- Resend : CONFIGURE mais API key vide (email envoye seulement pour contact form)
- Paiement : STUB (simule SUCCESS, interface abstraite prete)
- KYC : MANUEL (admin review, pas de provider externe)

## Ce qui est partiel / incomplet

- Emails : 1 seul email envoye (contact form). Templates existent dans lib/email.ts mais jamais appeles
- Upload fichiers : Cloudinary operationnel mais les formulaires utilisent des inputs URL texte
- Paiement : toutes les commandes sont marquees PAID automatiquement
- Site vitrine : evenements et annuaires branches sur DB, journal/parcours restent statiques

## Ce qui manque (identifie dans l'audit)

Voir KNOWN_GAPS.md et NEXT_STEPS.md pour le detail complet.

### Critique (bloque production)
- Password reset (forgot + reset)
- Email verification
- Emails dans toutes les actions
- Page admin KYC dediee
- Page admin detail boutique
- Detail commande acheteur (/achats/[id])

### Haute priorite
- Onboarding post-inscription
- Centre notifications in-app
- Upload fichiers Cloudinary (widget)
- Harmonisation design (3 systemes → 2)
- Responsive mobile

## Decisions produit validees

1. Monolithe Next.js avec route groups (pas de multi-app)
2. Annuaire-first (pas de marketplace anonyme)
3. Premium = vitrine, Business = commerce
4. Panier mono-boutique (1 seule vendeuse par panier)
5. Services ne vont PAS dans le panier (contact WhatsApp)
6. Code de confirmation livraison (type Uber Eats)
7. KYC manuel pour le MVP (provider externe plus tard)
8. Paiement simule pour le MVP (fintech locale plus tard)
9. URLs francaises (/profil, /achats, /mon-business)
10. Dark theme pour le business dashboard, light theme pour le site public
11. Commission 10% sur chaque commande
12. Soft-delete uniquement
