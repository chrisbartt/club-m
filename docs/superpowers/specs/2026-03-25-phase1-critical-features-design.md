# Phase 1 — Critical Features Design Spec

**Date** : 2026-03-25
**Status** : Validated
**Scope** : 6 chantiers bloquant la production

---

## Overview

Phase 1 addresses 6 critical gaps that block Club M from going to production. The work is ordered logically: auth + email foundations first (chantiers 1-3), then pages that benefit from them (chantiers 4-6).

**Estimated effort** : ~4.5 days
**Dependencies** : None (builds on existing MVP)

### New domain: `domains/auth/`

This creates a new `domains/auth/` domain (13th domain) for authentication lifecycle actions: password reset, email verification, email change. Registration remains in `domains/members/`. Login/session management remains in `lib/auth.ts`.

---

## Chantier 1 — Password Reset

### Problem
Users who forget their password have zero recovery path. This is the #1 blocker for production.

### Solution

**New Prisma model:**
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique          // hashed (SHA-256), raw token sent via email
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime                  // now() + 24h (context RDC, connexions lentes)
  usedAt    DateTime?                 // null until consumed
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}
```

**Flow:**
1. User clicks "Mot de passe oublie ?" on `/login`
2. `/forgot-password` page: user enters email
3. Server action `requestPasswordReset(email)`:
   - Lookup user by email
   - If not found: return same success message (security — no email enumeration)
   - If found: invalidate all existing tokens for this user, generate 64-char crypto random token, hash with SHA-256, store in DB, send email with raw token in URL
4. Email contains link to `/reset-password/[token]`
5. `/reset-password/[token]` page: user enters new password + confirmation
6. Server action `resetPassword(token, newPassword)`:
   - Hash incoming token with SHA-256, lookup in DB
   - Validate: exists, not used, not expired
   - Update user's passwordHash (bcrypt)
   - Mark token as used (usedAt = now())
   - Redirect to `/login` with success message

**Security:**
- Token hashed in DB (raw token only in email URL)
- 24h expiration (context RDC)
- Single active token per user (previous tokens invalidated on new request)
- Same response whether email exists or not (prevent enumeration)
- New password validated with Zod (min 8 chars, confirmation match)
- Rate limit: max 1 request per email per 5 minutes
- Token invalidation = set `usedAt = now()` on all existing tokens for this user (soft-delete convention)

**Files to create/modify:**
- `prisma/schema.prisma` — add PasswordResetToken model
- `domains/auth/actions.ts` — requestPasswordReset, resetPassword
- `domains/auth/validators.ts` — Zod schemas
- `app/(auth)/forgot-password/page.tsx` — email input form
- `app/(auth)/reset-password/[token]/page.tsx` — new password form
- `lib/email.ts` — sendPasswordResetEmail template
- `app/(auth)/login/page.tsx` — add "Mot de passe oublie ?" link

---

## Chantier 2 — Email Verification

### Problem
Accounts are created without email verification. No way to confirm a user owns the email they registered with.

### Solution

**New Prisma model:**
```prisma
model EmailVerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique          // hashed (SHA-256)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime                  // now() + 24h
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}
```

**Flow:**
1. On registration (`registerMember`), create token and send verification email
2. Email contains link to `/verify-email/[token]`
3. User clicks link → server action validates token, sets `user.emailVerified = true`
4. Success page with redirect to dashboard

**Progressive blocking (blocage doux evolutif):**

| Periode | Comportement |
|---------|-------------|
| 0-24h | Bandeau jaune en haut du dashboard: "Verifiez votre email pour debloquer toutes les fonctionnalites" + bouton "Renvoyer" + lien "Modifier mon email" |
| 24-48h | Bandeau orange plus insistant: "Action requise : verifiez votre email" |
| 48h+ | Popup modal a chaque connexion (dismissable mais revient) |

**Actions bloquees si non verifie:**
- Acheter (createCartOrder, purchaseProduct)
- Soumettre KYC (submitKyc)
- Upgrader (requestUpgrade)
- Publier business (updateBusinessProfile with isPublished=true)

**Actions autorisees:**
- Navigation, dashboard, exploration marketplace
- Modifier profil, voir historique
- Modifier email et renvoyer verification

**Renvoyer email:**
- Rate limit: max 1 envoi toutes les 2 minutes
- Invalidate previous tokens on resend
- Clear feedback: "Email envoye a xxx@xxx.com"

**Modifier email:**
- Accessible depuis le bandeau de verification
- Requires current password re-entry (re-authentication, security)
- Valide nouvel email avec Zod (format + unicite)
- Invalide ancien token (set usedAt = now()), genere nouveau, envoie a la nouvelle adresse
- Met a jour user.email

**Progressive blocking logic:**
- Uses `user.createdAt` to determine time since registration (emailVerified is Boolean, not DateTime)
- Banner component receives `createdAt` and `emailVerified` from session/server props

**Files to create/modify:**
- `prisma/schema.prisma` — add EmailVerificationToken model
- `domains/auth/actions.ts` — verifyEmail, resendVerificationEmail, changeEmailAndResend
- `domains/auth/validators.ts` — Zod schemas
- `app/(auth)/verify-email/[token]/page.tsx` — verification page
- `components/shared/email-verification-banner.tsx` — progressive banner (client component)
- `lib/email.ts` — sendVerificationEmail template
- `domains/members/actions.ts` — modify registerMember to send verification email
- Guards: add `requireVerifiedEmail()` check in sensitive actions

---

## Chantier 3 — Emails essentiels (Resend)

### Problem
Only 1 email is sent in the entire app (contact form). Templates exist in `lib/email.ts` but are never called.

### Solution

**8 email templates to implement:**

| # | Template | Declencheur | Destinataire | Action file |
|---|----------|-------------|-------------|-------------|
| 1 | Welcome + verification link | registerMember | Nouveau membre | domains/members/actions.ts |
| 2 | Email verifie | verifyEmail | Membre | domains/auth/actions.ts |
| 3 | Password reset link | requestPasswordReset | Utilisateur | domains/auth/actions.ts |
| 4 | Commande passee (acheteur) | createCartOrder | Acheteur | domains/orders/actions.ts |
| 5 | Nouvelle commande (vendeuse) | createCartOrder | Vendeuse | domains/orders/actions.ts |
| 6 | Commande expediee | markAsShipped | Acheteur | domains/orders/actions.ts |
| 7 | Livraison confirmee (acheteur) | confirmDelivery | Acheteur | domains/orders/actions.ts |
| 8 | Livraison confirmee (vendeuse) | confirmDelivery | Vendeuse | domains/orders/actions.ts |

**Email design:**
- All emails use the existing branded HTML template style (color #a55b46, Club M branding)
- French language
- Mobile-friendly (simple layout, large CTA buttons)
- Footer with "Club M — Kinshasa, RDC" + unsubscribe mention

**Error handling:**
- Each email send wrapped in try/catch — email failure never blocks the main action
- On failure: log error to console, action still succeeds
- Retry: 1 automatic retry on transient failure (network timeout)
- User-facing: if email not received, user can resend (verification) or re-request (password reset)
- Modify email: user can change their email address and trigger a new send
- Status visibility: email delivery status not tracked in MVP (Resend dashboard for debugging)

**Configuration:**
- `RESEND_API_KEY` in `.env` (empty = skip sending, log to console in dev)
- `EMAIL_FROM` defaults to "Club M <noreply@clubm.cd>" (configurable)

**Files to modify:**
- `lib/email.ts` — add 5 new templates (3 exist), add retry logic
- `domains/members/actions.ts` — wire sendWelcomeEmail in registerMember
- `domains/orders/actions.ts` — wire order emails in createCartOrder, markAsShipped, confirmDelivery

---

## Chantier 4 — Page admin KYC (`/admin/kyc`)

### Problem
Admin must navigate to individual member pages to review KYC. No centralized view for processing pending verifications.

### Solution

**Page layout:**
- Full-width table with columns: Membre, Tier, Date soumission, Statut, Actions
- Filter tabs: PENDING (default) | APPROVED | REJECTED | Tous
- Search by member name
- Badge compteur in admin sidebar: "KYC (n)" showing pending count

**Panel lateral (Sheet/Drawer):**
- Opens on row click (right side, ~50% width)
- Shows: member info (name, email, tier, registration date)
- Document display: ID document + selfie (full-size images, click to zoom)
- KYC history for this member (previous submissions if any)
- Traceability: reviewedBy (admin name), reviewedAt (date/time), rejectionReason
- Actions: Approuver / Rejeter (with required reason input for rejection)
- Navigation: Previous / Next buttons to move between KYC entries without closing panel

**Behavior:**
- After approve/reject: list updates instantly (useRouter refresh), panel moves to next item
- Empty state: "Aucune verification en attente" with checkmark icon
- All actions create audit log entries

**Files to create/modify:**
- `app/(admin)/admin/kyc/page.tsx` — main page (server component)
- `components/admin/kyc-list.tsx` — table with filters (client component)
- `components/admin/kyc-detail-panel.tsx` — Sheet panel with detail + actions (client component)
- `domains/kyc/queries.ts` — add getKycListWithFilters, getKycCount
- Admin sidebar component — add KYC link with badge count

---

## Chantier 5 — Page admin detail boutique (`/admin/annuaire/[id]`)

### Problem
Admin can approve/reject profiles from the directory list but has no detail view to inspect a business before deciding.

### Solution

**Page layout (server component):**

**Header section:**
- Cover image (or placeholder)
- Business name, category badge, profile type (SHOWCASE/STORE)
- Member owner: name, email, tier, verification status
- Status badges: isPublished, isApproved

**Info section (grid):**
- Description
- Contact: phone, email, WhatsApp, website
- Address (commune, quartier)
- Registration date

**Stats section (KPI cards):**
- Total products (active / inactive)
- Total orders received
- Total revenue (CA)
- Average order value

**Products section:**
- Table: Product name, price, type, stock, status (active/inactive)
- Link to each product

**Actions section:**
- Approuver / Rejeter / Suspendre buttons
- Preview: link to public boutique page `/boutique/[slug]`
- All actions logged to audit

**Files to create/modify:**
- `app/(admin)/admin/annuaire/[id]/page.tsx` — detail page (consistent URL with listing at /admin/annuaire)
- `domains/directory/queries.ts` — add getProfileWithStats(id)
- `domains/directory/admin-actions.ts` — add suspendProfile if not exists
- `app/(admin)/admin/annuaire/page.tsx` — add link to detail page per row

---

## Chantier 6 — Detail commande acheteur (`/achats/[id]`)

### Problem
Buyers can see their order list but cannot view the detail of a specific order. The confirmation code is only shown on the confirmation page after purchase.

### Solution

**Page layout (server component):**

**Header:**
- Order number (truncated ID or formatted)
- Date
- Status badge (colored: PAID=blue, SHIPPED=orange, DELIVERED=green)

**Articles section:**
- List: product image (thumbnail), name, quantity, unit price, subtotal per item
- Link to product page for each item

**Totals section:**
- Subtotal
- Commission (10%)
- Total paid
- Currency

**Confirmation code section (prominent):**
- Large display of the 6-character code
- Explanation: "Donnez ce code a la livreuse pour confirmer la reception"
- Expiration date
- Visual warning if code expired
- Code unique per order, verified backend-only (no client-side validation)

**Delivery address:**
- Commune, quartier, avenue, repere
- Phone number
- Note: `createCartOrder` accepts delivery address but does NOT persist it in DB. As prerequisite, add delivery address fields to the `Order` model: `deliveryPhone`, `deliveryCommune`, `deliveryQuartier`, `deliveryAvenue`, `deliveryRepere` (nullable strings). Update `createCartOrder` to save these fields.

**Seller info:**
- Business name (link to boutique)
- WhatsApp button (direct link)
- Phone number

**Status timeline:**
- Vertical timeline: PAID → SHIPPED → DELIVERED
- Each step shows date/time when reached
- Current step highlighted
- Future steps grayed out
- Note: currently `confirmDelivery` sets status to COMPLETED. Update to set DELIVERED instead. COMPLETED will be reserved for future use (e.g., payout processed). Add `shippedAt` and `deliveredAt` DateTime? fields to Order model for timeline dates.

**Security — Confirmation code:**
- Code unique per order (uniqueness check on generation, retry if collision)
- Verification backend-only via `confirmDelivery` action
- No hint on code validity on error (generic "Code invalide ou expire")
- Code displayed only to authenticated buyer (owner check)

**Files to create/modify:**
- `app/(member)/achats/[id]/page.tsx` — detail page (server component)
- `components/orders/order-detail.tsx` — order detail display
- `components/orders/order-timeline.tsx` — status timeline component
- `components/orders/confirmation-code-display.tsx` — prominent code display
- `domains/orders/queries.ts` — add getOrderForBuyer(orderId, memberId) with owner check

---

## Cross-cutting concerns

### Prisma migration
Single migration covering:
- New models: `PasswordResetToken`, `EmailVerificationToken` (with @@index on userId, expiresAt)
- New fields on `Order`: `deliveryPhone`, `deliveryCommune`, `deliveryQuartier`, `deliveryAvenue`, `deliveryRepere` (all String?), `shippedAt` (DateTime?), `deliveredAt` (DateTime?)
- New relation on `User`: passwordResetTokens[], emailVerificationTokens[]
- Run `prisma migrate dev` to generate and apply

### Audit logging
- All new server actions must call `createAuditLog()`
- Actions: PASSWORD_RESET_REQUESTED, PASSWORD_RESET_COMPLETED, EMAIL_VERIFIED, EMAIL_VERIFICATION_RESENT, KYC_REVIEWED (already exists), PROFILE_APPROVED/REJECTED (already exists)

### Error handling pattern
- All actions follow existing return-value pattern: `{ success: true, data } | { success: false, error, details? }`
- Never throw from server actions
- All new server actions must wrap their body in try/catch, catching AuthError/BusinessError and converting to `{ success: false, error: ... }`, consistent with existing actions like `purchaseProduct`
- Email failures never block main action flow (try/catch inside email sends)
- Zod validation on all inputs

### Audit logging additions
- All new server actions must call `createAuditLog()`
- `markAsShipped` currently has no audit log — add one as part of this work
- `purchaseProduct` and `createCartOrder` also need audit log calls added
- Actions: PASSWORD_RESET_REQUESTED, PASSWORD_RESET_COMPLETED, EMAIL_VERIFIED, EMAIL_VERIFICATION_RESENT, KYC_REVIEWED (exists), PROFILE_APPROVED/REJECTED (exists), ORDER_CREATED, ORDER_SHIPPED, ORDER_DELIVERED

### New constants (`lib/constants.ts`)
- `PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 24`
- `EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24`
- `EMAIL_RESEND_COOLDOWN_MINUTES = 2`
- `PASSWORD_RESET_COOLDOWN_MINUTES = 5`
- `TOKEN_LENGTH = 64`

### Order number display format
- Display as `CM-XXXXXXXX` (prefix "CM-" + first 8 chars of cuid ID)
- Used only for display, not for lookups (use full ID internally)

### Existing patterns to follow
- Guards: `requireAuth()`, `requireMember()`, `requireAdmin()` at start of every action
- DB truth: guards always read DB, never trust JWT alone
- Soft-delete: never hard-delete records
- Token invalidation: set `usedAt = now()` (not hard-delete)
- French URLs: `/achats/[id]`, `/admin/kyc`, `/admin/annuaire/[id]`
- Prisma imports from `@/lib/generated/prisma/client`
- Admin sidebar: `components/admin/admin-sidebar.tsx` (add KYC badge here)
