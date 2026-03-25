# Phase 1 — Critical Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unblock production by adding password reset, email verification, essential emails, admin KYC page, admin boutique detail, and buyer order detail.

**Architecture:** Extends existing MVP with 2 new Prisma models (tokens), a new `domains/auth/` domain, 8 email templates in `lib/email.ts`, 3 new pages, and schema additions to Order. All follows existing patterns (return-value actions, Zod validation, audit logging, guards).

**Tech Stack:** Next.js 16, Prisma 7, Auth.js v5, Zod 4, Resend, Tailwind CSS 4, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-25-phase1-critical-features-design.md`

---

## File Structure

### New files
```
domains/auth/actions.ts          — Password reset + email verification server actions
domains/auth/validators.ts       — Zod schemas for auth actions
domains/auth/queries.ts          — Token lookup queries
app/(auth)/forgot-password/page.tsx      — Forgot password form
app/(auth)/reset-password/[token]/page.tsx — Reset password form
app/(auth)/verify-email/[token]/page.tsx  — Email verification landing
components/shared/email-verification-banner.tsx — Progressive verification banner
app/(admin)/admin/kyc/page.tsx           — Admin KYC list page
components/admin/kyc-list.tsx            — KYC table with filters (client)
components/admin/kyc-detail-panel.tsx    — KYC Sheet panel (client)
app/(admin)/admin/annuaire/[id]/page.tsx — Admin boutique detail
app/(member)/achats/[id]/page.tsx        — Buyer order detail
components/orders/order-timeline.tsx     — Status timeline component
components/orders/confirmation-code-display.tsx — Prominent code display
```

### Modified files
```
prisma/schema.prisma             — 2 new models + Order fields + User relations
lib/email.ts                     — 8 email templates (5 new + modify 3 existing)
lib/constants.ts                 — New constants (token expiry, cooldowns)
lib/auth-guards.ts               — Add requireVerifiedEmail() guard
lib/errors.ts                    — Add EMAIL_NOT_VERIFIED to BusinessErrorCode
lib/server-utils.ts              — NEW: generateSecureToken(), hashToken(), formatOrderNumber() (server-only, uses crypto)
domains/members/actions.ts       — Wire verification email in registerMember
domains/orders/actions.ts        — Wire order emails + persist delivery address + audit logs + DELIVERED status
domains/directory/actions.ts     — Add requireVerifiedEmail() to togglePublishProfile
domains/kyc/queries.ts           — Add getKycListWithFilters, getKycCount
domains/directory/queries.ts     — Add getProfileWithStats
components/admin/admin-sidebar.tsx — Add KYC link with badge
app/(auth)/login/page.tsx        — Add "Mot de passe oublie" link
app/(member)/achats/page.tsx     — Add link to order detail
app/(admin)/admin/annuaire/page.tsx — Add link to boutique detail
```

---

## Task 1: Prisma schema + migration

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add new models and fields to schema**

Add after the AuditLog model (line 488) in `prisma/schema.prisma`:

```prisma
model PasswordResetToken {
  id        String    @id @default(cuid())
  token     String    @unique
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([userId])
  @@index([expiresAt])
}

model EmailVerificationToken {
  id        String    @id @default(cuid())
  token     String    @unique
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([userId])
  @@index([expiresAt])
}
```

Add delivery address and timeline fields to the Order model (after `codeUsed` field, line 392):

```prisma
  deliveryPhone    String?
  deliveryCommune  String?
  deliveryQuartier String?
  deliveryAvenue   String?
  deliveryRepere   String?
  shippedAt        DateTime?
  deliveredAt      DateTime?
```

Add relations to the User model (after `adminAccount` relation, line 21):

```prisma
  passwordResetTokens      PasswordResetToken[]
  emailVerificationTokens  EmailVerificationToken[]
```

- [ ] **Step 2: Run migration**

Run: `npx prisma migrate dev --name phase1_tokens_and_order_fields`

Expected: Migration created and applied successfully.

- [ ] **Step 3: Verify generated client**

Run: `npx prisma generate`

Expected: Prisma Client generated successfully.

- [ ] **Step 4: Commit**

```bash
git add prisma/
git commit -m "feat: add PasswordResetToken, EmailVerificationToken models and Order delivery fields"
```

---

## Task 2: Constants + utilities

**Files:**
- Modify: `lib/constants.ts`
- Modify: `lib/errors.ts`
- Create: `lib/server-utils.ts`

- [ ] **Step 1: Add new constants**

Add at the end of `lib/constants.ts` (after line 27):

```typescript
// Auth tokens
export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 24
export const EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24
export const EMAIL_RESEND_COOLDOWN_MINUTES = 2
export const PASSWORD_RESET_COOLDOWN_MINUTES = 5
export const TOKEN_LENGTH = 64
```

- [ ] **Step 2: Add EMAIL_NOT_VERIFIED to BusinessErrorCode**

In `lib/errors.ts`, add `'EMAIL_NOT_VERIFIED'` to the `BusinessErrorCode` union type (after line 26):

```typescript
  | 'EMAIL_NOT_VERIFIED'
```

- [ ] **Step 3: Create server-only utilities**

Create `lib/server-utils.ts` (separate from `lib/utils.ts` to avoid bundling Node.js `crypto` in client code):

```typescript
import { randomBytes, createHash } from 'crypto'
import { TOKEN_LENGTH } from './constants'

export function generateSecureToken(length: number = TOKEN_LENGTH): string {
  return randomBytes(length).toString('hex').slice(0, length)
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function formatOrderNumber(orderId: string): string {
  return `CM-${orderId.slice(0, 8).toUpperCase()}`
}
```

**Important:** `lib/utils.ts` contains `cn()` which is imported by client components. Never put Node.js-only imports (`crypto`) in `lib/utils.ts` — use `lib/server-utils.ts` for server-only utilities.

- [ ] **Step 4: Commit**

```bash
git add lib/constants.ts lib/errors.ts lib/server-utils.ts
git commit -m "feat: add token constants, EMAIL_NOT_VERIFIED error code, and server utilities"
```

---

## Task 3: Email templates

**Files:**
- Modify: `lib/email.ts`

- [ ] **Step 1: Read current email.ts**

Read `lib/email.ts` to understand the existing template style and Resend setup.

- [ ] **Step 2: Rewrite email.ts with all 8 templates**

Keep the existing Resend import and config. Keep ALL 3 existing templates (including `sendVerificationPendingEmail`). Add retry logic and 5 new templates. The file should export these functions:

```typescript
// Existing (keep, modify to include verification link in welcome):
sendWelcomeEmail(to, prenom, verificationUrl?)  // verificationUrl is OPTIONAL for backward compatibility

// Existing (keep as-is):
sendVerificationApprovedEmail(to, prenom)

// New:
sendPasswordResetEmail(to, prenom, resetUrl)
sendEmailVerifiedConfirmation(to, prenom)
sendOrderConfirmationBuyer(to, prenom, order)   // order: { number, items, total, currency, confirmationCode, businessName }
sendOrderNotificationSeller(to, businessName, order)  // order: { number, buyerName, items, total, currency }
sendOrderShippedEmail(to, prenom, order)         // order: { number, businessName, confirmationCode }
sendDeliveryConfirmedBuyer(to, prenom, order)    // order: { number, businessName }
sendDeliveryConfirmedSeller(to, businessName, order) // order: { number, buyerName }
```

Each template:
- Branded HTML (color #a55b46, Club M header)
- French language
- Mobile-friendly (inline styles, max-width 600px)
- Footer: "Club M — Kinshasa, RDC"
- Wrapped in try/catch, email failure never blocks caller
- 1 retry on transient failure
- If `RESEND_API_KEY` empty, log to console and return (dev mode)

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add lib/email.ts
git commit -m "feat: add 8 essential email templates with retry logic"
```

---

## Task 4: Auth domain — password reset

**Files:**
- Create: `domains/auth/validators.ts`
- Create: `domains/auth/queries.ts`
- Create: `domains/auth/actions.ts`

- [ ] **Step 1: Create validators**

Create `domains/auth/validators.ts` (NO `'use server'` — validators are pure Zod schemas, not server actions):

```typescript
import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

export const forgotPasswordSchema = z.object({
  email: z.string().email({ error: 'Email invalide' }),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { error: 'Token requis' }),
  password: z.string().min(PASSWORD_MIN_LENGTH, {
    error: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caracteres`,
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export const verifyEmailSchema = z.object({
  token: z.string().min(1, { error: 'Token requis' }),
})

export const resendVerificationSchema = z.object({})

export const changeEmailSchema = z.object({
  newEmail: z.string().email({ error: 'Email invalide' }),
  currentPassword: z.string().min(1, { error: 'Mot de passe requis' }),
})
```

- [ ] **Step 2: Create queries**

Create `domains/auth/queries.ts`:

```typescript
import { db } from '@/lib/db'

export async function findValidPasswordResetToken(hashedToken: string) {
  return db.passwordResetToken.findFirst({
    where: {
      token: hashedToken,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  })
}

export async function findValidEmailVerificationToken(hashedToken: string) {
  return db.emailVerificationToken.findFirst({
    where: {
      token: hashedToken,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  })
}

export async function getLastPasswordResetRequest(userId: string) {
  return db.passwordResetToken.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLastVerificationEmailSent(userId: string) {
  return db.emailVerificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}
```

- [ ] **Step 3: Create password reset actions**

Create `domains/auth/actions.ts` with `requestPasswordReset` and `resetPassword`:

```typescript
'use server'

import { db } from '@/lib/db'
import { hashToken, generateSecureToken } from '@/lib/server-utils'
import { forgotPasswordSchema, resetPasswordSchema } from './validators'
import { findValidPasswordResetToken, getLastPasswordResetRequest } from './queries'
import { sendPasswordResetEmail } from '@/lib/email'
import { createAuditLog } from '@/domains/audit/actions'
import { PASSWORD_RESET_TOKEN_EXPIRY_HOURS, PASSWORD_RESET_COOLDOWN_MINUTES } from '@/lib/constants'
import bcrypt from 'bcryptjs'

export async function requestPasswordReset(input: unknown) {
  try {
    const parsed = forgotPasswordSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false as const, error: 'INVALID_INPUT' }
    }

    const { email } = parsed.data
    const user = await db.user.findUnique({ where: { email }, include: { member: true } })

    // Always return success (prevent email enumeration)
    if (!user) {
      return { success: true as const, data: { message: 'Si cette adresse existe, un email a ete envoye.' } }
    }

    // Rate limit: check cooldown
    const lastRequest = await getLastPasswordResetRequest(user.id)
    if (lastRequest) {
      const cooldownEnd = new Date(lastRequest.createdAt.getTime() + PASSWORD_RESET_COOLDOWN_MINUTES * 60 * 1000)
      if (new Date() < cooldownEnd) {
        return { success: true as const, data: { message: 'Si cette adresse existe, un email a ete envoye.' } }
      }
    }

    // Invalidate existing tokens (soft: set usedAt)
    await db.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    })

    // Generate and store new token
    const rawToken = generateSecureToken()
    const hashedToken = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    await db.passwordResetToken.create({
      data: { token: hashedToken, userId: user.id, expiresAt },
    })

    // Send email (non-blocking)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${rawToken}`
    const prenom = user.member?.firstName || email.split('@')[0]
    try {
      await sendPasswordResetEmail(email, prenom, resetUrl)
    } catch (e) {
      console.error('Failed to send password reset email:', e)
    }

    await createAuditLog({
      userId: user.id,
      userEmail: email,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'User',
      entityId: user.id,
    })

    return { success: true as const, data: { message: 'Si cette adresse existe, un email a ete envoye.' } }
  } catch (error) {
    console.error('requestPasswordReset error:', error)
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}

export async function resetPassword(input: unknown) {
  try {
    const parsed = resetPasswordSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false as const, error: 'INVALID_INPUT' }
    }

    const { token: rawToken, password } = parsed.data
    const hashedToken = hashToken(rawToken)
    const tokenRecord = await findValidPasswordResetToken(hashedToken)

    if (!tokenRecord) {
      return { success: false as const, error: 'TOKEN_INVALID_OR_EXPIRED' }
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 12)
    await db.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash },
    })

    // Mark token as used
    await db.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    })

    await createAuditLog({
      userId: tokenRecord.userId,
      userEmail: tokenRecord.user.email,
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'User',
      entityId: tokenRecord.userId,
    })

    return { success: true as const, data: { message: 'Mot de passe reinitialise avec succes.' } }
  } catch (error) {
    console.error('resetPassword error:', error)
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}
```

- [ ] **Step 4: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add domains/auth/
git commit -m "feat: add password reset actions, validators, and queries"
```

---

## Task 5: Auth domain — email verification

**Files:**
- Modify: `domains/auth/actions.ts`
- Modify: `domains/members/actions.ts`
- Modify: `lib/auth-guards.ts`

- [ ] **Step 1: Add email verification actions**

Add to `domains/auth/actions.ts` — three new exported functions:

- `verifyEmail(input)` — validates token, sets `user.emailVerified = true`, marks token used, audit log
- `resendVerificationEmail()` — requireAuth(), check cooldown (2 min), invalidate old tokens, generate new, send email, audit log
- `changeEmailAndResend(input)` — requireAuth(), verify current password (bcrypt.compare), check email uniqueness, update user.email, invalidate old tokens, generate new, send to new email, audit log

- [ ] **Step 2: Add requireVerifiedEmail guard**

Add to `lib/auth-guards.ts` after the existing guards:

```typescript
export async function requireVerifiedEmail() {
  const { user } = await requireAuth()
  if (!user.emailVerified) {
    throw new BusinessError('EMAIL_NOT_VERIFIED')
  }
  return { user }
}
```

- [ ] **Step 3: Wire verification email into registerMember**

In `domains/members/actions.ts`, after the user and member are created (around line 65), add:

```typescript
// Generate verification token and send email
const rawToken = generateSecureToken()
const hashedToken = hashToken(rawToken)
const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

await db.emailVerificationToken.create({
  data: { token: hashedToken, userId: user.id, expiresAt },
})

const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email/${rawToken}`
try {
  await sendWelcomeEmail(email, firstName, verificationUrl)
} catch (e) {
  console.error('Failed to send welcome email:', e)
}
```

- [ ] **Step 4: Add email verification check to sensitive actions**

Add `requireVerifiedEmail()` call at the start of these actions (inside the existing try/catch block, after the existing guard calls):
- `domains/orders/actions.ts` → `createCartOrder`, `purchaseProduct`
- `domains/kyc/actions.ts` → `submitKyc`
- `domains/upgrade/actions.ts` → `createUpgradeRequest` (note: function is named `createUpgradeRequest`, NOT `requestUpgrade`)
- `domains/directory/actions.ts` → `togglePublishProfile` (blocks publishing business if email not verified)

The existing try/catch in each action will catch the `BusinessError('EMAIL_NOT_VERIFIED')` thrown by the guard and return `{ success: false, error: 'EMAIL_NOT_VERIFIED' }`.

Import: `import { requireVerifiedEmail } from '@/lib/auth-guards'`

- [ ] **Step 5: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add domains/auth/actions.ts lib/auth-guards.ts domains/members/actions.ts domains/orders/actions.ts domains/kyc/actions.ts
git commit -m "feat: add email verification actions and wire into registration + guards"
```

---

## Task 6: Auth pages (forgot password + reset + verify email)

**Files:**
- Create: `app/(auth)/forgot-password/page.tsx`
- Create: `app/(auth)/reset-password/[token]/page.tsx`
- Create: `app/(auth)/verify-email/[token]/page.tsx`
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Create forgot password page**

Create `app/(auth)/forgot-password/page.tsx`:

- Client component with form: email input + submit button
- Calls `requestPasswordReset` action
- Shows success message regardless of result (no email enumeration)
- Link back to `/login`
- Clean design matching existing auth pages

- [ ] **Step 2: Create reset password page**

Create `app/(auth)/reset-password/[token]/page.tsx`:

- Server component that extracts token from URL params
- Client form component: new password + confirm password + submit
- Calls `resetPassword` action
- On success: show message + redirect link to `/login`
- On error: show "Lien invalide ou expire" with link to `/forgot-password`

- [ ] **Step 3: Create verify email page**

Create `app/(auth)/verify-email/[token]/page.tsx`:

- Server component that extracts token and calls `verifyEmail` server-side
- On success: show "Email verifie !" with confetti/checkmark + link to dashboard
- On error: show "Lien invalide ou expire" with button to resend

- [ ] **Step 4: Add forgot password link to login page**

In `app/(auth)/login/page.tsx`, add a link below the password field:

```tsx
<Link href="/forgot-password" className="text-sm text-primary hover:underline">
  Mot de passe oublie ?
</Link>
```

- [ ] **Step 5: Verify pages render without errors**

Run dev server, navigate to `/forgot-password`, `/reset-password/test`, `/verify-email/test`.

Expected: Pages render correctly (reset/verify show error state for invalid token).

- [ ] **Step 6: Commit**

```bash
git add app/(auth)/
git commit -m "feat: add forgot password, reset password, and verify email pages"
```

---

## Task 7: Email verification banner

**Files:**
- Create: `components/shared/email-verification-banner.tsx`
- Modify: `app/(member)/layout.tsx` (or equivalent member layout)

- [ ] **Step 1: Create the progressive banner component**

Create `components/shared/email-verification-banner.tsx`:

- Client component, receives props: `emailVerified: boolean`, `createdAt: string`, `userEmail: string`
- Calculates hours since registration from `createdAt`
- If `emailVerified` is true: render nothing
- 0-24h: yellow banner with message + "Renvoyer" button + "Modifier mon email" link
- 24-48h: orange banner, more insistent text
- 48h+: same orange banner + modal popup on mount (dismissable, uses localStorage to track dismissal per session)
- "Renvoyer" calls `resendVerificationEmail` action, shows toast feedback
- "Modifier email" opens inline form (new email + current password), calls `changeEmailAndResend`

- [ ] **Step 2: Add banner to member layout**

In the member area layout, add the banner at the top (before main content). Read session/user data server-side, pass `emailVerified`, `createdAt`, `userEmail` as props.

- [ ] **Step 3: Test visually**

Login as a member, verify the banner appears if `emailVerified = false`.

- [ ] **Step 4: Commit**

```bash
git add components/shared/email-verification-banner.tsx app/(member)/
git commit -m "feat: add progressive email verification banner to member area"
```

---

## Task 8: Wire order emails + fix delivery address + audit logs

**Files:**
- Modify: `domains/orders/actions.ts`

- [ ] **Step 1: Update createCartOrder to persist delivery address**

In `createCartOrder` (line ~135), after creating the order, save the delivery address fields:

```typescript
deliveryPhone: deliveryAddress?.phone || null,
deliveryCommune: deliveryAddress?.commune || null,
deliveryQuartier: deliveryAddress?.quartier || null,
deliveryAvenue: deliveryAddress?.avenue || null,
deliveryRepere: deliveryAddress?.repere || null,
```

Add these to the `db.order.create({ data: { ... } })` call.

- [ ] **Step 2: Update confirmDelivery to set DELIVERED instead of COMPLETED**

Change `status: 'COMPLETED'` to `status: 'DELIVERED'` in `confirmDelivery`.
Also set `deliveredAt: new Date()`.

**Important:** After this change, search the codebase for `status === 'COMPLETED'` or `'COMPLETED'` in order-related UI code (e.g., `app/(member)/achats/page.tsx` filter logic) and update to use `'DELIVERED'` where appropriate. The achats page currently filters completed orders with `COMPLETED` — update to include both `DELIVERED` and `COMPLETED`.

- [ ] **Step 3: Update markAsShipped to set shippedAt + add audit log**

In `markAsShipped`, add `shippedAt: new Date()` to the update call.
Add `createAuditLog` call with action `ORDER_SHIPPED`.

- [ ] **Step 4: Add audit logs to createCartOrder and purchaseProduct**

Add `createAuditLog` calls with action `ORDER_CREATED` after order creation in both functions.

- [ ] **Step 5: Wire email sends**

After order creation in `createCartOrder`:
```typescript
// Non-blocking email sends
try {
  await sendOrderConfirmationBuyer(buyerEmail, buyerName, { number, items, total, currency, confirmationCode, businessName })
  await sendOrderNotificationSeller(sellerEmail, businessName, { number, buyerName, items, total, currency })
} catch (e) {
  console.error('Order email failed:', e)
}
```

After `markAsShipped`:
```typescript
try {
  await sendOrderShippedEmail(buyerEmail, buyerName, { number, businessName, confirmationCode })
} catch (e) {
  console.error('Shipped email failed:', e)
}
```

After `confirmDelivery`:
```typescript
try {
  await sendDeliveryConfirmedBuyer(buyerEmail, buyerName, { number, businessName })
  await sendDeliveryConfirmedSeller(sellerEmail, businessName, { number, buyerName })
} catch (e) {
  console.error('Delivery email failed:', e)
}
```

Note: fetch buyer/seller email from the order relations already included in the queries.

- [ ] **Step 6: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

- [ ] **Step 7: Commit**

```bash
git add domains/orders/actions.ts
git commit -m "feat: wire order emails, persist delivery address, fix DELIVERED status, add audit logs"
```

---

## Task 9: Admin KYC page

**Files:**
- Create: `app/(admin)/admin/kyc/page.tsx`
- Create: `components/admin/kyc-list.tsx`
- Create: `components/admin/kyc-detail-panel.tsx`
- Modify: `domains/kyc/queries.ts`
- Modify: `components/admin/admin-sidebar.tsx`

- [ ] **Step 1: Add KYC queries**

Add to `domains/kyc/queries.ts`:

```typescript
export async function getKycListWithFilters(status?: string, search?: string) {
  const where: any = {}
  if (status && status !== 'all') {
    where.status = status
  }
  if (search) {
    where.member = {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    }
  }
  return db.kycVerification.findMany({
    where,
    include: {
      member: {
        include: { user: { select: { email: true } } },
      },
    },
    orderBy: { submittedAt: 'desc' },
  })
}

export async function getKycCount() {
  return db.kycVerification.count({
    where: { status: 'PENDING' },
  })
}
```

- [ ] **Step 2: Create KYC list page**

Create `app/(admin)/admin/kyc/page.tsx`:

- Server component, calls `requireAdmin()`
- Fetches KYC list with `getKycListWithFilters` (default: PENDING)
- Fetches pending count with `getKycCount`
- Renders `<KycList>` client component with data

- [ ] **Step 3: Create KycList client component**

Create `components/admin/kyc-list.tsx`:

- Filter tabs: PENDING (default) | APPROVED | REJECTED | Tous
- Search input: filter by member name (debounced, updates URL search params)
- Table: Membre, Email, Tier, Date soumission, Statut, Action button
- Click row → opens `<KycDetailPanel>` Sheet
- URL search params for filter state and search query

- [ ] **Step 4: Create KycDetailPanel client component**

Create `components/admin/kyc-detail-panel.tsx`:

- shadcn Sheet component (right side, ~50% width on desktop)
- Shows: member info (name, email, tier, registration date)
- Document images: ID + selfie (full-size, click to open in new tab)
- KYC history (previous submissions)
- Traceability: reviewedBy, reviewedAt, rejectionReason (if reviewed)
- Actions: Approuver / Rejeter (rejection requires reason textarea)
- Navigation: Previous / Next buttons
- Calls existing `reviewKyc` action from `domains/kyc/actions.ts`
- On success: `router.refresh()` to update list

- [ ] **Step 5: Add KYC link to admin sidebar**

In `components/admin/admin-sidebar.tsx`, add a new nav item after "Membres":

```typescript
{ label: 'KYC', href: '/admin/kyc', icon: ShieldCheck }
```

To show the pending count badge: modify the admin layout (`app/(admin)/layout.tsx` or equivalent) to fetch `getKycCount()` server-side and pass it as a prop to `<AdminSidebar pendingKycCount={count} />`. Update `AdminSidebar` component to accept and display this prop.

- [ ] **Step 6: Test the page**

Navigate to `/admin/kyc` as admin. Verify:
- List displays with correct filters
- Panel opens on row click
- Approve/reject works
- List updates after action

- [ ] **Step 7: Commit**

```bash
git add app/(admin)/admin/kyc/ components/admin/kyc-list.tsx components/admin/kyc-detail-panel.tsx domains/kyc/queries.ts components/admin/admin-sidebar.tsx
git commit -m "feat: add admin KYC page with list, detail panel, and sidebar badge"
```

---

## Task 10: Admin boutique detail page

**Files:**
- Create: `app/(admin)/admin/annuaire/[id]/page.tsx`
- Modify: `domains/directory/queries.ts`
- Modify: `app/(admin)/admin/annuaire/page.tsx`

- [ ] **Step 1: Add getProfileWithStats query**

Add to `domains/directory/queries.ts`:

```typescript
export async function getProfileWithStats(profileId: string) {
  const profile = await db.businessProfile.findUnique({
    where: { id: profileId },
    include: {
      member: {
        include: { user: { select: { email: true, createdAt: true } } },
      },
      products: true,
      receivedOrders: {
        include: { items: true, payment: true },
      },
    },
  })

  if (!profile) return null

  const activeProducts = profile.products.filter(p => p.isActive).length
  const totalOrders = profile.receivedOrders.length
  const totalRevenue = profile.receivedOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount), 0
  )
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return {
    ...profile,
    stats: { activeProducts, totalProducts: profile.products.length, totalOrders, totalRevenue, avgOrderValue },
  }
}
```

- [ ] **Step 2: Create boutique detail page**

Create `app/(admin)/admin/annuaire/[id]/page.tsx`:

- Server component, calls `requireAdmin()`
- Fetches profile with `getProfileWithStats(id)`
- If not found: `notFound()`
- Layout sections:
  - Header: cover image, business name, category, type, owner info, status badges
  - Info grid: description, contacts, address
  - Stats: 4 KPI cards (products, orders, revenue, avg order)
  - Products table: name, price, type, stock, active status
  - Actions: Approuver / Rejeter / link to public preview `/boutique/[slug]`
- Actions call existing `approveProfile` / `rejectProfile` from `domains/directory/admin-actions.ts`

- [ ] **Step 3: Add link from annuaire list to detail**

In `app/(admin)/admin/annuaire/page.tsx`, make business name a link:

```tsx
<Link href={`/admin/annuaire/${profile.id}`} className="hover:underline font-medium">
  {profile.businessName}
</Link>
```

- [ ] **Step 4: Test the page**

Navigate to `/admin/annuaire`, click a business name. Verify detail page renders with all sections.

- [ ] **Step 5: Commit**

```bash
git add app/(admin)/admin/annuaire/ domains/directory/queries.ts
git commit -m "feat: add admin boutique detail page with stats and actions"
```

---

## Task 11: Buyer order detail page

**Files:**
- Create: `app/(member)/achats/[id]/page.tsx`
- Create: `components/orders/order-timeline.tsx`
- Create: `components/orders/confirmation-code-display.tsx`
- Modify: `domains/orders/queries.ts`
- Modify: `app/(member)/achats/page.tsx`

- [ ] **Step 1: Add getOrderForBuyer query**

Add to `domains/orders/queries.ts`:

```typescript
export async function getOrderForBuyer(orderId: string, memberId: string) {
  return db.order.findFirst({
    where: { id: orderId, memberId },
    include: {
      items: {
        include: { product: true },
      },
      payment: true,
      business: {
        select: { businessName: true, slug: true, phone: true, whatsapp: true },
      },
    },
  })
}
```

- [ ] **Step 2: Create order timeline component**

Create `components/orders/order-timeline.tsx`:

- Props: `status: string`, `createdAt: string`, `shippedAt?: string`, `deliveredAt?: string`
- Vertical timeline with 3 steps: Commande payee → Expediee → Livree
- Current step highlighted (colored), past steps checked, future steps grayed
- Each step shows date/time if available

- [ ] **Step 3: Create confirmation code display component**

Create `components/orders/confirmation-code-display.tsx`:

- Props: `code: string`, `expiresAt: string`, `status: string`
- Large monospace display of the 6-char code
- Explanation text: "Donnez ce code a la livreuse pour confirmer la reception"
- Shows expiration date
- If expired: red warning "Code expire"
- If status is DELIVERED: green "Livraison confirmee"
- Only displayed for PAID/SHIPPED status (when code is relevant)

- [ ] **Step 4: Create order detail page**

Create `app/(member)/achats/[id]/page.tsx`:

- Server component, calls `requireMember()`
- Fetches order with `getOrderForBuyer(id, member.id)` — owner check built in
- If not found: `notFound()`
- Layout:
  - Header: `CM-XXXXXXXX` order number, date, status badge
  - Articles: list with image thumbnail, name, qty, unit price, subtotal
  - Totals: subtotal, commission, total, currency
  - Confirmation code section (prominent)
  - Delivery address (if present)
  - Seller info: business name (link), WhatsApp button, phone
  - Timeline component

- [ ] **Step 5: Add link from achats list to detail**

In `app/(member)/achats/page.tsx`, make each order card a link:

```tsx
<Link href={`/achats/${order.id}`}>
```

- [ ] **Step 6: Test the page**

Login as a member with orders, navigate to `/achats`, click an order. Verify all sections render.

- [ ] **Step 7: Commit**

```bash
git add app/(member)/achats/ components/orders/ domains/orders/queries.ts
git commit -m "feat: add buyer order detail page with timeline and confirmation code"
```

---

## Task 12: Final verification + continuity

**Files:**
- Verify: all pages render without errors
- Update: `SESSION_LOG.md`, `PROJECT_STATE.md`

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`

Expected: 0 errors.

- [ ] **Step 2: Test all new pages**

Navigate to each new page and verify:
- `/forgot-password` — form renders, submission works
- `/reset-password/test-token` — shows error state for invalid token
- `/verify-email/test-token` — shows error state for invalid token
- `/admin/kyc` — list renders with filters and panel
- `/admin/annuaire/[id]` — detail page renders with stats
- `/achats/[id]` — order detail renders with timeline and code

- [ ] **Step 3: Test email verification flow**

1. Register a new member
2. Check console for verification email URL (dev mode, no Resend key)
3. Visit the URL
4. Verify emailVerified is set to true

- [ ] **Step 4: Test password reset flow**

1. Go to `/forgot-password`
2. Enter a known email
3. Check console for reset URL
4. Visit the URL, set new password
5. Login with new password

- [ ] **Step 5: Update continuity files**

Update `SESSION_LOG.md` and `PROJECT_STATE.md` with Phase 1 completion details.

- [ ] **Step 6: Final commit**

```bash
git add SESSION_LOG.md PROJECT_STATE.md
git commit -m "docs: update continuity files after Phase 1 completion"
```
