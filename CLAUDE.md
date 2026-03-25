# Club M — CLAUDE.md

## Vision du projet

Club M est une plateforme communautaire et marketplace pour femmes entrepreneures basee a Kinshasa, RDC. Elle combine 3 piliers :
1. **Communaute** — membres Free / Premium / Business avec verification d'identite progressive
2. **Marketplace** — boutiques en ligne, produits, services, panier, checkout, livraison avec code de confirmation
3. **Incubation** (futur) — business plan, ateliers, accompagnement, financement

## Philosophie produit

- Mobile-first (marche RDC = principalement telephone)
- Design premium (niveau Shopify / Stripe)
- Contexte congolais (communes Kinshasa, telephone +243, WhatsApp, livraison manuelle)
- Securite progressive (Free = declaration, Premium/Business = KYC obligatoire)
- Annuaire-first (les fiches business sont la porte d'entree, pas une marketplace anonyme)

## Regles non negociables

1. **Pas de logique metier dans `app/`** — les pages appellent `domains/` et affichent le resultat
2. **Pas d'import Prisma direct dans `app/` ou `components/`** — toujours passer par `domains/*/queries.ts` ou `actions.ts`
3. **Chaque Server Action commence par un guard** : `requireAuth()`, `requireMember()`, etc.
4. **Chaque Server Action valide les inputs avec Zod**
5. **Erreurs typees** : `AuthError`, `ValidationError`, `BusinessError`
6. **JWT = transport, DB = verite** — les guards relisent TOUJOURS la base
7. **Images via Cloudinary** — pas d'upload local
8. **Soft-delete uniquement** — jamais de hard-delete
9. **Prisma imports depuis `@/lib/generated/prisma/client`** (PAS `@prisma/client`)
10. **Server Actions utilisent le pattern return-value** : `{ success: true, data } | { success: false, error, details? }` — jamais throw

## Architecture technique

- **Framework** : Next.js 16 (App Router, Server Components, Server Actions)
- **DB** : PostgreSQL + Prisma 7 (avec PrismaPg adapter)
- **Auth** : Auth.js v5 (JWT + Credentials) — config splitee en `auth.config.ts` (Edge) + `auth.ts` (serveur)
- **Validation** : Zod 4
- **UI** : Tailwind CSS 4 + shadcn/ui + Recharts
- **Email** : Resend (configure, API key vide en dev)
- **Storage** : Cloudinary (operationnel)
- **Paiement** : Interface abstraite, stub actuel (simule SUCCESS)

## Structure des dossiers

```
app/(public)/          — Homepage (site vitrine original)
app/(site)/            — Site vitrine original (a-propos, contact, evenements, annuaires, marketplace, boutique, panier, checkout, confirmation)
app/(auth)/            — Login, register (membre + customer)
app/(member)/          — Espace membre (dashboard, profil, kyc, upgrade, tickets, achats, mon-business)
app/(admin)/admin/     — Admin (dashboard, membres, evenements, commandes, paiements, produits, annuaire, journal)

domains/               — 12 domaines metier (members, kyc, upgrade, events, tickets, directory, business, orders, marketplace, payments, audit, contact)
integrations/          — 4 providers (payment, email, storage, kyc)
lib/                   — Auth, guards, permissions, errors, routes, constants, utils
components/            — Organises par espace (marketplace, boutique, business, member, admin, shared, cart, orders, events, directory)
prisma/                — Schema (17 modeles) + seed (50 commandes realistes RDC)
context/               — Cart context (localStorage, mono-boutique)
```

## Conventions de nommage

- Fichiers : kebab-case (`auth-guards.ts`)
- Composants : PascalCase (`KpiCard`)
- Server Actions : camelCase, verbe (`createProduct`, `updateOrder`)
- Queries : camelCase, get/find/list (`getProductById`, `listOrders`)
- Types : PascalCase (`MemberWithProfile`)
- Enums Prisma : UPPER_SNAKE (`PENDING_VERIFICATION`)
- URLs : francaises (`/profil`, `/achats`, `/mon-business`, `/evenements`)

## Comptes de test (dev)

| Role | Email | Mot de passe | Redirect |
|------|-------|-------------|----------|
| Admin | admin@clubm.cd | admin123 | /admin/dashboard |
| Business (Grace Fashion) | grace@clubm.cd | member123 | /mon-business |
| Business (Chez Esther) | esther@clubm.cd | member123 | /mon-business |
| Business (Belle Ornella) | ornella@clubm.cd | member123 | /mon-business |
| Business (Sarah Events) | sarah@clubm.cd | member123 | /mon-business |
| Business (Christi Cosmetics) | christelle@clubm.cd | member123 | /mon-business |
| Free | fabiola@example.com | member123 | /dashboard |

Login rapide (dev) : `/login` affiche des boutons de connexion en 1 clic.

## Documents de reference

- **Spec produit** : `docs/superpowers/specs/2026-03-23-club-m-platform-design.md`
- **Plans d'implementation** : `docs/superpowers/plans/` (Plans 1 a 4, tous executes)
- **Audit global** : `docs/handover/audit-global-club-m.html`
- **Handover** : `HANDOVER.md`
- **Etat du projet** : `PROJECT_STATE.md`
- **Prochaines etapes** : `NEXT_STEPS.md`
- **Gaps connus** : `KNOWN_GAPS.md`

## Protocole de session

### Debut de session
1. Lire CLAUDE.md, PROJECT_STATE.md, derniere entree de SESSION_LOG.md
2. Verifier coherence entre fichiers et code
3. Resume en 3 points : ou on est, derniere session, prochaine action
4. NE PAS coder avant ce point

### Fin de session
Quand l'utilisateur dit "stop", "pause", "a demain" :
1. Proposer un /save
2. Mettre a jour SESSION_LOG.md
3. Mettre a jour PROJECT_STATE.md si changement significatif
