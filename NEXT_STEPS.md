# Club M — Prochaines Etapes

**Derniere mise a jour** : 25 mars 2026

## Phase 1 — CRITIQUE (bloque la production)

| # | Chantier | Effort | Detail |
|---|----------|--------|--------|
| 1 | **Password reset** | 1 jour | Creer PasswordResetToken model, pages /forgot-password et /reset-password/[token], actions requestReset + resetPassword |
| 2 | **Email verification** | 1 jour | Creer EmailVerificationToken model, page /verify-email, envoyer email a l'inscription, bloquer certaines actions si non verifie |
| 3 | **Activer Resend + brancher emails** | 1 jour | Mettre RESEND_API_KEY dans .env, appeler les emails dans : registerMember, createCartOrder, markAsShipped, confirmDelivery, reviewKyc, approveProfile |
| 4 | **Page admin KYC dediee** | 0.5 jour | Creer /admin/kyc avec liste KYC en attente, interface approve/reject, affichage documents |
| 5 | **Page admin detail boutique** | 0.5 jour | Creer /admin/boutiques/[id] avec detail profil, approve/reject, preview boutique publique |
| 6 | **Detail commande acheteur** | 0.5 jour | Creer /achats/[id] avec recapitulatif, articles, code confirmation, timeline, contact vendeuse |

**Total Phase 1 : ~4.5 jours**

## Phase 2 — HAUTE priorite (UX et confiance)

| # | Chantier | Effort |
|---|----------|--------|
| 7 | Onboarding post-inscription (checklist membre) | 1 jour |
| 8 | Emails dans toutes les actions (welcome, commande, KYC, upgrade, ticket) | 2 jours |
| 9 | Modele Notification + centre notifications in-app (/notifications) | 1.5 jours |
| 10 | Upload fichiers Cloudinary (widget au lieu d'inputs URL texte) | 1.5 jours |
| 11 | Harmoniser le design (3 systemes → 2 coherents : site public + dashboard) | 2 jours |
| 12 | Audit + fix responsive mobile (pages cles : marketplace, boutique, checkout, dashboard) | 1.5 jours |

**Total Phase 2 : ~9.5 jours**

## Phase 3 — MOYENNE priorite (features business)

| # | Chantier | Effort |
|---|----------|--------|
| 13 | Paiement reel (brancher fintech locale RDC, webhooks, statuts reels) | 3 jours |
| 14 | Variantes produit (taille/couleur — ProductVariant model, UI selecteurs) | 2 jours |
| 15 | Categories/collections produits dans une boutique | 1 jour |
| 16 | Systeme d'avis/notation (Review model, formulaire post-livraison, affichage) | 2 jours |
| 17 | Coupons/reductions (Coupon model, application au checkout, gestion admin) | 1.5 jours |
| 18 | Gestion litiges (Dispute model, formulaire, resolution admin) | 1.5 jours |
| 19 | Timeline commande (OrderStatusHistory model, affichage dans detail commande) | 1 jour |

**Total Phase 3 : ~12 jours**

## Phase 4 — POLISH (production-ready)

| # | Chantier | Effort |
|---|----------|--------|
| 20 | Rate limiting (login, register — Upstash ou in-memory) | 0.5 jour |
| 21 | Pages legales (CGU, confidentialite, politique retour) | 0.5 jour |
| 22 | SEO (meta tags dynamiques, sitemap.xml, OG images) | 1 jour |
| 23 | Tests automatises (flows critiques : inscription, achat, livraison, KYC) | 3 jours |
| 24 | Deploiement (Vercel + DB cloud PostgreSQL + env production) | 1 jour |

**Total Phase 4 : ~6 jours**

---

**Total estime : ~32 jours pour production complete**

## Quick wins (faisables en < 2h chacun)

1. Activer RESEND_API_KEY (1 ligne dans .env)
2. Appeler sendWelcomeEmail() dans registerMember() (10 lignes)
3. Ajouter Settings page basique (/settings)
4. Ajouter page FAQ (/faq)
5. Fixer sticky sur la fiche produit (CSS)
6. Ajouter indicateur stock dans les cards marketplace
