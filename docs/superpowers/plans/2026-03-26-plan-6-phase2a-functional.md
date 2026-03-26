# Phase 2A — Functional Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add onboarding checklist, remaining email templates, in-app notifications, and Cloudinary upload to replace URL text inputs.

**Architecture:** Extends existing MVP with 1 new Prisma model (Notification), a new `domains/notifications/` domain, 6 email templates in `lib/email.ts`, a reusable upload component, and onboarding UI. All follows existing patterns.

**Tech Stack:** Next.js 16, Prisma 7, Zod 4, Resend, Cloudinary (unsigned upload), Tailwind CSS 4, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-26-phase2a-functional-design.md`

---

## File Structure

### New files
```
components/member/onboarding-checklist.tsx    — Onboarding checklist (client component)
domains/notifications/actions.ts              — createNotification (internal), markAsRead, markAllAsRead
domains/notifications/queries.ts              — getNotificationsForUser, getUnreadCount
app/(member)/notifications/page.tsx           — Notifications list page
components/member/notification-list.tsx       — Notification list with filters (client)
components/shared/cloudinary-upload.tsx       — Cloudinary upload component (client)
```

### Modified files
```
prisma/schema.prisma                          — Add NotificationType enum + Notification model + User relation
lib/email.ts                                  — Add 6 new email templates
lib/constants.ts                              — Add ADMIN_EMAIL constant
domains/kyc/actions.ts                        — Wire emails + notifications in submitKyc, reviewKyc
domains/directory/admin-actions.ts            — Add reason to rejectProfile, wire emails + notifications, include member.user
domains/tickets/actions.ts                    — Wire ticket email + notification in bookEvent
domains/orders/actions.ts                     — Wire emails + notifications in purchaseProduct
app/(member)/dashboard/page.tsx               — Add onboarding checklist
app/(member)/layout.tsx                       — Fetch unread notification count, pass to sidebar
components/member/member-sidebar.tsx           — Add bell icon with unread badge, accept new prop
components/member/kyc-form.tsx                — Replace URL inputs with CloudinaryUpload
components/directory/product-form.tsx          — Replace URL textarea with CloudinaryUpload
components/directory/business-profile-form.tsx — Replace URL input with CloudinaryUpload
.env                                           — Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, ADMIN_EMAIL
```

---

## Task 1: Prisma schema — Notification model

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add NotificationType enum and Notification model**

Add after the AuditLog model at the end of schema.prisma:

```prisma
// ==================== NOTIFICATIONS ====================

enum NotificationType {
  ORDER_CREATED
  ORDER_RECEIVED
  ORDER_SHIPPED
  ORDER_DELIVERED
  KYC_APPROVED
  KYC_REJECTED
  PROFILE_APPROVED
  PROFILE_REJECTED
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  type      NotificationType
  title     String
  message   String
  link      String?
  read      Boolean          @default(false)
  deletedAt DateTime?
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  @@index([userId])
  @@index([userId, read])
}
```

Add to User model (after `emailVerificationTokens` relation):

```prisma
  notifications            Notification[]
```

- [ ] **Step 2: Run migration**

Run: `npx prisma migrate dev --name add_notification_model`

If migration fails due to DB drift, use `npx prisma db push` then create migration manually and resolve.

- [ ] **Step 3: Commit**

```bash
git add prisma/
git commit -m "feat: add Notification model with NotificationType enum

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Notifications domain

**Files:**
- Create: `domains/notifications/queries.ts`
- Create: `domains/notifications/actions.ts`

- [ ] **Step 1: Create queries**

Create `domains/notifications/queries.ts`:

```typescript
import { db } from '@/lib/db'

export async function getNotificationsForUser(userId: string, limit = 50) {
  return db.notification.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({
    where: { userId, read: false, deletedAt: null },
  })
}
```

- [ ] **Step 2: Create actions**

Create `domains/notifications/actions.ts`:

```typescript
'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth-guards'
import type { NotificationType } from '@/lib/generated/prisma/client'

// Internal helper — NOT a server action export
// Called from other actions to create notifications
export async function createNotification(input: {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
}) {
  try {
    await db.notification.create({ data: input })
  } catch (error) {
    console.error('[createNotification] Failed:', error)
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const user = await requireAuth()
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    })
    if (!notification || notification.userId !== user.id) {
      return { success: false as const, error: 'NOT_FOUND' }
    }
    await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })
    return { success: true as const, data: { id: notificationId } }
  } catch (error) {
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}

export async function markAllAsRead() {
  try {
    const user = await requireAuth()
    await db.notification.updateMany({
      where: { userId: user.id, read: false, deletedAt: null },
      data: { read: true },
    })
    return { success: true as const, data: { message: 'Toutes les notifications marquees comme lues.' } }
  } catch (error) {
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add domains/notifications/
git commit -m "feat: add notifications domain with queries and actions

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Email templates (6 new)

**Files:**
- Modify: `lib/email.ts`
- Modify: `lib/constants.ts`

- [ ] **Step 1: Add ADMIN_EMAIL constant**

In `lib/constants.ts`, add at the end:

```typescript
// Admin
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@clubm.cd'
```

- [ ] **Step 2: Add 6 new email templates to `lib/email.ts`**

Read the existing file first (407 lines, 10 existing functions). Add after the last function:

```typescript
// ---------------------------------------------------------------------------
// 11. KYC Submitted — Admin notification
// ---------------------------------------------------------------------------

export async function sendKycSubmittedAdminEmail(to: string, memberName: string) {
  await sendEmail({
    to,
    subject: `Nouvelle demande KYC : ${memberName}`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Nouvelle demande de verification</h2>
      <p><strong>${memberName}</strong> a soumis une demande de verification d'identite.</p>
      <p>Connectez-vous a l'interface admin pour examiner les documents.</p>
      ${button("Voir les demandes KYC", `${getBaseUrl()}/admin/kyc`)}
    `),
  })
}

// ---------------------------------------------------------------------------
// 12. KYC Approved
// ---------------------------------------------------------------------------

export async function sendKycApprovedEmail(to: string, prenom: string) {
  await sendEmail({
    to,
    subject: `${prenom}, votre identite est verifiee !`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Identite verifiee</h2>
      <p>Bonjour ${prenom},</p>
      <p>Votre verification d'identite a ete <strong>approuvee</strong>. Vous avez maintenant acces a toutes les fonctionnalites de Club M.</p>
      ${button("Acceder a mon espace", `${getBaseUrl()}/dashboard`)}
    `),
  })
}

// ---------------------------------------------------------------------------
// 13. KYC Rejected
// ---------------------------------------------------------------------------

export async function sendKycRejectedEmail(to: string, prenom: string, reason: string) {
  await sendEmail({
    to,
    subject: `${prenom}, verification KYC a revoir`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Verification non approuvee</h2>
      <p>Bonjour ${prenom},</p>
      <p>Votre demande de verification d'identite n'a pas ete approuvee.</p>
      <p><strong>Raison :</strong> ${reason}</p>
      <p>Vous pouvez soumettre de nouveaux documents depuis votre espace.</p>
      ${button("Resoumettre mes documents", `${getBaseUrl()}/kyc`)}
    `),
  })
}

// ---------------------------------------------------------------------------
// 14. Profile Approved
// ---------------------------------------------------------------------------

export async function sendProfileApprovedEmail(to: string, prenom: string, businessName: string) {
  await sendEmail({
    to,
    subject: `${businessName} est maintenant en ligne !`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Boutique approuvee</h2>
      <p>Bonjour ${prenom},</p>
      <p>Votre boutique <strong>${businessName}</strong> a ete approuvee et est maintenant visible dans l'annuaire Club M.</p>
      ${button("Voir ma boutique", `${getBaseUrl()}/mon-business`)}
    `),
  })
}

// ---------------------------------------------------------------------------
// 15. Profile Rejected
// ---------------------------------------------------------------------------

export async function sendProfileRejectedEmail(to: string, prenom: string, businessName: string, reason: string) {
  await sendEmail({
    to,
    subject: `${businessName} — profil non approuve`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Profil non approuve</h2>
      <p>Bonjour ${prenom},</p>
      <p>Votre boutique <strong>${businessName}</strong> n'a pas ete approuvee.</p>
      <p><strong>Raison :</strong> ${reason}</p>
      <p>Vous pouvez modifier votre profil et le resoumettre.</p>
      ${button("Modifier mon profil", `${getBaseUrl()}/mon-business`)}
    `),
  })
}

// ---------------------------------------------------------------------------
// 16. Ticket Confirmation
// ---------------------------------------------------------------------------

export async function sendTicketConfirmationEmail(
  to: string,
  prenom: string,
  event: { title: string; date: string; location: string }
) {
  await sendEmail({
    to,
    subject: `Votre billet pour ${event.title}`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Billet confirme</h2>
      <p>Bonjour ${prenom},</p>
      <p>Votre inscription a l'evenement <strong>${event.title}</strong> est confirmee.</p>
      <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Date :</strong> ${event.date}</p>
        <p style="margin: 4px 0;"><strong>Lieu :</strong> ${event.location}</p>
      </div>
      <p>Votre billet et QR code sont disponibles dans votre espace membre.</p>
      ${button("Voir mon billet", `${getBaseUrl()}/tickets`)}
    `),
  })
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add lib/email.ts lib/constants.ts
git commit -m "feat: add 6 email templates (KYC, profile, ticket)

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Wire emails + notifications into existing actions

**Files:**
- Modify: `domains/kyc/actions.ts`
- Modify: `domains/directory/admin-actions.ts`
- Modify: `domains/tickets/actions.ts`
- Modify: `domains/orders/actions.ts`

- [ ] **Step 1: Wire KYC actions**

In `domains/kyc/actions.ts`:

**In `submitKyc`** (after audit log, around line 74): add email to admin + notification:
```typescript
import { ADMIN_EMAIL } from '@/lib/constants'
import { sendKycSubmittedAdminEmail } from '@/lib/email'
import { createNotification } from '@/domains/notifications/actions'

// After audit log:
try {
  await sendKycSubmittedAdminEmail(ADMIN_EMAIL, `${member.firstName} ${member.lastName}`)
} catch (e) { console.error('KYC submitted email failed:', e) }
```

**In `reviewKyc`** (after audit log, around line 164): fetch member email, send decision email + notification:
```typescript
import { sendKycApprovedEmail, sendKycRejectedEmail } from '@/lib/email'

// Need member's user email — fetch the KYC with member.user
// The kycRecord is already fetched with member include at the top of the function.
// Add user include to the query if not present.

// After audit log:
const memberUser = await db.user.findUnique({ where: { id: kycRecord.member.userId } })
if (memberUser) {
  if (decision === 'APPROVED') {
    try { await sendKycApprovedEmail(memberUser.email, kycRecord.member.firstName) } catch {}
    await createNotification({ userId: memberUser.id, type: 'KYC_APPROVED', title: 'Identite verifiee', message: 'Votre verification d\'identite a ete approuvee.', link: '/kyc' })
  } else {
    try { await sendKycRejectedEmail(memberUser.email, kycRecord.member.firstName, rejectionReason || '') } catch {}
    await createNotification({ userId: memberUser.id, type: 'KYC_REJECTED', title: 'KYC a revoir', message: rejectionReason || 'Votre verification n\'a pas ete approuvee.', link: '/kyc' })
  }
}
```

- [ ] **Step 2: Wire directory admin actions**

In `domains/directory/admin-actions.ts`:

**Extend `rejectProfile`** to accept a reason. Change the function signature:
```typescript
export async function rejectProfile(profileId: string, reason?: string)
```

**In both `approveProfile` and `rejectProfile`**: add `include: { member: { include: { user: true } } }` to the profile fetch. After audit log, send email + notification.

```typescript
import { sendProfileApprovedEmail, sendProfileRejectedEmail } from '@/lib/email'
import { createNotification } from '@/domains/notifications/actions'

// In approveProfile, after audit log:
try { await sendProfileApprovedEmail(profile.member.user.email, profile.member.firstName, profile.businessName) } catch {}
await createNotification({ userId: profile.member.user.id, type: 'PROFILE_APPROVED', title: 'Boutique approuvee', message: `${profile.businessName} est maintenant en ligne.`, link: '/mon-business' })

// In rejectProfile, after audit log:
try { await sendProfileRejectedEmail(profile.member.user.email, profile.member.firstName, profile.businessName, reason || '') } catch {}
await createNotification({ userId: profile.member.user.id, type: 'PROFILE_REJECTED', title: 'Boutique refusee', message: reason || 'Votre boutique n\'a pas ete approuvee.', link: '/mon-business' })
```

Also update any component that calls `rejectProfile` to pass a reason (check `components/admin/profile-moderation-actions.tsx` and `components/admin/boutique-admin-actions.tsx`).

- [ ] **Step 3: Wire ticket action**

In `domains/tickets/actions.ts`, in `bookEvent` (after audit log, around line 120):

```typescript
import { sendTicketConfirmationEmail } from '@/lib/email'
import { createNotification } from '@/domains/notifications/actions'

// After audit log:
const buyerName = user.member?.firstName ?? user.customer?.firstName ?? 'Participant'
try {
  await sendTicketConfirmationEmail(user.email, buyerName, {
    title: event.title,
    date: event.startDate.toLocaleDateString('fr-FR', { dateStyle: 'long' }),
    location: event.location,
  })
} catch (e) { console.error('Ticket email failed:', e) }
```

- [ ] **Step 4: Wire purchaseProduct notifications**

In `domains/orders/actions.ts`, in `purchaseProduct` (after the transaction, before return):

Add the same email + notification pattern as `createCartOrder`. Import `sendOrderConfirmationBuyer`, `sendOrderNotificationSeller`, `formatOrderNumber`, `createNotification`. Wire:
- Email to buyer + seller
- Notification ORDER_CREATED to buyer
- Notification ORDER_RECEIVED to seller

- [ ] **Step 5: Wire order notifications in createCartOrder, markAsShipped, confirmDelivery**

These already have email sends. Add `createNotification` calls right after each email send:

- `createCartOrder`: ORDER_CREATED → buyer, ORDER_RECEIVED → seller
- `markAsShipped`: ORDER_SHIPPED → buyer
- `confirmDelivery`: ORDER_DELIVERED → buyer, ORDER_DELIVERED → seller

- [ ] **Step 6: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 7: Commit**

```bash
git add domains/kyc/actions.ts domains/directory/admin-actions.ts domains/tickets/actions.ts domains/orders/actions.ts components/admin/
git commit -m "feat: wire remaining emails and notifications into all actions

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Notifications page + sidebar badge

**Files:**
- Create: `app/(member)/notifications/page.tsx`
- Create: `components/member/notification-list.tsx`
- Modify: `components/member/member-sidebar.tsx`
- Modify: `app/(member)/layout.tsx`

- [ ] **Step 1: Create notifications page**

Create `app/(member)/notifications/page.tsx` (server component):

```typescript
import { requireAuth } from '@/lib/auth-guards'
import { getNotificationsForUser } from '@/domains/notifications/queries'
import { NotificationList } from '@/components/member/notification-list'

export default async function NotificationsPage() {
  const user = await requireAuth()
  const notifications = await getNotificationsForUser(user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <NotificationList notifications={JSON.parse(JSON.stringify(notifications))} />
    </div>
  )
}
```

- [ ] **Step 2: Create NotificationList client component**

Create `components/member/notification-list.tsx`:

- Filter tabs: Toutes | Non lues
- Each notification: icon (by type), title, message, time ago, read/unread dot
- Click → call `markAsRead(id)`, then navigate to `link`
- "Tout marquer comme lu" button → calls `markAllAsRead()`
- Empty state: "Aucune notification"
- Uses `useRouter().refresh()` after marking as read

- [ ] **Step 3: Update member sidebar**

In `components/member/member-sidebar.tsx`:

Add `unreadNotificationCount?: number` prop.
Add Bell icon (from lucide-react) with link to `/notifications`.
Show red badge with count when > 0.

- [ ] **Step 4: Update member layout**

In `app/(member)/layout.tsx`:

```typescript
import { getUnreadCount } from '@/domains/notifications/queries'

// After fetching user (around line 18):
const unreadNotificationCount = await getUnreadCount(user.id)

// Pass to MemberSidebar:
<MemberSidebar
  memberTier={user.member.tier}
  verificationStatus={user.member.verificationStatus}
  unreadNotificationCount={unreadNotificationCount}
/>
```

- [ ] **Step 5: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 6: Commit**

```bash
git add "app/(member)/notifications/" components/member/notification-list.tsx components/member/member-sidebar.tsx "app/(member)/layout.tsx"
git commit -m "feat: add notifications page and sidebar badge

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Onboarding checklist

**Files:**
- Create: `components/member/onboarding-checklist.tsx`
- Modify: `app/(member)/dashboard/page.tsx`

- [ ] **Step 1: Create onboarding checklist component**

Create `components/member/onboarding-checklist.tsx` (client component):

Props:
```typescript
interface OnboardingChecklistProps {
  emailVerified: boolean
  hasPhone: boolean
  hasAvatar: boolean
  verificationStatus: string  // DECLARED | PENDING_VERIFICATION | VERIFIED | REJECTED
}
```

- `'use client'` directive
- 4 steps with status derived from props:
  1. Verifier email → emailVerified
  2. Completer profil → hasPhone && hasAvatar
  3. Soumettre KYC → verificationStatus !== 'DECLARED'
  4. Explorer marketplace → always a link, no completion check
- Progress bar: "X/3 etapes completees" (step 4 doesn't count)
- "Masquer" button → `localStorage.setItem('onboarding-dismissed', 'true')`
- On mount: check localStorage, if dismissed, render null
- Card component with green/gray step indicators
- Each step has action link (Button variant="outline")

- [ ] **Step 2: Add to dashboard page**

In `app/(member)/dashboard/page.tsx`:

Read the file first. After fetching profile data, add the checklist at the top:

```tsx
import { OnboardingChecklist } from '@/components/member/onboarding-checklist'

// In the return, before the existing dashboard component:
<OnboardingChecklist
  emailVerified={user.emailVerified}
  hasPhone={!!profile.phone}
  hasAvatar={!!profile.avatar}
  verificationStatus={profile.verificationStatus}
/>
```

Note: the page needs access to `user` (for emailVerified). Check if the page already fetches user data or only profile. If needed, add the user fetch.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add components/member/onboarding-checklist.tsx "app/(member)/dashboard/page.tsx"
git commit -m "feat: add onboarding checklist to member dashboard

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Cloudinary upload component

**Files:**
- Create: `components/shared/cloudinary-upload.tsx`
- Modify: `.env`

- [ ] **Step 1: Add env variables**

In `.env`, add:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="ddejrfzlr"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="clubm_uploads"
ADMIN_EMAIL="admin@clubm.cd"
```

Note: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` uses same value as existing `CLOUDINARY_CLOUD_NAME`.

- [ ] **Step 2: Create CloudinaryUpload component**

Create `components/shared/cloudinary-upload.tsx` (client component):

```typescript
'use client'

interface CloudinaryUploadProps {
  folder: string
  onUpload: (urls: string[]) => void
  currentImage?: string
  currentImages?: string[]
  multiple?: boolean
  maxSizeMB?: number
  accept?: string[]
}
```

Features:
- Drop zone with dashed border, "Glisser ou cliquer pour ajouter"
- File input (hidden), triggered by click on drop zone
- Drag & drop support (onDragOver, onDrop)
- Client-side validation: file type (jpg/png/webp), file size (default 5MB)
- Upload via `fetch` POST to `https://api.cloudinary.com/v1_1/${cloudName}/image/upload` with FormData (file, upload_preset, folder)
- Progress tracking via XMLHttpRequest (for progress bar)
- Preview: show current image(s) with remove button
- Loading state with progress bar
- Error messages (file too large, wrong type, upload failed)
- Single mode: call `onUpload([url])` after upload
- Multiple mode: accumulate URLs, call `onUpload(allUrls)` after each upload

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add components/shared/cloudinary-upload.tsx .env
git commit -m "feat: add Cloudinary upload component with drag & drop

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Replace URL inputs with CloudinaryUpload

**Files:**
- Modify: `components/member/kyc-form.tsx`
- Modify: `components/directory/product-form.tsx`
- Modify: `components/directory/business-profile-form.tsx`

- [ ] **Step 1: Replace KYC form URL inputs**

In `components/member/kyc-form.tsx`:
- Replace `idDocumentUrl` text input (line ~68) with `<CloudinaryUpload folder="kyc" onUpload={...} currentImage={idDocumentUrl} />`
- Replace `selfieUrl` text input (line ~83) with `<CloudinaryUpload folder="kyc" onUpload={...} currentImage={selfieUrl} />`
- Update state management to use callback from CloudinaryUpload

- [ ] **Step 2: Replace product form image input**

In `components/directory/product-form.tsx`:
- Replace the textarea for comma-separated URLs (lines 227-243) with `<CloudinaryUpload folder="products" multiple onUpload={...} currentImages={images} />`
- Update state to handle array of URLs from the component

- [ ] **Step 3: Replace business profile cover image input**

In `components/directory/business-profile-form.tsx`:
- Replace the URL input for coverImage (lines 132-144) with `<CloudinaryUpload folder="business" onUpload={...} currentImage={coverImage} />`

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Test visually**

Start dev server, navigate to KYC form, product form, business profile form. Verify:
- Drop zone renders
- File selection works
- Preview shows after upload
- URL is captured in form state

- [ ] **Step 6: Commit**

```bash
git add components/member/kyc-form.tsx components/directory/product-form.tsx components/directory/business-profile-form.tsx
git commit -m "feat: replace URL text inputs with Cloudinary upload component

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Final verification

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit --skipLibCheck`

Expected: 0 errors.

- [ ] **Step 2: Test all new features**

- `/dashboard` — onboarding checklist visible for incomplete profiles
- `/notifications` — page renders (empty or with notifications)
- Sidebar — bell icon visible
- KYC form — upload component instead of URL input
- Product form — upload component instead of textarea
- Business profile — upload component instead of URL input

- [ ] **Step 3: Update continuity files**

Update `SESSION_LOG.md` and `PROJECT_STATE.md` with Phase 2A completion.

- [ ] **Step 4: Commit**

```bash
git add SESSION_LOG.md PROJECT_STATE.md
git commit -m "docs: update continuity files after Phase 2A completion

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
