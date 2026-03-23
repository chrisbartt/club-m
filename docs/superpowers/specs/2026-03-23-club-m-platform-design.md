# Club M — Platform Design Specification

**Date:** 2026-03-23
**Version:** 1.0
**Status:** Draft

---

## 1. Vision produit

### Objectif

Club M est une plateforme communautaire pour femmes entrepreneures basee a Kinshasa (RDC). Elle combine un espace membre prive, un annuaire business et une logique de commerce integree, dans un cadre digital premium.

### Cible utilisateur

| Type | Description | Acces |
|------|-------------|-------|
| Membre Free | Femme entrepreneure, decouverte de l'ecosysteme | Inscription gratuite |
| Membre Premium | Femme entrepreneure, visibilite et networking | Abonnement payant + KYC |
| Membre Business | Femme entrepreneure, vente sur la plateforme | Abonnement payant superieur + KYC |
| Client boutique | Toute personne (homme ou femme), acheteur | Compte client (pas membre) |
| Admin / Staff | Equipe Club M | Compte admin dedie |

### Probleme resolu

Les femmes entrepreneures en RDC manquent d'un ecosysteme digital structure pour se rendre visibles, se connecter entre elles et vendre leurs produits/services dans un cadre de confiance.

### Valeur ajoutee

- Communaute feminine structuree avec niveaux de confiance progressifs
- Annuaire business comme porte d'entree (pas une marketplace anonyme)
- Outils de gestion pour les membres Business (mini back-office e-commerce)
- Systeme anti-fraude par code de confirmation de livraison
- Pricing dynamique des evenements selon le niveau de membre

---

## 2. Perimetre MVP

### Inclus

**Public :**
- Site vitrine multi-pages (existant, a optimiser)
- Consultation annuaire et evenements
- Achat produits et billets evenements (avec compte)

**Membre :**
- Inscription / connexion
- Dashboard adapte au role
- Profil
- Acces selon tier : Free / Premium / Business
- Reservation / achat d'evenements
- Mes tickets, mes achats

**Business (sous-module membre) :**
- Dashboard e-commerce (KPIs, revenus, commandes)
- Gestion produits / services
- Gestion commandes recues
- Suivi clients
- Confirmation de livraison par code

**Admin :**
- Gestion membres (filtres, validation, suspension, roles)
- Gestion evenements (CRUD, pricing, capacite, acces)
- Gestion annuaire / fiches business (moderation)
- Gestion produits (moderation)
- Supervision commandes / paiements
- Dashboard analytics (membres, revenus, conversions)

### Exclu du MVP (reporte)

- Business plan digitalise
- Business aligne
- Tontine
- Credit / accompagnement complexe
- Marketplace globale agregee (V2)
- Systeme d'avis / notation (V2)
- CMS / blog
- Reversements automatises / comptabilite avancee
- Provider KYC automatise (Sumsub, Onfido) — MVP = validation admin manuelle
- Emails marketing — MVP = transactionnels uniquement

---

## 3. Architecture technique

### Approche

Monolithe modulaire Next.js avec route groups. Un seul projet, un seul deploiement, mais une organisation interne par domaines metier.

### Stack

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Framework | Next.js 16 (App Router) | Server Components, Server Actions, route groups |
| UI | React 19 | Derniere version stable |
| Composants | shadcn/ui (New York) | Composants accessibles, customisables |
| Styling | Tailwind CSS 4 | Utility-first, performant |
| ORM | Prisma 7 | Type-safe, migrations, excellent DX |
| Database | PostgreSQL | Robuste, relationnelle, adaptee au modele |
| Auth | NextAuth 4 | JWT, extensible, bien integre Next.js |
| Validation | Zod 4 | Schemas TypeScript-first |
| Paiements | Architecture abstraite multi-provider | Fintech locale RDC (actuel), extensible |
| Email | Resend | Transactionnel, API simple |
| Storage | Cloudinary | Images, CDN global |
| Charts | Recharts | Composants React natifs pour les dashboards |
| Icons | Lucide React | Coherent avec shadcn/ui |

### Logique backend

- **Server Actions** pour la majorite des mutations internes
- **Route Handlers** uniquement pour : webhooks paiement, integrations externes
- Pas de logique REST lourde sans raison

---

## 4. Structure des dossiers

```
club-m-new-version/
├── app/
│   ├── (public)/                    # Site vitrine
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Accueil
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx         # Offres / Tarifs
│   │   ├── events/
│   │   │   ├── page.tsx             # Liste evenements publics
│   │   │   └── [id]/page.tsx        # Detail evenement
│   │   ├── directory/
│   │   │   ├── page.tsx             # Annuaire public
│   │   │   └── [id]/page.tsx        # Fiche business publique + mini-boutique
│   │   └── contact/page.tsx
│   │
│   ├── (auth)/                      # Authentification
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── kyc/page.tsx             # Parcours KYC
│   │
│   ├── (member)/                    # Espace membre (protege)
│   │   ├── layout.tsx               # Layout avec sidebar membre
│   │   ├── dashboard/page.tsx       # Dashboard adapte au role
│   │   ├── profile/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx             # Evenements membre
│   │   │   └── [id]/page.tsx        # Detail + reservation
│   │   ├── directory/page.tsx       # Annuaire enrichi
│   │   ├── tickets/page.tsx         # Mes tickets
│   │   ├── orders/page.tsx          # Mes achats
│   │   ├── upgrade/page.tsx         # Parcours upgrade
│   │   └── business/               # Dashboard Business (Business only)
│   │       ├── layout.tsx
│   │       ├── page.tsx             # Vue d'ensemble (KPIs)
│   │       ├── products/
│   │       │   ├── page.tsx         # Liste produits
│   │       │   └── [id]/page.tsx    # Edition produit
│   │       ├── orders/page.tsx      # Commandes recues
│   │       ├── clients/page.tsx     # Mes clients
│   │       └── revenue/page.tsx     # Suivi revenus
│   │
│   ├── (admin)/                     # Back-office admin
│   │   ├── layout.tsx               # Layout admin avec sidebar
│   │   ├── dashboard/page.tsx       # Analytics
│   │   ├── members/
│   │   │   ├── page.tsx             # Liste + filtres
│   │   │   └── [id]/page.tsx        # Detail membre
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── directory/page.tsx       # Moderation fiches
│   │   ├── products/page.tsx        # Moderation produits
│   │   ├── orders/page.tsx          # Supervision commandes
│   │   ├── payments/page.tsx        # Supervision paiements
│   │   └── audit/page.tsx           # Journal d'audit
│   │
│   ├── api/                         # Route Handlers
│   │   ├── webhooks/
│   │   │   └── payment/route.ts     # Webhook PSP
│   │   └── auth/[...nextauth]/route.ts
│   │
│   ├── layout.tsx                   # Root layout
│   └── globals.css
│
├── domains/                         # Logique metier par domaine
│   ├── members/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── events/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── directory/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── business/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── tickets/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── orders/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── payments/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── kyc/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   └── audit/
│       ├── actions.ts
│       ├── queries.ts
│       └── types.ts
│
├── integrations/                    # Providers externes (abstraction)
│   ├── payment/
│   │   ├── types.ts                 # Interface PaymentProvider
│   │   ├── index.ts                 # Factory
│   │   ├── local-fintech.ts         # Implementation actuelle
│   │   └── errors.ts                # Normalisation erreurs provider
│   ├── kyc/
│   │   ├── types.ts                 # Interface KycProvider
│   │   ├── index.ts
│   │   └── manual.ts               # MVP : validation admin
│   ├── email/
│   │   ├── types.ts                 # Interface EmailProvider
│   │   ├── index.ts
│   │   ├── resend.ts
│   │   └── templates/              # Templates emails transactionnels
│   │       ├── welcome.tsx
│   │       ├── email-verification.tsx
│   │       ├── order-confirmation.tsx
│   │       ├── ticket-confirmation.tsx
│   │       └── kyc-status.tsx
│   └── storage/
│       ├── types.ts                 # Interface StorageProvider
│       ├── index.ts
│       └── cloudinary.ts
│
├── lib/                             # Utilitaires techniques
│   ├── auth.ts                      # Config NextAuth
│   ├── auth-guards.ts               # Guards serveur
│   ├── db.ts                        # Prisma client singleton
│   ├── permissions.ts               # Definition roles & permissions
│   ├── errors.ts                    # AuthError, ValidationError, BusinessError
│   ├── error-messages.ts            # Mapping erreurs → messages UX
│   ├── routes.ts                    # Constantes chemins proteges
│   ├── utils.ts                     # Helpers generiques (cn, etc.)
│   └── constants.ts                 # Constantes globales
│
├── components/
│   ├── ui/                          # shadcn/ui (genere)
│   ├── shared/                      # Composants partages cross-espaces
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── pricing-card.tsx
│   ├── public/                      # Composants site vitrine
│   │   ├── hero-section.tsx
│   │   └── event-card-public.tsx
│   ├── member/                      # Composants espace membre
│   │   ├── member-sidebar.tsx
│   │   ├── role-badge.tsx
│   │   └── verified-badge.tsx
│   ├── business/                    # Composants dashboard Business
│   │   ├── kpi-card.tsx
│   │   ├── revenue-chart.tsx
│   │   └── orders-table.tsx
│   └── admin/                       # Composants admin
│       ├── admin-sidebar.tsx
│       └── stats-card.tsx
│
├── prisma/
│   └── schema.prisma
│
├── providers/                       # React providers
│   ├── auth-provider.tsx
│   └── theme-provider.tsx
│
├── hooks/                           # Custom React hooks
│   ├── use-current-user.ts
│   └── use-permissions.ts
│
├── middleware.ts                     # Next.js middleware (protection routes)
│
├── CLAUDE.md
├── PROJECT_STATE.md
└── SESSION_LOG.md
```

### Principes de structure

1. **`app/`** = routage et UI uniquement. Pas de logique metier dans les pages.
2. **`domains/`** = toute la logique metier. Chaque domaine suit le pattern : `actions.ts` (mutations), `queries.ts` (lectures), `types.ts`, `validators.ts`.
3. **`integrations/`** = providers externes. Chaque integration expose une interface TypeScript. La logique metier ne connait que l'interface, jamais l'implementation.
4. **`lib/`** = code technique transversal (auth, DB, permissions, erreurs).
5. **`components/`** = organises par espace (public, member, business, admin, shared).
6. **`middleware.ts`** = premiere ligne de defense pour la protection des routes.

---

## 5. Modele de donnees

### Comptes & Authentification

```prisma
model User {
  id              String           @id @default(cuid())
  email           String           @unique
  passwordHash    String
  emailVerified   Boolean          @default(false)
  status          UserStatus       @default(ACTIVE)

  member          Member?
  customer        Customer?
  adminAccount    AdminAccount?

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

model Member {
  id                  String              @id @default(cuid())
  userId              String              @unique
  user                User                @relation(fields: [userId], references: [id])

  firstName           String
  lastName            String
  phone               String?
  bio                 String?
  avatar              String?

  tier                MemberTier          @default(FREE)
  status              MemberStatus        @default(ACTIVE)
  verificationStatus  VerificationStatus  @default(DECLARED)

  kycVerifications    KycVerification[]
  subscriptions       Subscription[]
  businessProfile     BusinessProfile?
  tickets             Ticket[]
  orders              Order[]

  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
}

enum MemberTier {
  FREE
  PREMIUM
  BUSINESS
}

enum MemberStatus {
  ACTIVE
  SUSPENDED
  BANNED
}

enum VerificationStatus {
  UNVERIFIED
  DECLARED
  PENDING_VERIFICATION
  VERIFIED
  REJECTED
}

model Customer {
  id              String           @id @default(cuid())
  userId          String           @unique
  user            User             @relation(fields: [userId], references: [id])

  firstName       String
  lastName        String
  phone           String?
  address         Address?

  orders          Order[]
  tickets         Ticket[]

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

// Adresse structuree
model Address {
  id              String           @id @default(cuid())
  customerId      String           @unique
  customer        Customer         @relation(fields: [customerId], references: [id])

  street          String
  city            String
  commune         String?
  province        String?
  country         String           @default("CD")
  notes           String?

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model AdminAccount {
  id              String           @id @default(cuid())
  userId          String           @unique
  user            User             @relation(fields: [userId], references: [id])

  role            AdminRole        @default(ADMIN)

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  MODERATOR
}
```

### KYC (historique multi-tentatives)

```prisma
model KycVerification {
  id              String           @id @default(cuid())
  memberId        String
  member          Member           @relation(fields: [memberId], references: [id])

  idDocumentUrl   String
  selfieUrl       String

  status          KycStatus        @default(PENDING)
  provider        String?          // "manual" | "sumsub" | "onfido"
  providerRef     String?
  rejectionReason String?
  reviewedBy      String?

  submittedAt     DateTime         @default(now())
  reviewedAt      DateTime?
}

enum KycStatus {
  PENDING
  APPROVED
  REJECTED
  MANUAL_REVIEW
}
```

### Abonnements (historique multi-abonnements)

```prisma
model Subscription {
  id              String              @id @default(cuid())
  memberId        String
  member          Member              @relation(fields: [memberId], references: [id])

  tier            MemberTier
  status          SubscriptionStatus  @default(ACTIVE)

  startDate       DateTime            @default(now())
  endDate         DateTime

  payments        Payment[]

  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PAST_DUE
}
```

### Annuaire & Business

```prisma
model BusinessProfile {
  id              String           @id @default(cuid())
  memberId        String           @unique
  member          Member           @relation(fields: [memberId], references: [id])

  businessName    String
  description     String
  category        String
  coverImage      String?
  images          String[]

  phone           String?
  email           String?
  website         String?
  whatsapp        String?
  address         String?

  // Distinction Premium (vitrine) vs Business (commerce)
  profileType     BusinessProfileType  @default(SHOWCASE)

  isPublished     Boolean          @default(false)
  isApproved      Boolean          @default(false)

  products        Product[]
  receivedOrders  Order[]

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

enum BusinessProfileType {
  SHOWCASE         // Premium : vitrine, presentation d'activite
  STORE            // Business : vitrine + vente + paiement
}

model Product {
  id              String           @id @default(cuid())
  businessId      String
  business        BusinessProfile  @relation(fields: [businessId], references: [id])

  name            String
  description     String
  price           Decimal
  currency        Currency         @default(USD)
  images          String[]

  type            ProductType      @default(PHYSICAL)
  category        String?
  isActive        Boolean          @default(true)
  stock           Int?

  orderItems      OrderItem[]

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

enum ProductType {
  PHYSICAL
  SERVICE
  DIGITAL
}

enum Currency {
  USD
  CDF
  EUR
}
```

### Evenements & Billetterie

```prisma
model Event {
  id              String           @id @default(cuid())

  title           String
  description     String
  coverImage      String?
  location        String

  startDate       DateTime
  endDate         DateTime

  capacity        Int
  waitlistEnabled Boolean          @default(false)

  accessLevel     EventAccessLevel @default(PUBLIC)
  status          EventStatus      @default(DRAFT)

  prices          EventPrice[]
  tickets         Ticket[]

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model EventPrice {
  id              String           @id @default(cuid())
  eventId         String
  event           Event            @relation(fields: [eventId], references: [id], onDelete: Cascade)

  targetRole      PricingRole
  price           Decimal
  currency        Currency         @default(USD)

  @@unique([eventId, targetRole])
}

model Ticket {
  id              String           @id @default(cuid())
  eventId         String
  event           Event            @relation(fields: [eventId], references: [id])

  // Acheteur : membre OU customer (evenements publics)
  memberId        String?
  member          Member?          @relation(fields: [memberId], references: [id])
  customerId      String?
  customer        Customer?        @relation(fields: [customerId], references: [id])

  qrCode          String           @unique
  status          TicketStatus     @default(PENDING)

  payment         Payment?

  scannedAt       DateTime?
  createdAt       DateTime         @default(now())
}

enum EventAccessLevel {
  PUBLIC
  MEMBERS_ONLY
  PREMIUM_ONLY
  BUSINESS_ONLY
}

enum PricingRole {
  PUBLIC
  FREE
  PREMIUM
  BUSINESS
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

enum TicketStatus {
  PENDING
  PAID
  CANCELLED
  USED
}
```

### Commandes & Paiements

```prisma
model Order {
  id                  String           @id @default(cuid())

  // Acheteur : membre OU customer (jamais les deux)
  memberId            String?
  member              Member?          @relation(fields: [memberId], references: [id])
  customerId          String?
  customer            Customer?        @relation(fields: [customerId], references: [id])

  // Vendeuse
  businessId          String
  business            BusinessProfile  @relation(fields: [businessId], references: [id])

  totalAmount         Decimal
  currency            Currency         @default(USD)
  commission          Decimal

  // Code de confirmation livraison
  confirmationCode    String           @unique
  codeExpiresAt       DateTime
  codeUsed            Boolean          @default(false)

  status              OrderStatus      @default(PENDING)

  items               OrderItem[]
  payment             Payment?

  createdAt           DateTime         @default(now())
  updatedAt           DateTime         @updatedAt
}

model OrderItem {
  id              String           @id @default(cuid())
  orderId         String
  order           Order            @relation(fields: [orderId], references: [id])
  productId       String
  product         Product          @relation(fields: [productId], references: [id])

  quantity        Int
  unitPrice       Decimal
  currency        Currency         @default(USD)
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  COMPLETED
  CANCELLED
  REFUNDED
  DISPUTED
}

model Payment {
  id              String           @id @default(cuid())

  amount          Decimal
  currency        Currency         @default(USD)
  status          PaymentStatus    @default(PENDING)

  provider        PaymentProvider
  providerRef     String?

  // Lien polymorphique (un seul rempli)
  orderId         String?          @unique
  order           Order?           @relation(fields: [orderId], references: [id])
  ticketId        String?          @unique
  ticket          Ticket?          @relation(fields: [ticketId], references: [id])
  subscriptionId  String?
  subscription    Subscription?    @relation(fields: [subscriptionId], references: [id])

  metadata        Json?

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum PaymentProvider {
  LOCAL_FINTECH
  STRIPE
  MOBILE_MONEY
}
```

### Audit

```prisma
model AuditLog {
  id              String           @id @default(cuid())

  // Qui
  userId          String
  userEmail       String

  // Quoi
  action          String           // ex: "kyc.approve", "member.suspend", "order.confirm_delivery"
  entity          String           // ex: "Member", "Order", "KycVerification"
  entityId        String

  // Details
  details         Json?            // Donnees contextuelles

  createdAt       DateTime         @default(now())
}
```

### Etats de l'upgrade membre

```prisma
model UpgradeRequest {
  id              String           @id @default(cuid())
  memberId        String
  member          Member           @relation(fields: [memberId], references: [id])

  fromTier        MemberTier
  toTier          MemberTier
  status          UpgradeStatus    @default(KYC_PENDING)

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

enum UpgradeStatus {
  KYC_PENDING
  KYC_REJECTED
  READY_FOR_PAYMENT
  PAYMENT_PENDING
  UPGRADE_COMPLETED
  CANCELLED
}
```

Note : ajouter `upgradeRequests UpgradeRequest[]` a `Member`.

### Relations cles

```
User ──1:1──> Member (femme, Club M)
User ──1:1──> Customer (tout le monde, boutique)
User ──1:1──> AdminAccount (staff)

Member ──1:N──> KycVerification (historique tentatives)
Member ──1:N──> Subscription (historique abonnements)
Member ──1:N──> UpgradeRequest (parcours upgrade)
Member ──1:1──> BusinessProfile (Premium/Business)

BusinessProfile.profileType ──> SHOWCASE (Premium) | STORE (Business)
BusinessProfile ──1:N──> Product (STORE uniquement)

Order ──N:1──> BusinessProfile (vendeuse)
Order ──N:1──> Member | Customer (acheteur, mutuellement exclusifs)
Order ──1:1──> Payment
Order ──1:N──> OrderItem ──N:1──> Product

Event ──1:N──> EventPrice (pricing par role)
Event ──1:N──> Ticket
Ticket ──N:1──> Member | Customer (acheteur)
Ticket ──1:1──> Payment

Payment ──> Order | Ticket | Subscription (polymorphique, un seul rempli)
```

---

## 6. Systeme de permissions & securite

### Architecture 3 niveaux

```
Requete entrante
    |
    v
[Niveau 1 — MIDDLEWARE]         middleware.ts
  Protection des routes           Redirection si non authentifie
  Verification session            Bloque l'acces aux route groups
    |
    v
[Niveau 2 — LAYOUT GUARDS]     (member)/layout.tsx, (admin)/layout.tsx
  Verification du role            Verifie tier, verificationStatus
  Redirection UX                  Affiche upgrade prompt si necessaire
    |
    v
[Niveau 3 — ACTION GUARDS]     Dans chaque Server Action / Query
  Verification metier             La VRAIE securite (non contournable)
  Validation des donnees          Zod + permissions fines + ownership
```

Regle fondamentale : les niveaux 1 et 2 sont des optimisations UX. Le niveau 3 est la vraie securite — chaque action/query verifie ses propres permissions independamment du middleware.

### Distinction role statique vs permission effective

Les guards ne verifient pas seulement le tier. Ils verifient le contexte metier complet :

| Verification | Exemple |
|-------------|---------|
| Statut compte | User.status === ACTIVE |
| Statut membre | Member.status === ACTIVE |
| Tier minimum | hasMinTier(member.tier, requiredTier) |
| Verification KYC | member.verificationStatus === VERIFIED |
| Profil approuve | businessProfile.isApproved === true |
| Ownership | businessProfile.memberId === currentMember.id |

### PUBLIC

PUBLIC n'est pas un role persistant. C'est l'etat d'un utilisateur non authentifie. Il n'apparait pas dans la hierarchie des roles membres. Il est utilise uniquement dans :
- `PricingRole` (pricing evenements)
- Les regles d'acces evenements (`EventAccessLevel.PUBLIC`)

### Hierarchie des tiers membres

```typescript
const TIER_HIERARCHY: Record<MemberTier, number> = {
  FREE: 1,
  PREMIUM: 2,
  BUSINESS: 3,
}

function hasMinTier(userTier: MemberTier, required: MemberTier): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[required]
}
```

### Guards serveur

```typescript
// requireAuth() → utilisateur authentifie, compte actif
// requireMember(minTier?) → membre actif, tier suffisant
// requireVerifiedMember(minTier?) → membre verifie (KYC)
// requireVerifiedBusiness() → Business verifie + profil STORE approuve
// requireAdmin() → admin actif
// requireAdmin('SUPER_ADMIN') → super admin
// requireOwnership(resourceOwnerId) → verifie que l'utilisateur est proprietaire
```

Chaque guard relit la base de donnees. Le JWT est une optimisation de transport, pas la source de verite.

### Protection des routes (middleware)

Les chemins proteges sont centralises dans `lib/routes.ts` :

```typescript
export const PROTECTED_ROUTES = {
  member: ['/dashboard', '/profile', '/tickets', '/orders', '/business', '/upgrade'],
  admin: ['/admin'],
  auth: ['/login', '/register', '/verify-email', '/kyc'],
} as const

export function isProtectedMemberRoute(path: string): boolean {
  return PROTECTED_ROUTES.member.some(r => path.startsWith(r))
}
// etc.
```

### Ownership

Chaque Server Action qui modifie une ressource verifie l'ownership :

```typescript
// Exemple : modifier un produit
export async function updateProduct(productId: string, data: FormData) {
  const { member } = await requireVerifiedBusiness()

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { business: true }
  })

  if (!product) throw new BusinessError('RESOURCE_NOT_FOUND')
  if (product.business.memberId !== member.id) throw new AuthError('NOT_OWNER')

  // ... mise a jour
}
```

### Gestion des erreurs (3 categories)

```typescript
// AuthError — authentification et autorisation
//   NOT_AUTHENTICATED, ACCOUNT_INACTIVE, ACCOUNT_SUSPENDED,
//   NOT_A_MEMBER, MEMBER_SUSPENDED, INSUFFICIENT_TIER,
//   NOT_VERIFIED, NOT_ADMIN, INSUFFICIENT_ADMIN_ROLE, NOT_OWNER

// ValidationError — input utilisateur invalide
//   Champs, details Zod

// BusinessError — logique metier
//   RESOURCE_NOT_FOUND, NO_STORE_PROFILE, PROFILE_NOT_APPROVED,
//   EVENT_FULL, EVENT_NOT_BOOKABLE, ORDER_ALREADY_CONFIRMED,
//   CONFIRMATION_CODE_EXPIRED, CONFIRMATION_CODE_INVALID,
//   KYC_ALREADY_PENDING, SUBSCRIPTION_ALREADY_ACTIVE,
//   INSUFFICIENT_STOCK, PRODUCT_INACTIVE, UPGRADE_IN_PROGRESS
```

### Mapping erreurs vers UX

Chaque erreur typee est mappee vers un message utilisateur et une action suggeree :

```typescript
// lib/error-messages.ts
export const ERROR_UX_MAP: Record<string, {
  message: string
  severity: 'info' | 'warning' | 'error'
  action?: { label: string, href: string }
}> = {
  INSUFFICIENT_TIER: {
    message: "Cette fonctionnalite est reservee aux membres Premium.",
    severity: 'info',
    action: { label: "Decouvrir Premium", href: "/upgrade" }
  },
  NOT_VERIFIED: {
    message: "Votre profil doit etre verifie pour acceder a cette fonctionnalite.",
    severity: 'warning',
    action: { label: "Verifier mon profil", href: "/kyc" }
  },
  CONFIRMATION_CODE_EXPIRED: {
    message: "Le code de confirmation a expire. Contactez le support.",
    severity: 'error',
    action: { label: "Contacter le support", href: "/contact" }
  },
  // ...
}
```

---

## 7. Authentification & flows utilisateurs

### Session

- NextAuth avec JWT (pas de session DB pour le MVP)
- Duree session : 7 jours, refresh automatique
- Mot de passe : minimum 8 caracteres, hashe avec bcrypt
- Email : unique par User, confirmation obligatoire
- Les guards serveur relisent TOUJOURS la DB pour verifier le statut reel du compte, du tier et des permissions. Le JWT est un transport, pas la source de verite.

### Compte suspendu

Quand un admin suspend un User :
- `User.status` passe a `SUSPENDED`
- La session JWT reste potentiellement valide, mais chaque guard serveur verifie `User.status` en DB
- Le prochain appel serveur retourne `ACCOUNT_SUSPENDED`
- Cote client, redirection vers une page explicite : "Votre compte a ete suspendu. Contactez le support."
- Aucune action n'est possible tant que le compte est suspendu

### Flow 1 — Inscription membre Club M (Free)

```
Visiteur
  |
  +- Clic "Rejoindre Club M"
  +- Formulaire : email, mot de passe, prenom, nom
  |  checkbox "Je certifie etre une femme" (obligatoire) + CGU
  +- Email de confirmation envoye (Resend)
  +- Clic lien de confirmation
  +- Compte cree : User (ACTIVE) + Member (FREE, DECLARED)
  +- Redirection → Dashboard membre Free
```

### Flow 2 — Upgrade membre

Machine a etats reprenable :

```
Membre (dashboard)
  |
  +- Clic "Passer Premium" ou "Passer Business"
  +- UpgradeRequest cree (fromTier → toTier)
  |
  +- ETAPE 1 : KYC
  |  +- Si deja VERIFIED → skip (KYC acquis)
  |  +- Sinon :
  |     +- Upload piece d'identite + selfie
  |     +- KycVerification cree (PENDING)
  |     +- UpgradeRequest.status = KYC_PENDING
  |     +- MVP : validation admin manuelle
  |     +- Si APPROVED → UpgradeRequest.status = READY_FOR_PAYMENT
  |     +- Si REJECTED → UpgradeRequest.status = KYC_REJECTED
  |        +- Membre reste dans son tier actuel
  |        +- Possibilite de resoumettre (nouvelle KycVerification)
  |        +- UpgradeRequest.status repasse a KYC_PENDING
  |
  +- ETAPE 2 : Paiement (si READY_FOR_PAYMENT)
  |  +- Page recapitulative offre + prix
  |  +- Choix moyen de paiement
  |  +- Redirection provider
  |  +- UpgradeRequest.status = PAYMENT_PENDING
  |  +- Webhook → Payment SUCCESS
  |  +- Subscription creee (ACTIVE)
  |  +- Member.tier mis a jour
  |  +- UpgradeRequest.status = UPGRADE_COMPLETED
  |
  +- Si interruption a tout moment → le parcours est reprenable
     L'UpgradeRequest garde l'etat et le membre reprend la ou il s'est arrete
```

Parcours d'upgrade supportes :
- Free → Premium
- Free → Business
- Premium → Business (si deja VERIFIED, on skip le KYC)

### Flow 3 — Creation compte client boutique

```
Visiteur (fiche business publique / evenement public)
  |
  +- Clic "Acheter" ou "Reserver"
  +- Pas de guest checkout : connexion ou creation de compte obligatoire
  +- Formulaire simplifie : email, mot de passe, prenom, nom, telephone
  |  PAS de declaration femme, PAS de KYC
  +- Compte cree : User (ACTIVE) + Customer
  +- Retour au flow d'achat / reservation
```

Un User peut cumuler Member + Customer (une membre Business qui achete chez une autre).

### Flow 4 — Achat produit (code de confirmation)

```
Acheteur (membre ou customer)
  |
  +- Consultation fiche business → produit
  +- Checkout : recap, adresse livraison, paiement
  +- Payment SUCCESS →
  |  +- Order cree (status: PAID)
  |  +- confirmationCode genere (6 caracteres alphanumeriques)
  |  +- codeExpiresAt = now + 14 jours
  |  +- Code envoye a l'acheteur (email + visible dans "Mes achats")
  |  +- Notification vendeuse (nouvelle commande)
  |
  +- Vendeuse prepare et livre
  |  +- Order.status → SHIPPED
  |
  +- Livraison
  |  +- Acheteur donne le code au livreur/vendeuse
  |  +- Vendeuse saisit le code dans son dashboard Business
  |  +- Code valide → Order.status → DELIVERED
  |  +- Apres delai de securite (48h) → Order.status → COMPLETED
  |
  +- Cas limites :
     +- Code expire → acheteur contacte support, admin intervient
     +- Code perdu → acheteur peut le retrouver dans "Mes achats"
     +- Litige → acheteur ou vendeuse signale, Order.status → DISPUTED
     +- Admin peut : regenerer un code, forcer la cloture, annuler
```

Note MVP : pas d'escrow financier automatise. La "liberation du paiement" est une cloture logique de commande. La gestion financiere reelle (reversements aux vendeuses) se fait hors plateforme pour le MVP.

### Flow 5 — Reservation evenement

```
Utilisateur (public, free, premium, business)
  |
  +- Consulte un evenement
  +- Verification acces (EventAccessLevel vs role)
  |  Si non autorise → message "Reserve aux membres Premium+"
  |
  +- Prix affiche selon le role (pricing dynamique)
  |  Affichage : "Votre prix : 25$ (prix public : 50$)"
  |
  +- Clic "Reserver"
  |  +- Non connecte → inscription/connexion (membre OU customer)
  |  +- Evenement public → customer suffit
  |  +- Evenement MEMBERS_ONLY+ → compte membre requis
  |  +- Places disponibles ? Verification capacite
  |     +- Si complet + waitlist → proposition liste d'attente
  |
  +- Paiement
  |  +- Ticket cree (PENDING)
  |  +- Redirection paiement
  |  +- Webhook → Payment SUCCESS
  |  +- Ticket.status → PAID
  |  +- QR code genere
  |  +- Ticket envoye par email + visible dans "Mes tickets"
  |
  +- Jour J : scan QR code → Ticket.status → USED
```

### Flow 6 — Connexion (routing intelligent)

```
Utilisateur
  |
  +- /login (page unique)
  +- Authentification
  +- Redirection basee sur le type de compte :
     +- Si AdminAccount → /admin/dashboard
     +- Si Member → /dashboard
     +- Si Customer uniquement → retour page precedente ou /
```

---

## 8. Couche integrations

### Architecture

Chaque integration externe est isolee derriere une interface TypeScript. La logique metier (domains/) n'importe jamais directement un SDK externe — elle passe par l'interface.

### Interfaces

```typescript
// integrations/payment/types.ts
interface PaymentProvider {
  createPayment(params: CreatePaymentParams): Promise<PaymentResult>
  verifyWebhook(payload: unknown, signature: string): Promise<WebhookEvent>
  getPaymentStatus(providerRef: string): Promise<PaymentStatus>
  requestRefund(providerRef: string, amount?: number): Promise<RefundResult>
}

// integrations/kyc/types.ts
interface KycProvider {
  submitVerification(params: KycSubmitParams): Promise<KycSubmitResult>
  getVerificationStatus(providerRef: string): Promise<KycProviderStatus>
}

// integrations/email/types.ts
interface EmailProvider {
  send(params: SendEmailParams): Promise<EmailResult>
}

// integrations/storage/types.ts
interface StorageProvider {
  upload(file: File, options: UploadOptions): Promise<UploadResult>
  delete(publicId: string): Promise<void>
  getUrl(publicId: string, transforms?: ImageTransforms): string
}
```

### Normalisation des erreurs

Les erreurs des providers externes sont normalisees avant d'atteindre la logique metier :

```typescript
// integrations/payment/errors.ts
export class PaymentProviderError extends Error {
  constructor(
    public code: 'PROVIDER_UNAVAILABLE' | 'PAYMENT_DECLINED' | 'INVALID_AMOUNT' | 'PROVIDER_ERROR',
    public originalError?: unknown
  ) {
    super(code)
    this.name = 'PaymentProviderError'
  }
}
```

Les erreurs brutes des prestataires ne sont jamais exposees dans l'UI. Chaque `PaymentProviderError.code` est mappe vers un message utilisateur via `error-messages.ts`.

### KYC — Strategie MVP

Le MVP utilise une validation admin manuelle :
- Le membre upload ses documents
- Les documents sont stockes dans Cloudinary (dossier `kyc/`)
- Un admin consulte les documents dans le back-office
- L'admin approuve ou rejette avec motif
- L'integration `integrations/kyc/manual.ts` gere ce flow

Le provider KYC automatise (Sumsub, Onfido, Persona) est une evolution future. L'interface `KycProvider` est deja prevue pour le brancher sans modifier la logique metier.

### Emails — Distinction conceptuelle

**Transactionnels (MVP) :**
- Confirmation d'email
- Bienvenue
- Confirmation de commande
- Ticket evenement
- Statut KYC
- Code de confirmation livraison
- Notification nouvelle commande (vendeuse)

**Marketing/Produit (hors MVP) :**
- Newsletter
- Promotions
- Relance inscription incomplete
- Recommandations

Le MVP n'implemente que les emails transactionnels via Resend.

### Storage — Convention Cloudinary

Organisation par type d'asset :

```
club-m/
  avatars/{memberId}/       # Photos de profil
  kyc/{memberId}/           # Documents KYC (acces restreint)
  business/{profileId}/     # Images fiches business
  products/{productId}/     # Photos produits
  events/{eventId}/         # Visuels evenements
```

---

## 9. Standards de code

### Naming conventions

| Element | Convention | Exemple |
|---------|-----------|---------|
| Fichiers | kebab-case | `auth-guards.ts` |
| Composants React | PascalCase (export) | `export function KpiCard()` |
| Fichiers composants | kebab-case | `kpi-card.tsx` |
| Server Actions | camelCase, verbe d'action | `createProduct`, `updateOrder` |
| Queries | camelCase, get/find/list | `getProductById`, `listOrders` |
| Types/Interfaces | PascalCase | `MemberWithProfile` |
| Enums Prisma | UPPER_SNAKE | `PENDING_VERIFICATION` |
| Variables d'env | UPPER_SNAKE | `DATABASE_URL` |

### Regles de code

1. **Pas de logique metier dans `app/`** — Les pages appellent `domains/` et affichent le resultat.
2. **Pas d'import Prisma direct dans `app/` ou `components/`** — Toujours passer par `domains/*/queries.ts` ou `actions.ts`.
3. **Validation Zod obligatoire** dans chaque Server Action. Le schema Zod est la source de verite.
4. **Guard en premiere ligne** de chaque Server Action — `requireAuth()`, `requireMember()`, etc.
5. **Un fichier = une responsabilite** — Decouper quand les responsabilites divergent, pas sur un seuil de lignes arbitraire.
6. **Props typees explicitement** — Pas de `any`, pas de props non typees.
7. **Erreurs typees** — Utiliser `AuthError`, `ValidationError`, `BusinessError`.
8. **Images via Cloudinary** — Pas d'upload local, pas de stockage dans `public/`.

### Optimistic UI

A utiliser uniquement pour les actions non critiques ou le feedback immediat ameliore l'UX :
- Toggle favori
- Mise a jour de profil
- Changement de statut produit (actif/inactif)

A NE PAS utiliser pour :
- Paiements
- KYC
- Confirmation de livraison
- Changement de tier
- Toute action financiere ou de verification

### Audit / Journalisation

Les actions sensibles suivantes sont journalisees dans `AuditLog` :
- Soumission et traitement KYC
- Changement de tier membre
- Suspension / reactivation de compte
- Moderation de fiches business ou produits
- Confirmation de livraison (code utilise)
- Intervention admin sur commandes (cloture forcee, annulation)
- Modification de role admin

Format : `{ action: "kyc.approve", entity: "KycVerification", entityId: "...", details: {...} }`

---

## 10. Principes UX

### Premium first

Le design doit inspirer confiance et professionnalisme. Dark theme comme reference (cf. dashboard Business de reference). Composants shadcn/ui customises pour la marque Club M.

### Mobile first

Marche RDC = principalement mobile. Toutes les pages doivent etre responsive. Le dashboard Business doit etre utilisable sur mobile.

### Feedback immediat

Toute action = feedback visuel (toast via Sonner, loading states). Pas de bouton qui ne reagit pas au clic.

### Valeur percue

- Afficher le prix public barre a cote du prix membre sur les evenements
- Badge "Profil verifie Club M"
- Nombre de ventes sur les fiches Business
- Profil approuve comme indicateur de confiance

### Zero friction

- Inscription Free en 30 secondes
- Parcours d'achat en minimum d'etapes
- Formulaires progressifs (pas tout d'un coup)
- Parcours d'upgrade reprenable
