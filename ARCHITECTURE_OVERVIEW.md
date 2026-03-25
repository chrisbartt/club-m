# Club M — Vue d'ensemble Architecture

**Derniere mise a jour** : 25 mars 2026

## Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Runtime | React | 19.2.3 |
| ORM | Prisma (adapter PrismaPg) | 7.5.0 |
| Base de donnees | PostgreSQL | local (clubm) |
| Auth | Auth.js (NextAuth v5 beta) | 5.0.0-beta.30 |
| Validation | Zod | 4.3.6 |
| CSS | Tailwind CSS | 4 |
| Composants | shadcn/ui (New York) | — |
| Charts | Recharts | 2.15.4 |
| Email | Resend | 6.9.4 |
| Storage | Cloudinary | 2.9.0 |
| Hashing | bcryptjs | 3.0.3 |

## Structure des dossiers

```
app/
  (public)/              — Homepage (layout = AppContainerWebSite)
  (site)/                — Site vitrine original + marketplace + boutiques + panier + checkout
  (auth)/                — Login, register membre, register customer
  (member)/              — Espace membre protege
    dashboard/           — Dashboard adapte au tier
    profil/              — Edition profil + mot de passe
    kyc/                 — Soumission KYC
    upgrade/             — Upgrade tier
    tickets/             — Mes tickets evenements
    achats/              — Mes achats
    mon-business/        — Module business (layout dedie dark theme)
      commandes/         — Commandes recues (vendeuse)
      produits/          — Gestion produits
      clients/           — Gestion clients
      revenus/           — Suivi revenus
  (admin)/admin/         — Admin protege
    dashboard/           — Analytics globales
    membres/             — Gestion membres + KYC review
    evenements/          — CRUD evenements
    commandes/           — Supervision commandes
    paiements/           — Supervision paiements
    produits/            — Moderation produits
    annuaire/            — Moderation boutiques
    journal/             — Audit log
  api/auth/[...nextauth] — Route handler Auth.js

domains/                 — Logique metier (12 domaines)
  members/               — 8 fichiers : inscription, profil, admin actions/queries
  kyc/                   — 4 fichiers : soumission, review admin
  upgrade/               — 4 fichiers : state machine upgrade
  events/                — 5 fichiers : CRUD evenements + admin
  tickets/               — 3 fichiers : booking, QR, scan
  directory/             — 5 fichiers : profils business, moderation
  business/              — 4 fichiers : produits, dashboard queries
  orders/                — 4 fichiers : achat, livraison, confirmation
  marketplace/           — 1 fichier : queries cross-boutiques
  payments/              — 1 fichier : queries admin
  audit/                 — 2 fichiers : logging actions
  contact/               — 1 fichier : formulaire contact

integrations/            — Providers externes (4)
  payment/               — Interface PaymentProvider + stub LocalFintech
  email/                 — Interface EmailProvider + Resend
  storage/               — Interface StorageProvider + Cloudinary
  kyc/                   — Interface KycProvider + Manual

lib/                     — Utilitaires techniques
  auth.ts                — Config Auth.js complete (DB + Credentials)
  auth.config.ts         — Config Edge (sans DB, pour middleware)
  auth-guards.ts         — requireAuth, requireMember, requireAdmin, requireVerifiedBusiness, requireOwnership
  db.ts                  — Singleton Prisma (PrismaPg adapter)
  permissions.ts         — Hierarchie tiers (FREE < PREMIUM < BUSINESS) + roles admin
  routes.ts              — Chemins proteges (member, admin, auth)
  errors.ts              — AuthError, ValidationError, BusinessError (codes types)
  error-messages.ts      — Mapping erreur → message UX francais
  constants.ts           — COMMISSION_RATE (0.1), TIER_LABELS, CURRENCY_SYMBOLS, etc.
  utils.ts               — cn(), generateConfirmationCode(6), generateSlug()

components/              — 106 composants
  ui/                    — shadcn/ui (genere)
  layout/                — Navbar glassmorphism, footer dark, sidebar, tab-bar (design original)
  common/                — AppContainerWebSite (wrapper site vitrine avec providers)
  marketplace/           — Hero, tabs, filtres, product-card, store-card, featured
  boutique/              — store-hero, store-catalog, add-to-cart, service-contact
  business/              — business-sidebar, business-navbar, kpi-card, revenue-chart, orders-status-chart, alerts-sidebar, activity-feed
  member/                — dashboard-free/premium/business, sidebar, profil, kyc, upgrade forms
  admin/                 — admin-sidebar, admin-charts, members-table, kyc-review, profile-moderation
  events/                — event-card, event-form, event-pricing, booking-button, ticket-card
  directory/             — business-card, business-profile-form, product-card, product-form, mini-boutique
  orders/                — order-card, purchase-button, confirm-delivery-form, seller-order-card, ship-order-button
  cart/                  — cart-icon (navbar)
  shared/                — navbar, footer, mobile-nav (nouveau)

context/                 — Contextes React
  cart-context.tsx        — Panier localStorage mono-boutique (CartProvider + useCart)
  sidebar-context.tsx     — Sidebar open/close
  menu-context.tsx        — Menu mobile
  + dialog, drawer, image-modal (originaux)

prisma/
  schema.prisma          — 17 modeles, 20 enums, indexes
  seed.ts                — Seed complet RDC (50 commandes, images Unsplash africaines)
  migrations/            — Migration initiale (491 lignes SQL)
```

## Roles et permissions

| Role | Conditions DB | Acces |
|------|--------------|-------|
| Visiteur | Pas authentifie | Site public, marketplace, boutiques, evenements |
| Customer | User + Customer | Acheter, panier, checkout, commandes |
| Free | User + Member (FREE, DECLARED) | Dashboard basique, evenements, annuaire, CTA upgrade |
| Premium | User + Member (PREMIUM, VERIFIED) | + profil business vitrine (SHOWCASE), networking |
| Business | User + Member (BUSINESS, VERIFIED) | + boutique (STORE), vente, dashboard business complet |
| Admin | User + AdminAccount (ADMIN) | Admin panel (membres, events, commandes, moderation) |
| Super Admin | AdminAccount (SUPER_ADMIN) | + changement de tier, configuration avancee |

## Flux principaux

### Inscription membre
```
/register → registerMember() → User (ACTIVE) + Member (FREE, DECLARED) → auto-login → /dashboard
```

### Achat produit (tunnel complet)
```
/marketplace → /boutique/[slug] → Ajouter au panier (localStorage) → /panier → /checkout → createCartOrder() → /confirmation/[orderId]
```

### Livraison (code Uber Eats)
```
Commande PAID → Vendeuse: markAsShipped() → SHIPPED → Livraison physique → Acheteur donne code 6 chars → Vendeuse: confirmDelivery(code) → COMPLETED
```

### Upgrade membre
```
/upgrade → createUpgradeRequest() → Si non verifie: KYC_PENDING → /kyc → submitKyc() → Admin: reviewKyc(APPROVED) → READY_FOR_PAYMENT → Paiement → UPGRADE_COMPLETED
```

### Service (pas dans le panier)
```
/boutique/[slug]/service/[id] → "Contacter sur WhatsApp" → wa.me/{phone}?text=...
```

## Securite (3 niveaux)

```
Requete → [Niveau 1: MIDDLEWARE] → [Niveau 2: LAYOUT GUARD] → [Niveau 3: ACTION GUARD (DB)]
```

1. **Middleware** (`middleware.ts`) — Redirection si non authentifie. Verifie isAdmin pour /admin/*. Passe x-pathname en header.
2. **Layout guards** — Chaque layout verifie le role/tier et redirige si insuffisant.
3. **Action guards** (`lib/auth-guards.ts`) — CHAQUE Server Action commence par requireAuth/requireMember/requireAdmin. Relit TOUJOURS la DB (JWT = transport, DB = verite).

## Modele de donnees (17 modeles)

### Auth & Comptes
- **User** — email, passwordHash, status (ACTIVE/SUSPENDED/DELETED)
- **Member** — tier (FREE/PREMIUM/BUSINESS), verificationStatus, profil
- **Customer** — acheteur non-membre avec adresse
- **AdminAccount** — role (MODERATOR/ADMIN/SUPER_ADMIN)
- **Address** — commune Kinshasa, quartier, avenue

### KYC & Upgrade
- **KycVerification** — documents, statut, review admin (multi-tentatives)
- **Subscription** — tier, dates, paiements (multi-abonnements)
- **UpgradeRequest** — state machine (KYC_PENDING → READY_FOR_PAYMENT → COMPLETED)

### Business & Produits
- **BusinessProfile** — boutique (SHOWCASE/STORE), slug, approved, published
- **Product** — prix, stock, type (PHYSICAL/SERVICE/DIGITAL), images

### Events
- **Event** — titre, slug, dates, capacite, accessLevel
- **EventPrice** — pricing par role (PUBLIC/FREE/PREMIUM/BUSINESS)
- **Ticket** — QR code, statut, lien payment

### Commerce
- **Order** — acheteur (member|customer), vendeuse (business), confirmationCode, commission 10%
- **OrderItem** — produit, quantite, prix unitaire
- **Payment** — montant, statut, provider (LOCAL_FINTECH/STRIPE/MOBILE_MONEY)

### Systeme
- **AuditLog** — userId, action, entity, details (pas de FK, survit au soft-delete)
