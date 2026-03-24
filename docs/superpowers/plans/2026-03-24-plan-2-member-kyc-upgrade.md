# Plan 2 — Member Space + KYC + Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete member experience — dashboard with role-aware content, profile editing, KYC submission/review, upgrade flow with resumable state machine, and minimal admin for member management and KYC validation.

**Architecture:** Server Components for data-heavy pages, Client Components for forms. Server Actions with return-value pattern for all mutations. Guards in every action. Domains for KYC, upgrade, and profile logic. Admin minimal introduced for KYC validation.

**Tech Stack:** Next.js 16, Prisma 7 (adapter-pg), Auth.js v5, Zod 4, shadcn/ui, Cloudinary, Resend

**Spec:** `docs/superpowers/specs/2026-03-23-club-m-platform-design.md`

**Prerequisite:** Plan 1 (Foundation) completed.

---

## Important Codebase Notes

**Import rules:**
- Prisma types: `from '@/lib/generated/prisma/client'`
- DB: `import { db } from '@/lib/db'`
- Auth: `import { auth } from '@/lib/auth'`
- Guards: `from '@/lib/auth-guards'`
- Errors: `from '@/lib/errors'`
- Constants: `from '@/lib/constants'`
- Utils: `from '@/lib/utils'`

**Server Actions** must use return-value pattern:
```typescript
type ActionResult<T> = { success: true; data: T } | { success: false; error: string; details?: Record<string, string[]> }
```

**URL convention:** The sidebar already uses French URLs (`/profil`, `/achats`, `/mon-business`). All new pages must match these paths. Protected routes in `lib/routes.ts` must be updated to match.

**Existing shadcn components:** accordion, avatar, button, card, carousel, chart, checkbox, dialog, dropdown-menu, input, label, pagination, popover, select, sheet, sonner, spinner, switch, tabs, textarea

**Admin routes:** Admin pages live at `app/(admin)/admin/` to produce `/admin/*` URLs.

---

## File Structure

### Files to create

```
domains/members/profile-actions.ts     — updateProfile, updatePassword server actions
domains/members/profile-validators.ts  — Zod schemas for profile update
domains/members/profile-queries.ts     — getMemberProfile, getMemberStats

domains/kyc/types.ts                   — KYC-related types
domains/kyc/validators.ts              — Zod schemas for KYC submission
domains/kyc/actions.ts                 — submitKyc, reviewKyc server actions
domains/kyc/queries.ts                 — getKycByMemberId, getPendingKycList

domains/upgrade/types.ts               — Upgrade-related types
domains/upgrade/validators.ts          — Zod schemas for upgrade
domains/upgrade/actions.ts             — createUpgradeRequest, completeUpgrade server actions
domains/upgrade/queries.ts             — getActiveUpgradeRequest, getUpgradeHistory

app/(member)/profil/page.tsx           — Profile view + edit page
app/(member)/dashboard/page.tsx        — Rewrite: role-aware dashboard with KPIs
app/(member)/upgrade/page.tsx          — Upgrade selection page
app/(member)/kyc/page.tsx              — KYC submission page

app/(admin)/admin/members/page.tsx     — Members list with filters
app/(admin)/admin/members/[id]/page.tsx — Member detail + KYC review

components/member/dashboard-free.tsx     — Free member dashboard content
components/member/dashboard-premium.tsx  — Premium member dashboard content
components/member/dashboard-business.tsx — Business member dashboard content
components/member/profile-form.tsx       — Profile edit form
components/member/password-form.tsx      — Password change form
components/member/kyc-form.tsx           — KYC document upload form
components/member/kyc-status.tsx         — KYC status display
components/member/upgrade-card.tsx       — Upgrade offer card
components/admin/members-table.tsx       — Admin members table with filters
components/admin/kyc-review.tsx          — Admin KYC review panel
```

### Files to modify

```
lib/routes.ts                          — Fix protected routes to use French URLs
components/member/member-sidebar.tsx   — Add upgrade link, KYC badge
```

---

## Task 1: Fix Route Protection URLs

**Files:**
- Modify: `lib/routes.ts`

The sidebar uses French URLs but routes.ts protects English ones. Fix this mismatch.

- [ ] **Step 1: Update routes.ts to match actual sidebar URLs**

```typescript
// lib/routes.ts
export const PROTECTED_ROUTES = {
  member: ['/dashboard', '/profil', '/tickets', '/achats', '/mon-business', '/upgrade', '/evenements', '/annuaire', '/kyc'],
  admin: ['/admin'],
  auth: ['/login', '/register', '/verify-email'],
} as const
```

Note: `/kyc` moves from `auth` to `member` because KYC requires authentication.

- [ ] **Step 2: Verify middleware still works**

```bash
rm -rf .next && npx next dev --webpack -p 3008 &
sleep 15
curl -sL -o /dev/null -w "%{http_code}" http://localhost:3008/profil  # Should redirect to /login
kill %1
```

- [ ] **Step 3: Commit**

```bash
git add lib/routes.ts
git commit -m "fix: align protected routes with French sidebar URLs"
```

---

## Task 2: Member Profile Domain

**Files:**
- Create: `domains/members/profile-validators.ts`
- Create: `domains/members/profile-actions.ts`
- Create: `domains/members/profile-queries.ts`

- [ ] **Step 1: Create profile validators**

```typescript
// domains/members/profile-validators.ts
import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'Prenom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio trop longue').optional(),
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} caracteres`),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})
```

Note: Check Zod 4 API for `.refine()` — it should work the same as Zod 3.

- [ ] **Step 2: Create profile queries**

```typescript
// domains/members/profile-queries.ts
import { db } from '@/lib/db'

export async function getMemberProfile(userId: string) {
  return db.member.findUnique({
    where: { userId },
    include: {
      user: { select: { email: true, emailVerified: true } },
      businessProfile: { select: { businessName: true, profileType: true, isApproved: true } },
      kycVerifications: { orderBy: { submittedAt: 'desc' }, take: 1 },
      subscriptions: { where: { status: 'ACTIVE' }, take: 1 },
    },
  })
}

export async function getMemberStats(memberId: string) {
  const [orderCount, ticketCount] = await Promise.all([
    db.order.count({ where: { memberId } }),
    db.ticket.count({ where: { memberId, status: 'PAID' } }),
  ])
  return { orderCount, ticketCount }
}
```

- [ ] **Step 3: Create profile actions**

```typescript
// domains/members/profile-actions.ts
'use server'

import type { z } from 'zod'
import { hash, compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { updateProfileSchema, updatePasswordSchema } from './profile-validators'
import { createAuditLog } from '@/domains/audit/actions'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

function flattenErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_root')
    if (!result[key]) result[key] = []
    result[key].push(issue.message)
  }
  return result
}

export async function updateProfile(input: unknown): Promise<ActionResult<{ memberId: string }>> {
  const { member } = await requireMember()

  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }
  }

  await db.member.update({
    where: { id: member.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone ?? null,
      bio: parsed.data.bio ?? null,
    },
  })

  return { success: true, data: { memberId: member.id } }
}

export async function updatePassword(input: unknown): Promise<ActionResult<null>> {
  const { user, member } = await requireMember()

  const parsed = updatePasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }
  }

  const { currentPassword, newPassword } = parsed.data

  const currentUser = await db.user.findUnique({ where: { id: user.id } })
  if (!currentUser) return { success: false, error: 'NOT_FOUND' }

  const isValid = await compare(currentPassword, currentUser.passwordHash)
  if (!isValid) {
    return { success: false, error: 'INVALID_PASSWORD', details: { currentPassword: ['Mot de passe incorrect'] } }
  }

  const newHash = await hash(newPassword, 12)
  await db.user.update({ where: { id: user.id }, data: { passwordHash: newHash } })

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'member.change_password',
    entity: 'User',
    entityId: user.id,
  })

  return { success: true, data: null }
}

export async function updateAvatar(memberId: string, avatarUrl: string): Promise<ActionResult<null>> {
  const { member } = await requireMember()
  if (member.id !== memberId) return { success: false, error: 'NOT_OWNER' }

  await db.member.update({ where: { id: memberId }, data: { avatar: avatarUrl } })
  return { success: true, data: null }
}
```

- [ ] **Step 4: Verify compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add domains/members/profile-*.ts
git commit -m "feat: add member profile domain — validators, queries, actions"
```

---

## Task 3: KYC Domain

**Files:**
- Create: `domains/kyc/types.ts`, `domains/kyc/validators.ts`, `domains/kyc/queries.ts`, `domains/kyc/actions.ts`

- [ ] **Step 1: Create KYC types**

```typescript
// domains/kyc/types.ts
import type { KycVerification, Member, User } from '@/lib/generated/prisma/client'

export type KycWithMember = KycVerification & {
  member: Member & { user: { email: string } }
}

export type KycSubmissionInput = {
  idDocumentUrl: string
  selfieUrl: string
}
```

- [ ] **Step 2: Create KYC validators**

```typescript
// domains/kyc/validators.ts
import { z } from 'zod'

export const submitKycSchema = z.object({
  idDocumentUrl: z.string().url('URL de document invalide'),
  selfieUrl: z.string().url('URL de selfie invalide'),
})

export const reviewKycSchema = z.object({
  kycId: z.string().min(1),
  decision: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional(),
})
```

- [ ] **Step 3: Create KYC queries**

```typescript
// domains/kyc/queries.ts
import { db } from '@/lib/db'
import type { KycStatus } from '@/lib/generated/prisma/client'

export async function getLatestKycForMember(memberId: string) {
  return db.kycVerification.findFirst({
    where: { memberId },
    orderBy: { submittedAt: 'desc' },
  })
}

export async function getKycById(kycId: string) {
  return db.kycVerification.findUnique({
    where: { id: kycId },
    include: { member: { include: { user: { select: { email: true } } } } },
  })
}

export async function getPendingKycList() {
  return db.kycVerification.findMany({
    where: { status: 'PENDING' },
    include: { member: { include: { user: { select: { email: true } } } } },
    orderBy: { submittedAt: 'asc' },
  })
}

export async function getKycListFiltered(status?: KycStatus) {
  return db.kycVerification.findMany({
    where: status ? { status } : undefined,
    include: { member: { include: { user: { select: { email: true } } } } },
    orderBy: { submittedAt: 'desc' },
    take: 50,
  })
}
```

- [ ] **Step 4: Create KYC actions**

```typescript
// domains/kyc/actions.ts
'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember, requireAdmin } from '@/lib/auth-guards'
import { BusinessError } from '@/lib/errors'
import { submitKycSchema, reviewKycSchema } from './validators'
import { getLatestKycForMember } from './queries'
import { createAuditLog } from '@/domains/audit/actions'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> }

function flattenErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_root')
    if (!result[key]) result[key] = []
    result[key].push(issue.message)
  }
  return result
}

export async function submitKyc(input: unknown): Promise<ActionResult<{ kycId: string }>> {
  const { user, member } = await requireMember()

  // Check no pending KYC
  const latestKyc = await getLatestKycForMember(member.id)
  if (latestKyc && latestKyc.status === 'PENDING') {
    return { success: false, error: 'KYC_ALREADY_PENDING' }
  }

  const parsed = submitKycSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }
  }

  const kyc = await db.kycVerification.create({
    data: {
      memberId: member.id,
      idDocumentUrl: parsed.data.idDocumentUrl,
      selfieUrl: parsed.data.selfieUrl,
      status: 'PENDING',
      provider: 'manual',
    },
  })

  // Update member verification status
  await db.member.update({
    where: { id: member.id },
    data: { verificationStatus: 'PENDING_VERIFICATION' },
  })

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'kyc.submit',
    entity: 'KycVerification',
    entityId: kyc.id,
  })

  return { success: true, data: { kycId: kyc.id } }
}

export async function reviewKyc(input: unknown): Promise<ActionResult<{ kycId: string }>> {
  const { user, admin } = await requireAdmin()

  const parsed = reviewKycSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }
  }

  const { kycId, decision, rejectionReason } = parsed.data

  const kyc = await db.kycVerification.findUnique({
    where: { id: kycId },
    include: { member: true },
  })

  if (!kyc) return { success: false, error: 'RESOURCE_NOT_FOUND' }
  if (kyc.status !== 'PENDING' && kyc.status !== 'MANUAL_REVIEW') {
    return { success: false, error: 'KYC_ALREADY_REVIEWED' }
  }

  // Update KYC record
  await db.kycVerification.update({
    where: { id: kycId },
    data: {
      status: decision,
      rejectionReason: decision === 'REJECTED' ? rejectionReason : null,
      reviewedBy: user.id,
      reviewedAt: new Date(),
    },
  })

  // Update member verification status
  const newVerificationStatus = decision === 'APPROVED' ? 'VERIFIED' : 'REJECTED'
  await db.member.update({
    where: { id: kyc.memberId },
    data: { verificationStatus: newVerificationStatus },
  })

  // If approved and there's a pending upgrade, advance it
  if (decision === 'APPROVED') {
    const pendingUpgrade = await db.upgradeRequest.findFirst({
      where: { memberId: kyc.memberId, status: 'KYC_PENDING' },
    })
    if (pendingUpgrade) {
      await db.upgradeRequest.update({
        where: { id: pendingUpgrade.id },
        data: { status: 'READY_FOR_PAYMENT' },
      })
    }
  } else {
    // If rejected, mark pending upgrades as KYC_REJECTED
    await db.upgradeRequest.updateMany({
      where: { memberId: kyc.memberId, status: 'KYC_PENDING' },
      data: { status: 'KYC_REJECTED' },
    })
  }

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: `kyc.${decision.toLowerCase()}`,
    entity: 'KycVerification',
    entityId: kycId,
    details: { memberId: kyc.memberId, rejectionReason },
  })

  return { success: true, data: { kycId } }
}
```

- [ ] **Step 5: Commit**

```bash
git add domains/kyc/
git commit -m "feat: add KYC domain — submission, admin review, audit logging"
```

---

## Task 4: Upgrade Domain

**Files:**
- Create: `domains/upgrade/types.ts`, `domains/upgrade/validators.ts`, `domains/upgrade/queries.ts`, `domains/upgrade/actions.ts`

- [ ] **Step 1: Create upgrade types**

```typescript
// domains/upgrade/types.ts
import type { UpgradeRequest, UpgradeStatus, MemberTier } from '@/lib/generated/prisma/client'

export type UpgradeRequestWithDetails = UpgradeRequest & {
  subscription: { id: string; tier: string; status: string } | null
}

// The upgrade flow state machine:
// KYC_PENDING → (KYC approved) → READY_FOR_PAYMENT → PAYMENT_PENDING → UPGRADE_COMPLETED
//            → (KYC rejected) → KYC_REJECTED → (resubmit KYC) → KYC_PENDING
// Any state → CANCELLED
```

- [ ] **Step 2: Create upgrade validators**

```typescript
// domains/upgrade/validators.ts
import { z } from 'zod'

export const createUpgradeSchema = z.object({
  targetTier: z.enum(['PREMIUM', 'BUSINESS']),
})
```

- [ ] **Step 3: Create upgrade queries**

```typescript
// domains/upgrade/queries.ts
import { db } from '@/lib/db'

export async function getActiveUpgradeRequest(memberId: string) {
  return db.upgradeRequest.findFirst({
    where: {
      memberId,
      status: { in: ['KYC_PENDING', 'KYC_REJECTED', 'READY_FOR_PAYMENT', 'PAYMENT_PENDING'] },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUpgradeHistory(memberId: string) {
  return db.upgradeRequest.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
}
```

- [ ] **Step 4: Create upgrade actions**

```typescript
// domains/upgrade/actions.ts
'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { createUpgradeSchema } from './validators'
import { getActiveUpgradeRequest } from './queries'
import { createAuditLog } from '@/domains/audit/actions'
import { hasMinTier } from '@/lib/permissions'
import type { MemberTier } from '@/lib/generated/prisma/client'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createUpgradeRequest(input: unknown): Promise<ActionResult<{ upgradeId: string; nextStep: string }>> {
  const { user, member } = await requireMember()

  const parsed = createUpgradeSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT' }
  }

  const { targetTier } = parsed.data

  // Validate upgrade is actually an upgrade
  if (hasMinTier(member.tier, targetTier as MemberTier)) {
    return { success: false, error: 'ALREADY_AT_TIER' }
  }

  // Check no active upgrade in progress
  const existing = await getActiveUpgradeRequest(member.id)
  if (existing) {
    return { success: false, error: 'UPGRADE_IN_PROGRESS' }
  }

  // Determine initial status based on KYC
  const needsKyc = member.verificationStatus !== 'VERIFIED'
  const initialStatus = needsKyc ? 'KYC_PENDING' : 'READY_FOR_PAYMENT'

  const upgrade = await db.upgradeRequest.create({
    data: {
      memberId: member.id,
      fromTier: member.tier,
      toTier: targetTier as MemberTier,
      status: initialStatus,
    },
  })

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'upgrade.request',
    entity: 'UpgradeRequest',
    entityId: upgrade.id,
    details: { fromTier: member.tier, toTier: targetTier, initialStatus },
  })

  const nextStep = needsKyc ? '/kyc' : '/upgrade/payment'
  return { success: true, data: { upgradeId: upgrade.id, nextStep } }
}

export async function cancelUpgradeRequest(upgradeId: string): Promise<ActionResult<null>> {
  const { user, member } = await requireMember()

  const upgrade = await db.upgradeRequest.findUnique({ where: { id: upgradeId } })
  if (!upgrade) return { success: false, error: 'RESOURCE_NOT_FOUND' }
  if (upgrade.memberId !== member.id) return { success: false, error: 'NOT_OWNER' }
  if (upgrade.status === 'UPGRADE_COMPLETED' || upgrade.status === 'CANCELLED') {
    return { success: false, error: 'CANNOT_CANCEL' }
  }

  await db.upgradeRequest.update({
    where: { id: upgradeId },
    data: { status: 'CANCELLED' },
  })

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'upgrade.cancel',
    entity: 'UpgradeRequest',
    entityId: upgradeId,
  })

  return { success: true, data: null }
}
```

- [ ] **Step 5: Commit**

```bash
git add domains/upgrade/
git commit -m "feat: add upgrade domain — state machine, request creation, cancellation"
```

---

## Task 5: Member Dashboard (Role-Aware)

**Files:**
- Modify: `app/(member)/dashboard/page.tsx`
- Create: `components/member/dashboard-free.tsx`
- Create: `components/member/dashboard-premium.tsx`
- Create: `components/member/dashboard-business.tsx`

- [ ] **Step 1: Create tier-specific dashboard components**

Each component receives the member data and displays appropriate content.

`components/member/dashboard-free.tsx`:
- Welcome message
- Tier badge (Free)
- Verification status
- CTA to upgrade to Premium/Business
- Quick stats (tickets, achats)

`components/member/dashboard-premium.tsx`:
- Welcome + Premium badge
- Verification status (VERIFIED badge)
- Business profile info (SHOWCASE)
- Quick stats
- CTA to upgrade to Business

`components/member/dashboard-business.tsx`:
- Welcome + Business badge
- Verified badge
- Business dashboard summary (link to /mon-business)
- Quick stats (orders received, revenue)
- Recent activity

All components are Server Components. Use Card, Button from shadcn/ui. Show `TIER_LABELS` from constants.

- [ ] **Step 2: Rewrite dashboard page**

```tsx
// app/(member)/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile, getMemberStats } from '@/domains/members/profile-queries'
import { DashboardFree } from '@/components/member/dashboard-free'
import { DashboardPremium } from '@/components/member/dashboard-premium'
import { DashboardBusiness } from '@/components/member/dashboard-business'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  const stats = await getMemberStats(profile.id)

  switch (profile.tier) {
    case 'BUSINESS':
      return <DashboardBusiness profile={profile} stats={stats} />
    case 'PREMIUM':
      return <DashboardPremium profile={profile} stats={stats} />
    default:
      return <DashboardFree profile={profile} stats={stats} />
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(member)/dashboard/ components/member/dashboard-*.tsx
git commit -m "feat: add role-aware member dashboard with tier-specific content"
```

---

## Task 6: Profile Page

**Files:**
- Create: `app/(member)/profil/page.tsx`
- Create: `components/member/profile-form.tsx`
- Create: `components/member/password-form.tsx`

- [ ] **Step 1: Create profile form component**

Client component with:
- Fields: firstName, lastName, phone, bio
- Pre-filled with current values
- Calls `updateProfile` server action
- Shows field errors from result
- Toast on success

- [ ] **Step 2: Create password form component**

Client component with:
- Fields: currentPassword, newPassword, confirmPassword
- Calls `updatePassword` server action
- Shows field errors
- Toast on success

- [ ] **Step 3: Create profile page**

Server component that:
- Loads member profile via `getMemberProfile`
- Shows member info (email, tier, verification status)
- Renders ProfileForm and PasswordForm in tabs
- Shows avatar (with upload capability via Cloudinary — stretch goal, can show placeholder)

```tsx
// app/(member)/profil/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile } from '@/domains/members/profile-queries'
import { ProfileForm } from '@/components/member/profile-form'
import { PasswordForm } from '@/components/member/password-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TIER_LABELS } from '@/lib/constants'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-muted-foreground">
          {profile.user.email} — Membre {TIER_LABELS[profile.tier]}
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Informations</TabsTrigger>
          <TabsTrigger value="password">Mot de passe</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Modifiez vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                defaultValues={{
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  phone: profile.phone ?? '',
                  bio: profile.bio ?? '',
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/(member)/profil/ components/member/profile-form.tsx components/member/password-form.tsx
git commit -m "feat: add member profile page with edit and password change"
```

---

## Task 7: KYC Submission Page

**Files:**
- Create: `app/(member)/kyc/page.tsx`
- Create: `components/member/kyc-form.tsx`
- Create: `components/member/kyc-status.tsx`

- [ ] **Step 1: Create KYC status component**

Shows the current KYC status with appropriate messaging:
- DECLARED: "Votre profil n'est pas encore verifie"
- PENDING_VERIFICATION: "Verification en cours, nous reviendrons vers vous"
- VERIFIED: "Profil verifie" with green badge
- REJECTED: "Verification refusee" with reason + option to resubmit

- [ ] **Step 2: Create KYC form component**

Client component with:
- File upload for ID document (using Cloudinary via storage integration)
- File upload for selfie
- For MVP: simple URL input fields (actual file upload can use a basic input type="file" with client-side Cloudinary upload)
- Calls `submitKyc` server action
- Shows success/error feedback

Note for MVP: Use simple file inputs that upload directly to Cloudinary via their widget or a basic upload endpoint. If that's too complex, accept URL text inputs for now and wire real uploads later.

- [ ] **Step 3: Create KYC page**

Server component that:
- Gets member profile and latest KYC
- If already VERIFIED: show verified badge, no form
- If PENDING: show pending status
- If DECLARED or REJECTED: show form to submit/resubmit

```tsx
// app/(member)/kyc/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile } from '@/domains/members/profile-queries'
import { getLatestKycForMember } from '@/domains/kyc/queries'
import { KycForm } from '@/components/member/kyc-form'
import { KycStatus } from '@/components/member/kyc-status'

export default async function KycPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  const latestKyc = await getLatestKycForMember(profile.id)

  const showForm = profile.verificationStatus === 'DECLARED' || profile.verificationStatus === 'REJECTED'

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Verification d'identite</h1>

      <KycStatus
        verificationStatus={profile.verificationStatus}
        latestKyc={latestKyc}
      />

      {showForm && <KycForm />}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/(member)/kyc/ components/member/kyc-form.tsx components/member/kyc-status.tsx
git commit -m "feat: add KYC submission page with status display and form"
```

---

## Task 8: Upgrade Page

**Files:**
- Create: `app/(member)/upgrade/page.tsx`
- Create: `components/member/upgrade-card.tsx`

- [ ] **Step 1: Create upgrade card component**

Client component showing:
- Tier name + price
- List of features
- CTA button "Choisir ce plan"
- Disabled if already at that tier or higher
- Calls `createUpgradeRequest` and redirects based on `nextStep`

- [ ] **Step 2: Create upgrade page**

Server component that:
- Gets member profile and active upgrade request
- If active upgrade exists: show status + next step button
- Otherwise: show upgrade cards for available tiers

```tsx
// app/(member)/upgrade/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile } from '@/domains/members/profile-queries'
import { getActiveUpgradeRequest } from '@/domains/upgrade/queries'
import { UpgradeCard } from '@/components/member/upgrade-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TIER_LABELS } from '@/lib/constants'

const PLANS = [
  {
    tier: 'PREMIUM' as const,
    price: '29',
    currency: 'USD',
    period: 'mois',
    features: [
      'Tout ce que fait une Free',
      'Espace membre enrichi',
      'Presentation de votre activite',
      'Visibilite et networking',
      'Reservation evenements',
    ],
  },
  {
    tier: 'BUSINESS' as const,
    price: '59',
    currency: 'USD',
    period: 'mois',
    features: [
      'Tout ce que fait une Premium',
      'Fiche business avancee',
      'Vente de produits / services',
      'Systeme de paiement active',
      'Outils business complets',
    ],
  },
]

export default async function UpgradePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  const activeUpgrade = await getActiveUpgradeRequest(profile.id)

  if (activeUpgrade) {
    const statusMessages: Record<string, { message: string; action?: { label: string; href: string } }> = {
      KYC_PENDING: { message: 'Votre verification d\'identite est en cours.', action: { label: 'Voir le statut KYC', href: '/kyc' } },
      KYC_REJECTED: { message: 'Votre KYC a ete refuse. Vous pouvez resoumettre.', action: { label: 'Resoumettre le KYC', href: '/kyc' } },
      READY_FOR_PAYMENT: { message: 'Votre identite est verifiee ! Procedez au paiement.' },
      PAYMENT_PENDING: { message: 'Paiement en cours de traitement.' },
    }

    const status = statusMessages[activeUpgrade.status]

    return (
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">Upgrade en cours</h1>
        <Card>
          <CardHeader>
            <CardTitle>Passage {TIER_LABELS[activeUpgrade.toTier]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{status?.message}</p>
            {status?.action && (
              <Button asChild>
                <Link href={status.action.href}>{status.action.label}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Choisissez votre plan</h1>
        <p className="text-muted-foreground">Votre plan actuel : {TIER_LABELS[profile.tier]}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <UpgradeCard
            key={plan.tier}
            plan={plan}
            currentTier={profile.tier}
            isVerified={profile.verificationStatus === 'VERIFIED'}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(member)/upgrade/ components/member/upgrade-card.tsx
git commit -m "feat: add upgrade page with plan selection and active upgrade status"
```

---

## Task 9: Admin — Members List

**Files:**
- Create: `app/(admin)/admin/members/page.tsx`
- Create: `components/admin/members-table.tsx`
- Create: `domains/members/admin-queries.ts`

- [ ] **Step 1: Create admin member queries**

```typescript
// domains/members/admin-queries.ts
import { db } from '@/lib/db'
import type { MemberTier, VerificationStatus } from '@/lib/generated/prisma/client'

export async function getAdminMembersList(filters?: {
  tier?: MemberTier
  verificationStatus?: VerificationStatus
  search?: string
}) {
  return db.member.findMany({
    where: {
      ...(filters?.tier && { tier: filters.tier }),
      ...(filters?.verificationStatus && { verificationStatus: filters.verificationStatus }),
      ...(filters?.search && {
        OR: [
          { firstName: { contains: filters.search, mode: 'insensitive' as const } },
          { lastName: { contains: filters.search, mode: 'insensitive' as const } },
          { user: { email: { contains: filters.search, mode: 'insensitive' as const } } },
        ],
      }),
    },
    include: {
      user: { select: { email: true, status: true } },
      kycVerifications: { orderBy: { submittedAt: 'desc' as const }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export async function getAdminMemberDetail(memberId: string) {
  return db.member.findUnique({
    where: { id: memberId },
    include: {
      user: { select: { email: true, status: true, createdAt: true } },
      kycVerifications: { orderBy: { submittedAt: 'desc' } },
      subscriptions: { orderBy: { createdAt: 'desc' } },
      upgradeRequests: { orderBy: { createdAt: 'desc' } },
      businessProfile: true,
    },
  })
}

export async function getAdminMembersStats() {
  const [total, free, premium, business, pendingKyc] = await Promise.all([
    db.member.count(),
    db.member.count({ where: { tier: 'FREE' } }),
    db.member.count({ where: { tier: 'PREMIUM' } }),
    db.member.count({ where: { tier: 'BUSINESS' } }),
    db.kycVerification.count({ where: { status: 'PENDING' } }),
  ])
  return { total, free, premium, business, pendingKyc }
}
```

- [ ] **Step 2: Create members table component**

Client component with:
- Table displaying: name, email, tier (badge), verification status (badge), date inscription
- Filters: tier dropdown, verification status dropdown, search input
- Click row → navigate to member detail
- Uses Table or simple divs + responsive design

- [ ] **Step 3: Create members list page**

Server component that:
- Guards with `requireAdmin()` (in layout already, but for data access)
- Loads stats + members list
- Renders stats cards + members table
- Passes search params for server-side filtering

- [ ] **Step 4: Commit**

```bash
git add app/(admin)/admin/members/page.tsx components/admin/members-table.tsx domains/members/admin-queries.ts
git commit -m "feat: add admin members list with filters and stats"
```

---

## Task 10: Admin — Member Detail + KYC Review

**Files:**
- Create: `app/(admin)/admin/members/[id]/page.tsx`
- Create: `components/admin/kyc-review.tsx`
- Create: `domains/members/admin-actions.ts`

- [ ] **Step 1: Create admin member actions**

```typescript
// domains/members/admin-actions.ts
'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'
import type { MemberTier, MemberStatus } from '@/lib/generated/prisma/client'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function suspendMember(memberId: string): Promise<ActionResult<null>> {
  const { user } = await requireAdmin()

  const member = await db.member.findUnique({ where: { id: memberId }, include: { user: true } })
  if (!member) return { success: false, error: 'RESOURCE_NOT_FOUND' }

  await db.member.update({ where: { id: memberId }, data: { status: 'SUSPENDED' } })
  await db.user.update({ where: { id: member.userId }, data: { status: 'SUSPENDED' } })

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'member.suspend',
    entity: 'Member',
    entityId: memberId,
  })

  return { success: true, data: null }
}

export async function reactivateMember(memberId: string): Promise<ActionResult<null>> {
  const { user } = await requireAdmin()

  await db.member.update({ where: { id: memberId }, data: { status: 'ACTIVE' } })
  const member = await db.member.findUnique({ where: { id: memberId } })
  if (member) {
    await db.user.update({ where: { id: member.userId }, data: { status: 'ACTIVE' } })
  }

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'member.reactivate',
    entity: 'Member',
    entityId: memberId,
  })

  return { success: true, data: null }
}

export async function changeMemberTier(memberId: string, newTier: MemberTier): Promise<ActionResult<null>> {
  const { user } = await requireAdmin('SUPER_ADMIN')

  const member = await db.member.findUnique({ where: { id: memberId } })
  if (!member) return { success: false, error: 'RESOURCE_NOT_FOUND' }

  await db.member.update({ where: { id: memberId }, data: { tier: newTier } })

  await createAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: 'member.change_tier',
    entity: 'Member',
    entityId: memberId,
    details: { fromTier: member.tier, toTier: newTier },
  })

  return { success: true, data: null }
}
```

- [ ] **Step 2: Create KYC review component**

Client component that:
- Shows KYC document images (ID + selfie)
- Shows submission date
- Approve / Reject buttons
- If rejecting: text input for reason
- Calls `reviewKyc` action
- Disabled if KYC is not PENDING

- [ ] **Step 3: Create member detail page**

Server component that:
- Loads full member detail via `getAdminMemberDetail`
- Shows: personal info, tier, verification status, email, registration date
- Shows KYC history with review capability
- Shows subscription history
- Shows upgrade requests history
- Action buttons: suspend/reactivate, change tier
- Back link to members list

- [ ] **Step 4: Commit**

```bash
git add app/(admin)/admin/members/\[id\]/ components/admin/kyc-review.tsx domains/members/admin-actions.ts
git commit -m "feat: add admin member detail page with KYC review and member management"
```

---

## Task 11: Update Sidebar + Final Polish

**Files:**
- Modify: `components/member/member-sidebar.tsx`
- Modify: `app/(member)/layout.tsx` — pass verification status to sidebar
- Create: `components/member/verified-badge.tsx`

- [ ] **Step 1: Add verified badge component**

Small component showing a green checkmark badge when member is verified.

- [ ] **Step 2: Update member sidebar**

- Add "Upgrade" link (visible for FREE and PREMIUM)
- Add "KYC" link (visible if not VERIFIED)
- Show verified badge next to member name if VERIFIED
- Pass `verificationStatus` as prop (update layout to pass it)

- [ ] **Step 3: Update member layout to pass verification status**

```tsx
// In app/(member)/layout.tsx, add verificationStatus to MemberSidebar props
<MemberSidebar memberTier={user.member.tier} verificationStatus={user.member.verificationStatus} />
```

- [ ] **Step 4: Commit**

```bash
git add components/member/member-sidebar.tsx components/member/verified-badge.tsx app/(member)/layout.tsx
git commit -m "feat: update sidebar with upgrade link, KYC link, and verified badge"
```

---

## Task 12: Update Continuity Files

**Files:**
- Modify: `PROJECT_STATE.md`
- Modify: `SESSION_LOG.md`

- [ ] **Step 1: Update PROJECT_STATE.md**

Update "What Works" and "In Progress" sections to reflect Plan 2 completion.

- [ ] **Step 2: Update SESSION_LOG.md**

Add session entry for Plan 2 execution.

- [ ] **Step 3: Commit**

```bash
git add PROJECT_STATE.md SESSION_LOG.md
git commit -m "docs: update project state and session log after Plan 2"
```

---

## Validation Criteria

| # | Criteria | How to verify |
|---|----------|---------------|
| 1 | Dashboard shows role-specific content | Login as free/premium/business, see different dashboards |
| 2 | Profile edit works | Change name, verify in DB |
| 3 | Password change works | Change password, re-login with new password |
| 4 | KYC submission works | Submit KYC as free member, check DB |
| 5 | KYC review works (admin) | Login as admin, approve/reject KYC |
| 6 | KYC approval updates member status | After approve, member.verificationStatus = VERIFIED |
| 7 | Upgrade request works | Create upgrade as free, see state machine step |
| 8 | Upgrade + KYC integration | Upgrade → KYC needed → submit KYC → approve → READY_FOR_PAYMENT |
| 9 | Admin members list loads | Login as admin, see members with filters |
| 10 | Admin member detail loads | Click member, see full detail + KYC history |
| 11 | Suspend/reactivate works | Suspend member via admin, member can't login |
| 12 | Sidebar reflects state | Upgrade link visible for FREE/PREMIUM, verified badge shows |
| 13 | Routes protected | French URLs redirect unauthenticated users |

## Commit Strategy

```
fix: align protected routes with French sidebar URLs
feat: add member profile domain — validators, queries, actions
feat: add KYC domain — submission, admin review, audit logging
feat: add upgrade domain — state machine, request creation, cancellation
feat: add role-aware member dashboard with tier-specific content
feat: add member profile page with edit and password change
feat: add KYC submission page with status display and form
feat: add upgrade page with plan selection and active upgrade status
feat: add admin members list with filters and stats
feat: add admin member detail page with KYC review and member management
feat: update sidebar with upgrade link, KYC link, and verified badge
docs: update project state and session log after Plan 2
```
