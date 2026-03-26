# Phase 2A — Functional Features Design Spec

**Date** : 2026-03-26
**Status** : Validated
**Scope** : 4 chantiers fonctionnels (onboarding, emails, notifications, upload)

---

## Overview

Phase 2A adds functional features that improve UX and trust: onboarding guidance, complete email coverage, in-app notifications, and file upload. These are independent of the design/responsive work (Phase 2B).

**Estimated effort** : ~6 days
**Dependencies** : Phase 1 complete (auth + email system operational)

---

## Chantier 7 — Onboarding Checklist

### Problem
New members land on a dashboard with no guidance. They don't know what steps to take (verify email, complete profile, submit KYC).

### Solution

**Component `<OnboardingChecklist />`** displayed in the member dashboard:

**Steps:**
1. **Verifier son email** — check `user.emailVerified` — link to resend from banner
2. **Completer son profil** — check `member.phone` AND `member.avatar` are set — link to `/profil`
3. **Soumettre KYC** — check `member.verificationStatus !== 'DECLARED'` — link to `/kyc`
4. **Explorer la marketplace** — always available — link to `/marketplace`

**Behavior:**
- Each step shows: icon, label, action link, status badge (fait/a faire)
- Completed steps show green checkmark, pending show gray circle
- Progress indicator: "2/4 etapes completees"
- Disappears when all steps are completed OR user clicks "Masquer" (flag stored in localStorage key `onboarding-dismissed`)
- Server component, reads member data from dashboard page props

**Files:**
- `components/member/onboarding-checklist.tsx` — the checklist component
- `app/(member)/dashboard/page.tsx` — add checklist at top of dashboard

---

## Chantier 8 — Remaining Emails (6 templates)

### Problem
Only order-related and auth emails are sent. KYC decisions, profile approvals, upgrade completions, and event tickets have no email notification.

### Solution

**6 new email templates in `lib/email.ts`:**

| # | Template | Trigger action | Recipient |
|---|----------|---------------|-----------|
| 1 | `sendKycSubmittedAdminEmail(to, memberName)` | `submitKyc` | Admin (ADMIN_EMAIL env var, default admin@clubm.cd) |
| 2 | `sendKycApprovedEmail(to, prenom)` | `reviewKyc` (APPROVED) | Member |
| 3 | `sendKycRejectedEmail(to, prenom, reason)` | `reviewKyc` (REJECTED) | Member |
| 4 | `sendProfileApprovedEmail(to, prenom, businessName)` | `approveProfile` | Business member |
| 5 | `sendProfileRejectedEmail(to, prenom, businessName)` | `rejectProfile` | Business member |
| 6 | `sendTicketConfirmationEmail(to, prenom, event)` | ticket purchase action | Participant |

Note: `sendVerificationApprovedEmail` and `sendVerificationPendingEmail` already exist in `lib/email.ts` (from MVP). The KYC approved/rejected emails (templates 2-3) are NEW templates specifically for KYC review decisions, distinct from the existing verification templates.

**Wiring pattern:** Same as Phase 1 — add email send call inside existing action try/catch, after the main DB operation. Email failure never blocks the action.

**Configuration:**
- `ADMIN_EMAIL` in `.env` (default: `admin@clubm.cd`) — receives admin notification emails
- Uses existing `sendEmail` helper with retry logic

**Files to modify:**
- `lib/email.ts` — add 6 templates
- `domains/kyc/actions.ts` — wire emails in `submitKyc` and `reviewKyc`
- `domains/directory/admin-actions.ts` — wire emails in `approveProfile` and `rejectProfile`
- `domains/upgrade/actions.ts` — wire email in upgrade completion
- `domains/tickets/actions.ts` — wire email in ticket purchase

---

## Chantier 9 — In-App Notifications

### Problem
Users have no way to track events (order updates, KYC decisions, profile approvals) without checking each page individually.

### Solution

**New Prisma model:**
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String
  title     String
  message   String
  link      String?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([userId, read])
}
```

Add relation to User model: `notifications Notification[]`

**New domain `domains/notifications/`:**

`actions.ts`:
- `createNotification(input: { userId, type, title, message, link? })` — creates notification in DB
- `markAsRead(notificationId)` — sets read = true, with ownership check
- `markAllAsRead()` — marks all user's notifications as read (requireAuth)

`queries.ts`:
- `getNotificationsForUser(userId, limit = 50)` — ordered by createdAt desc
- `getUnreadCount(userId)` — count where read = false

**Page `/notifications`:**
- Server component, requires auth
- Filter tabs: Toutes | Non lues
- List: each notification shows icon (by type), title, message, time ago, read/unread indicator
- Click → navigates to `link` and marks as read
- "Tout marquer comme lu" button
- Empty state: "Aucune notification"

**Navbar badge:**
- Bell icon with red badge showing unread count
- Displayed in member sidebar/navbar
- Count fetched server-side on each navigation (no real-time)
- Badge hidden when count = 0

**Notification triggers** (called from existing actions, after email send):

| Event | Type | Recipient | Title | Link |
|-------|------|-----------|-------|------|
| Order created | ORDER_CREATED | Buyer | "Commande confirmee" | /achats/{id} |
| Order created | ORDER_RECEIVED | Seller | "Nouvelle commande" | /mon-business/commandes/{id} |
| Order shipped | ORDER_SHIPPED | Buyer | "Commande expediee" | /achats/{id} |
| Delivery confirmed | ORDER_DELIVERED | Buyer | "Livraison confirmee" | /achats/{id} |
| Delivery confirmed | ORDER_DELIVERED | Seller | "Livraison confirmee" | /mon-business/commandes/{id} |
| KYC approved | KYC_APPROVED | Member | "Identite verifiee" | /kyc |
| KYC rejected | KYC_REJECTED | Member | "KYC a revoir" | /kyc |
| Profile approved | PROFILE_APPROVED | Member | "Boutique approuvee" | /mon-business |
| Profile rejected | PROFILE_REJECTED | Member | "Boutique refusee" | /mon-business |

**Files:**
- `prisma/schema.prisma` — add Notification model + User relation
- `domains/notifications/actions.ts` — createNotification, markAsRead, markAllAsRead
- `domains/notifications/queries.ts` — getNotificationsForUser, getUnreadCount
- `app/(member)/notifications/page.tsx` — notifications page
- `components/member/notification-list.tsx` — list component (client)
- `components/member/member-sidebar.tsx` — add bell icon with badge
- `domains/orders/actions.ts` — add notification calls
- `domains/kyc/actions.ts` — add notification calls
- `domains/directory/admin-actions.ts` — add notification calls

---

## Chantier 10 — Cloudinary Upload Component

### Problem
All image inputs in the app are plain text URL fields. Users must manually find/paste Cloudinary URLs, which is impractical.

### Solution

**Component `<CloudinaryUpload />`** (client component):

Props:
```typescript
interface CloudinaryUploadProps {
  folder: string              // Cloudinary folder (e.g., 'avatars', 'products')
  onUpload: (url: string) => void   // callback with secure URL
  currentImage?: string       // existing image URL for preview
  multiple?: boolean          // allow multiple files (default false)
  onMultiUpload?: (urls: string[]) => void  // callback for multiple uploads
  maxSizeMB?: number          // max file size (default 5)
  accept?: string[]           // accepted types (default ['jpg','png','webp'])
}
```

UI:
- Drop zone with dashed border + "Glisser ou cliquer pour ajouter"
- Click opens file browser
- Preview of current image (if set)
- Progress bar during upload
- Remove button on preview
- Error messages (file too large, wrong type)

Upload mechanism:
- Direct upload to Cloudinary via unsigned preset (no server proxy)
- Uses `fetch` to POST to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`
- Requires unsigned upload preset configured in Cloudinary dashboard

Configuration:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — already in `.env`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — NEW, add to `.env` (value: `clubm_uploads`)
- Create the unsigned preset `clubm_uploads` in Cloudinary dashboard

**Replace URL inputs in:**

| Form | File | Field(s) |
|------|------|----------|
| Member profile | `app/(member)/profil/page.tsx` or equivalent | avatar |
| KYC submission | `app/(member)/kyc/page.tsx` or equivalent | idDocumentUrl, selfieUrl |
| Product form | `components/directory/product-form.tsx` | images |
| Business profile | business profile form | coverImage |

**Files:**
- `components/shared/cloudinary-upload.tsx` — the upload component
- `.env` — add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
- Form files listed above — replace Input with CloudinaryUpload

---

## Cross-cutting concerns

### Prisma migration
- Single migration for Notification model + User relation

### Patterns to follow
- All new server actions: return-value pattern, try/catch, audit log
- Email sends: non-blocking, try/catch, uses sendEmail helper
- Notifications: created alongside email sends (both are non-blocking)
- Guards: requireAuth/requireMember at start of every action
- French URLs: `/notifications`
- Prisma imports from `@/lib/generated/prisma/client`
