# Club M — Handover / Guide de reprise

**Date** : 25 mars 2026
**Projet** : Club M — Plateforme communautaire & marketplace pour femmes entrepreneures (Kinshasa, RDC)

## Resume executif

Club M est une application web Next.js 16 fonctionnelle avec :
- 53 pages, 17 modeles Prisma, 12 domaines metier, 106 composants
- Auth complete (Auth.js v5, JWT, guards 3 niveaux, middleware)
- Marketplace avec panier, checkout, confirmation commande
- Business dashboard premium (dark theme, KPIs, charts Recharts)
- Admin complet (analytics, membres, events, commandes, paiements, audit)
- Seed data realiste : 50 commandes, 5 business, 15 produits, contexte Kinshasa

Le MVP est a ~85% de completion. Les 15% restants sont documentes dans NEXT_STEPS.md et KNOWN_GAPS.md.

## Comment lancer le projet

### Prerequisites
- Node.js 20+
- PostgreSQL (local, base `clubm`)
- npm

### Installation
```bash
cd /Users/lm/Desktop/club-m-new-version
npm install
```

### Base de donnees
```bash
npx prisma migrate dev     # Appliquer le schema
npx prisma generate        # Generer le client
npx prisma db seed         # Charger les donnees de test
```

### Demarrer
```bash
npx next dev --webpack -p 3000
```
Note : utiliser `--webpack` plutot que Turbopack (plus stable). Ne PAS utiliser Google Fonts (supprimees pour eviter timeout reseau).

### Acceder
- Homepage : http://localhost:3000
- Marketplace : http://localhost:3000/marketplace
- Login : http://localhost:3000/login (boutons connexion rapide 1 clic)

### Comptes de test
| Role | Email | Mot de passe | Redirect |
|------|-------|-------------|----------|
| Admin | admin@clubm.cd | admin123 | /admin/dashboard |
| Business (Grace Fashion) | grace@clubm.cd | member123 | /mon-business |
| Business (Chez Esther) | esther@clubm.cd | member123 | /mon-business |
| Business (Belle Ornella) | ornella@clubm.cd | member123 | /mon-business |
| Business (Sarah Events) | sarah@clubm.cd | member123 | /mon-business |
| Business (Christi Cosmetics) | christelle@clubm.cd | member123 | /mon-business |
| Free | fabiola@example.com | member123 | /dashboard |

## Structure du projet

```
CLAUDE.md                — Regles et conventions du projet
PROJECT_STATE.md         — Etat actuel detaille
SESSION_LOG.md           — Historique des sessions
NEXT_STEPS.md            — Plan d'action priorise
KNOWN_GAPS.md            — Gaps et points manquants
ARCHITECTURE_OVERVIEW.md — Vue technique detaillee
HANDOVER.md              — Ce fichier

docs/handover/           — Rapports et references (audit HTML)
docs/superpowers/specs/  — Spec produit originale
docs/superpowers/plans/  — Plans d'implementation (1 a 4, tous executes)

app/                     — Pages Next.js (route groups)
domains/                 — Logique metier (actions + queries)
integrations/            — Providers externes (payment, email, storage, kyc)
lib/                     — Auth, guards, errors, utils
components/              — Composants React
prisma/                  — Schema + seed + migrations
context/                 — Cart context (localStorage)
```

## Points critiques a connaitre

### Auth — Config splitee
L'auth est splitee en 2 fichiers pour compatibilite Edge Runtime :
- `lib/auth.config.ts` — Config partagee (sans DB, compatible Edge/middleware)
- `lib/auth.ts` — Config complete avec Credentials provider + DB

### Paiement — Stub
`integrations/payment/local-fintech.ts` est un stub. Toutes les commandes sont marquees PAID automatiquement. L'interface abstraite est prete pour brancher une vraie fintech.

### Emails — Non branches
Resend est configure mais API key vide en dev. Templates existent dans `lib/email.ts` mais ne sont appeles que par le formulaire de contact. Voir KNOWN_GAPS.md.

### Prisma — Adapter PrismaPg
Le projet utilise `@prisma/adapter-pg` avec un pool PostgreSQL. Le client est genere dans `lib/generated/prisma/client` (PAS le path standard `@prisma/client`). Tous les imports doivent utiliser `from '@/lib/generated/prisma/client'`.

### URLs — Francaises
Toutes les URLs membre : `/profil`, `/achats`, `/mon-business`, `/evenements`, `/annuaire`, `/kyc`. Routes protegees dans `lib/routes.ts`.

### Business Dashboard — Layout separe
Le module `/mon-business/*` a son propre layout (sidebar + navbar dark). Le layout membre skip sa sidebar pour ces routes via un header `x-pathname` du middleware.

### Server Actions — Pattern return-value
Tous les Server Actions retournent `{ success: true, data } | { success: false, error, details? }`. Ils ne throw JAMAIS (les erreurs ne se serialisent pas via Server Actions Next.js).

## Quoi verifier en premier

1. `npx next dev --webpack -p 3000` demarre sans erreur
2. http://localhost:3000 affiche la homepage avec le design original
3. http://localhost:3000/login → clic sur un compte → redirection correcte
4. http://localhost:3000/mon-business affiche le dashboard business avec KPIs
5. http://localhost:3000/marketplace affiche les produits avec images
6. Ajouter un produit au panier depuis une boutique → /panier → /checkout

## Comment ne pas casser l'existant

1. **Pas de logique metier dans `app/`** — toujours dans `domains/`
2. **Pas d'import Prisma direct** — passer par queries/actions
3. **Toujours un guard en premiere ligne** des Server Actions
4. **Toujours valider avec Zod**
5. **Pattern return-value** (pas throw)
6. **Ne pas toucher `app/(site)/`** sans verification — design original du client
7. **Tester sur mobile** — marche RDC = telephone

## Documents de reference

| Document | Emplacement | Contenu |
|----------|-------------|---------|
| Spec produit | `docs/superpowers/specs/2026-03-23-club-m-platform-design.md` | Architecture cible, modeles, permissions, flows |
| Audit global (HTML) | `docs/handover/audit-global-club-m.html` | Audit complet avec tables, badges, plan execution |
| Plans d'implementation | `docs/superpowers/plans/` | 6 plans (1, 2, 3A, 3B, 3C, 4) tous executes |
| Prochaines etapes | `NEXT_STEPS.md` | Plan priorise en 4 phases (24 chantiers) |
| Gaps connus | `KNOWN_GAPS.md` | Tout ce qui manque ou est simule |
