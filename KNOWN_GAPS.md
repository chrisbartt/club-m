# Club M — Gaps Connus

**Derniere mise a jour** : 25 mars 2026

## Integrations simulees

| Integration | Provider | Status | Impact |
|-------------|----------|--------|--------|
| **Paiement** | Local Fintech | STUB — throw PROVIDER_UNAVAILABLE | Toutes commandes marquees PAID automatiquement (simulation MVP) |
| **Email** | Resend | Configure, RESEND_API_KEY vide | 1 seul email envoye (contact form). Templates existent dans lib/email.ts mais jamais appeles |
| **KYC** | Manuel | Fonctionnel mais basique | Admin review manuelle. Pas de provider externe (Sumsub/Onfido) |
| **Storage** | Cloudinary | OPERATIONNEL | SDK fonctionne, credentials OK. Mais les formulaires utilisent des inputs URL au lieu d'un widget upload |

## Ecrans manquants

| Page | Route | Priorite | Pourquoi c'est manquant |
|------|-------|----------|------------------------|
| Reset mot de passe | /forgot-password | CRITIQUE | Utilisateurs bloques si oubli mot de passe |
| Nouveau mot de passe | /reset-password/[token] | CRITIQUE | Suite du flow password reset |
| Verification email | /verify-email | HAUTE | Emails non verifies apres inscription |
| Onboarding | /onboarding | HAUTE | Nouveaux membres perdus, pas de guidage |
| Notifications | /notifications | HAUTE | Pas de suivi in-app des evenements |
| Detail commande acheteur | /achats/[id] | HAUTE | Acheteur ne peut pas voir le detail de sa commande |
| Admin KYC | /admin/kyc | CRITIQUE | Admin ne peut pas facilement reviewer les KYC en attente |
| Admin detail boutique | /admin/boutiques/[id] | HAUTE | Approbation boutique pas facilement accessible |
| Preferences | /settings | MOYENNE | Pas de page parametres membre |
| FAQ | /faq | BASSE | FAQ existe en bloc mais pas en page dediee |
| CGU | /conditions-utilisation | BASSE | Legal manquant |
| Confidentialite | /politique-confidentialite | BASSE | RGPD manquant |

## Notifications non branchees

**Constat : 1 seul email est envoye dans toute l'application (formulaire de contact).**

Emails qui devraient etre envoyes mais ne le sont PAS :

| Declencheur | Destinataire | Fichier action | Template existant ? |
|-------------|-------------|----------------|-------------------|
| Inscription reussie | Membre | domains/members/actions.ts | Oui (lib/email.ts) mais pas appele |
| Commande passee | Acheteur + Vendeuse | domains/orders/actions.ts | Non |
| Commande expediee | Acheteur | domains/orders/actions.ts | Non |
| Livraison confirmee | Acheteur + Vendeuse | domains/orders/actions.ts | Non |
| KYC soumis | Admin | domains/kyc/actions.ts | Non |
| KYC approuve/rejete | Membre | domains/kyc/actions.ts | Oui (lib/email.ts) mais pas appele |
| Boutique approuvee | Membre Business | domains/directory/admin-actions.ts | Non |
| Upgrade complete | Membre | domains/upgrade/actions.ts | Non |
| Ticket evenement | Participant | domains/tickets/actions.ts | Non |

## Automatisations manquantes

| Automatisation | Impact | Status |
|---------------|--------|--------|
| Relance panier abandonne (email 24h) | Revenu perdu | Non implemente |
| Rappel inactivite membre (30j) | Churn | Non implemente |
| Alerte stock faible (vendeuse) | Rupture invisible | Non implemente |
| Expiration abonnement (7j avant) | Surprise downgrade | Non implemente |
| Auto-completion commande (48h post-livraison) | Commande bloquee | Non implemente |
| Rapport hebdo/mensuel business | Pilotage aveugle | Non implemente |

## Modeles DB manquants (recommandes)

| Modele | But | Priorite |
|--------|-----|----------|
| PasswordResetToken | Tokens pour reset mot de passe | CRITIQUE |
| EmailVerificationToken | Tokens pour verification email | HAUTE |
| Notification | Notifications in-app | HAUTE |
| OrderStatusHistory | Timeline des changements de statut commande | HAUTE |
| ProductVariant | Tailles, couleurs, options produit | MOYENNE |
| Review | Avis et notations produits/boutiques | MOYENNE |
| Coupon | Codes promo et reductions | MOYENNE |
| Dispute | Gestion litiges commandes | MOYENNE |

## Champs manquants sur modeles existants

| Modele | Champ | But |
|--------|-------|-----|
| BusinessProfile | logo | Logo dedie (distinct du coverImage) |
| BusinessProfile | deliveryInfo | Informations livraison |
| BusinessProfile | paymentMethods | Moyens de paiement acceptes |
| Product | status enum (DRAFT/ACTIVE/ARCHIVED) | Plus explicite que isActive boolean |

## Features e-commerce manquantes

| Feature | Status | Priorite |
|---------|--------|----------|
| Variantes produit (taille, couleur) | Non implemente | HAUTE |
| Avis / notations | Non implemente | HAUTE |
| Coupons / reductions | Non implemente | MOYENNE |
| Flow remboursement | Enum REFUNDED existe, pas de flow | MOYENNE |
| Gestion litiges | Enum DISPUTED existe, pas de flow | MOYENNE |
| Wishlist / favoris | Non implemente | BASSE |
| Suivi livraison temps reel | Non implemente | BASSE |
| Multi-devise checkout | Partiel (3 devises supportees, pas de conversion) | BASSE |

## Problemes UX identifies (Top 10)

1. **3 systemes de design differents** — site vitrine (clair) / dashboard business (dark) / membre-admin (clair basique)
2. **Dashboard business trop charge** — 8 KPIs sans filtre de date
3. **Filtres marketplace cassent sur mobile** < 375px
4. **Checkout vague sur les frais** — "Livraison a definir avec la vendeuse"
5. **Fiche produit : colonne droite pas sticky**
6. **Pas d'indicateur stock dans les cards marketplace**
7. **Labels KPIs peu lisibles** (uppercase trop petit)
8. **Pagination marketplace non-standard** ("Voir plus" sans total)
9. **Admin dashboard manque d'alertes critiques** (KYC en attente, litiges)
10. **Menu mobile sans feedback visuel** (hamburger statique)

## Securite manquante

| Feature | Priorite |
|---------|----------|
| Password reset | CRITIQUE |
| Email verification | HAUTE |
| Rate limiting (brute force login/register) | HAUTE |
| 2FA (optionnel Business/Admin) | BASSE |
| Suppression de compte | MOYENNE |
