# Plan 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete technical foundation — database, auth, permissions, error handling, integrations abstractions — so that all subsequent plans can build features on a solid, tested base.

**Architecture:** Next.js 16 monolith with route groups. Prisma 7 + PostgreSQL for data. Auth.js v5 for authentication (JWT). Domain-driven folder structure with `domains/`, `integrations/`, `lib/`. Server Actions for mutations, guards for security.

**Tech Stack:** Next.js 16, React 19, Prisma 7, PostgreSQL, Auth.js v5, Zod 4, Tailwind CSS 4, shadcn/ui, Resend, Cloudinary, bcryptjs

**Spec:** `docs/superpowers/specs/2026-03-23-club-m-platform-design.md`

**Deliverable:** At the end of this plan, you can:
- Run `npx prisma migrate dev` and get a working database with all tables
- Register a member (Free), login, see a protected dashboard page
- Register a customer, login
- Login as a seeded admin, see a protected admin page
- All routes are protected by middleware + layout guards + action guards
- Integration abstractions are in place (payment, email, storage, kyc)
- Error handling is consistent across the app

---

## File Structure

### Files to create

```
prisma/schema.prisma                    — Complete Prisma schema (all models, enums, indexes)
prisma/seed.ts                          — Seed script (admin + test members)

lib/db.ts                               — Prisma client singleton
lib/errors.ts                           — AuthError, ValidationError, BusinessError classes
lib/error-messages.ts                   — Error-to-UX mapping
lib/constants.ts                        — Global constants (tiers, currencies, commission rates)
lib/permissions.ts                      — Tier hierarchy, hasMinTier, permission definitions
lib/routes.ts                           — Protected route constants + helpers
lib/auth.ts                             — Auth.js v5 configuration
lib/auth-guards.ts                      — Server-side guards (requireAuth, requireMember, etc.)
lib/utils.ts                            — cn() helper + generateCode + generateSlug

middleware.ts                           — Next.js middleware for route protection

domains/members/types.ts                — Member-related TypeScript types
domains/members/validators.ts           — Zod schemas for registration
domains/members/actions.ts              — registerMember, registerCustomer server actions
domains/members/queries.ts              — getUserByEmail, getMemberByUserId, etc.

domains/audit/types.ts                  — AuditLog types
domains/audit/actions.ts                — createAuditLog server action

integrations/payment/types.ts           — PaymentProvider interface
integrations/payment/index.ts           — Provider factory
integrations/payment/local-fintech.ts   — Stub implementation
integrations/payment/errors.ts          — PaymentProviderError

integrations/email/types.ts             — EmailProvider interface
integrations/email/index.ts             — Provider factory
integrations/email/resend.ts            — Resend implementation

integrations/storage/types.ts           — StorageProvider interface
integrations/storage/index.ts           — Provider factory
integrations/storage/cloudinary.ts      — Cloudinary implementation

integrations/kyc/types.ts               — KycProvider interface
integrations/kyc/index.ts               — Provider factory
integrations/kyc/manual.ts              — Manual (admin) implementation

providers/auth-provider.tsx             — SessionProvider wrapper
providers/theme-provider.tsx            — ThemeProvider wrapper

app/layout.tsx                          — Root layout with providers
app/globals.css                         — Tailwind + shadcn theme

app/(auth)/layout.tsx                   — Auth layout (centered, no navbar)
app/(auth)/login/page.tsx               — Login page
app/(auth)/register/page.tsx            — Member registration page
app/(auth)/register/customer/page.tsx   — Customer registration page
app/(auth)/verify-email/page.tsx        — Email verification placeholder (Plan 2 will implement logic)

app/(member)/layout.tsx                 — Member layout with sidebar + guards
app/(member)/dashboard/page.tsx         — Dashboard placeholder (role-aware)

app/(admin)/layout.tsx                  — Admin layout with sidebar + guards
app/(admin)/dashboard/page.tsx          — Admin dashboard placeholder

app/(public)/layout.tsx                 — Public layout
app/(public)/page.tsx                   — Homepage placeholder

app/api/auth/[...nextauth]/route.ts     — Auth.js route handler

components/ui/button.tsx                — shadcn Button (via CLI)
components/ui/input.tsx                 — shadcn Input (via CLI)
components/ui/label.tsx                 — shadcn Label (via CLI)
components/ui/card.tsx                  — shadcn Card (via CLI)
components/ui/sonner.tsx                — shadcn Sonner (via CLI)
components/shared/navbar.tsx            — Basic navbar
components/member/member-sidebar.tsx    — Member sidebar navigation
components/admin/admin-sidebar.tsx      — Admin sidebar navigation
```

### Files to modify

```
package.json                            — Add auth.js, seed script
next.config.ts                          — Add Cloudinary remote pattern
tsconfig.json                           — Verify path aliases
.env                                    — Add missing env vars
.gitignore                              — Ensure .env is ignored
```

---

## Task 1: Prisma Schema

**Files:**
- Create: `prisma/schema.prisma`

**Why first:** Everything depends on the database schema. It must be correct before any domain code.

- [ ] **Step 1: Write the complete Prisma schema**

Write `prisma/schema.prisma` with ALL models from the spec. This is the single source of truth for the data layer.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== ACCOUNTS & AUTH ====================

model User {
  id            String       @id @default(cuid())
  email         String       @unique
  passwordHash  String
  emailVerified Boolean      @default(false)
  status        UserStatus   @default(ACTIVE)

  member       Member?
  customer     Customer?
  adminAccount AdminAccount?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

model Member {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])

  firstName          String
  lastName           String
  phone              String?
  bio                String?
  avatar             String?
  tier               MemberTier         @default(FREE)
  status             MemberStatus       @default(ACTIVE)
  verificationStatus VerificationStatus @default(DECLARED)

  kycVerifications KycVerification[]
  subscriptions    Subscription[]
  businessProfile  BusinessProfile?
  tickets          Ticket[]
  orders           Order[]              @relation("MemberOrders")
  upgradeRequests  UpgradeRequest[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
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

// DECLARED = inscription Free (declaration sur l'honneur)
// PENDING_VERIFICATION = KYC soumis, en attente
// VERIFIED = KYC valide
// REJECTED = KYC refuse
enum VerificationStatus {
  DECLARED
  PENDING_VERIFICATION
  VERIFIED
  REJECTED
}

model Customer {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])

  firstName String
  lastName  String
  phone     String?
  address   Address?

  orders  Order[]  @relation("CustomerOrders")
  tickets Ticket[] @relation("CustomerTickets")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Address {
  id         String   @id @default(cuid())
  customerId String   @unique
  customer   Customer @relation(fields: [customerId], references: [id])

  street   String
  city     String
  commune  String?
  province String?
  country  String  @default("CD")
  notes    String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AdminAccount {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])

  role AdminRole @default(ADMIN)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  MODERATOR
}

// ==================== KYC ====================

model KycVerification {
  id       String @id @default(cuid())
  memberId String
  member   Member @relation(fields: [memberId], references: [id])

  idDocumentUrl   String
  selfieUrl       String
  status          KycStatus @default(PENDING)
  provider        String? // "manual" | "sumsub" | "onfido"
  providerRef     String?
  rejectionReason String?
  reviewedBy      String?

  submittedAt DateTime  @default(now())
  reviewedAt  DateTime?

  @@index([memberId])
  @@index([status])
}

enum KycStatus {
  PENDING
  APPROVED
  REJECTED
  MANUAL_REVIEW
}

// ==================== SUBSCRIPTIONS ====================

model Subscription {
  id       String @id @default(cuid())
  memberId String
  member   Member @relation(fields: [memberId], references: [id])

  tier   MemberTier
  status SubscriptionStatus @default(ACTIVE)

  startDate DateTime @default(now())
  endDate   DateTime

  payments       Payment[]
  upgradeRequest UpgradeRequest?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([memberId])
  @@index([status])
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PAST_DUE
}

// ==================== UPGRADE ====================

model UpgradeRequest {
  id       String @id @default(cuid())
  memberId String
  member   Member @relation(fields: [memberId], references: [id])

  fromTier MemberTier
  toTier   MemberTier
  status   UpgradeStatus @default(KYC_PENDING)

  subscriptionId String?       @unique
  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([memberId])
  @@index([status])
}

enum UpgradeStatus {
  KYC_PENDING
  KYC_REJECTED
  READY_FOR_PAYMENT
  PAYMENT_PENDING
  UPGRADE_COMPLETED
  CANCELLED
}

// ==================== DIRECTORY & BUSINESS ====================

model BusinessProfile {
  id       String @id @default(cuid())
  memberId String @unique
  member   Member @relation(fields: [memberId], references: [id])

  businessName String
  slug         String              @unique
  description  String
  category     String
  coverImage   String?
  images       String[]
  phone        String?
  email        String?
  website      String?
  whatsapp     String?
  address      String?
  profileType  BusinessProfileType @default(SHOWCASE)
  isPublished  Boolean             @default(false)
  isApproved   Boolean             @default(false)

  products       Product[]
  receivedOrders Order[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum BusinessProfileType {
  SHOWCASE // Premium : vitrine
  STORE    // Business : vitrine + vente
}

model Product {
  id         String          @id @default(cuid())
  businessId String
  business   BusinessProfile @relation(fields: [businessId], references: [id])

  name        String
  description String
  price       Decimal
  currency    Currency    @default(USD)
  images      String[]
  type        ProductType @default(PHYSICAL)
  category    String?
  isActive    Boolean     @default(true)
  stock       Int?

  orderItems OrderItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([businessId])
  @@index([isActive])
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

// ==================== EVENTS & TICKETS ====================

model Event {
  id String @id @default(cuid())

  title           String
  slug            String           @unique
  description     String
  coverImage      String?
  location        String
  startDate       DateTime
  endDate         DateTime
  capacity        Int
  waitlistEnabled Boolean          @default(false)
  accessLevel     EventAccessLevel @default(PUBLIC)
  status          EventStatus      @default(DRAFT)
  createdById     String

  prices  EventPrice[]
  tickets Ticket[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model EventPrice {
  id      String @id @default(cuid())
  eventId String
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)

  targetRole PricingRole
  price      Decimal
  currency   Currency    @default(USD)

  @@unique([eventId, targetRole])
}

model Ticket {
  id      String @id @default(cuid())
  eventId String
  event   Event  @relation(fields: [eventId], references: [id])

  // Buyer: member OR customer (mutually exclusive)
  memberId   String?
  member     Member?   @relation(fields: [memberId], references: [id])
  customerId String?
  customer   Customer? @relation("CustomerTickets", fields: [customerId], references: [id])

  qrCode String       @unique
  status TicketStatus  @default(PENDING)

  payment Payment?

  scannedAt DateTime?
  createdAt DateTime  @default(now())

  @@index([eventId])
  @@index([memberId])
  @@index([customerId])
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

// ==================== ORDERS & PAYMENTS ====================

model Order {
  id String @id @default(cuid())

  // Buyer: member OR customer (mutually exclusive, enforced in app)
  memberId   String?
  member     Member?  @relation("MemberOrders", fields: [memberId], references: [id])
  customerId String?
  customer   Customer? @relation("CustomerOrders", fields: [customerId], references: [id])

  // Seller
  businessId String
  business   BusinessProfile @relation(fields: [businessId], references: [id])

  totalAmount      Decimal
  currency         Currency @default(USD)
  commission       Decimal
  confirmationCode String   @unique
  codeExpiresAt    DateTime
  codeUsed         Boolean  @default(false)
  status           OrderStatus @default(PENDING)

  items   OrderItem[]
  payment Payment?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([memberId])
  @@index([customerId])
  @@index([businessId])
  @@index([status])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])

  quantity  Int
  unitPrice Decimal
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
  id String @id @default(cuid())

  amount   Decimal
  currency Currency      @default(USD)
  status   PaymentStatus @default(PENDING)

  provider    PaymentProvider
  providerRef String?

  // Polymorphic link: Order/Ticket = 1:1, Subscription = 1:N
  orderId        String?       @unique
  order          Order?        @relation(fields: [orderId], references: [id])
  ticketId       String?       @unique
  ticket         Ticket?       @relation(fields: [ticketId], references: [id])
  subscriptionId String?
  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])

  metadata Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status])
  @@index([providerRef])
  @@index([subscriptionId])
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

// ==================== AUDIT ====================

// No FK on userId: audit logs must survive soft-delete
model AuditLog {
  id String @id @default(cuid())

  userId    String
  userEmail String

  action   String // e.g. "kyc.approve", "member.suspend"
  entity   String // e.g. "Member", "Order"
  entityId String

  details Json?

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
}
```

- [ ] **Step 2: Run the migration**

```bash
cd /Users/lm/Desktop/club-m-new-version
npx prisma migrate dev --name init
```

Expected: Migration created successfully, all tables created in PostgreSQL.

- [ ] **Step 3: Verify Prisma client generation**

```bash
npx prisma generate
```

Expected: Prisma Client generated successfully.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add complete Prisma schema with all models and indexes"
```

---

## Task 2: Lib — Core Utilities

**Files:**
- Create: `lib/db.ts`, `lib/errors.ts`, `lib/error-messages.ts`, `lib/constants.ts`, `lib/permissions.ts`, `lib/routes.ts`, `lib/utils.ts`

**Why:** These are imported by everything else. They must exist before domains or integrations.

- [ ] **Step 1: Create Prisma client singleton**

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

- [ ] **Step 2: Create error classes**

```typescript
// lib/errors.ts

export type AuthErrorCode =
  | 'NOT_AUTHENTICATED'
  | 'ACCOUNT_INACTIVE'
  | 'ACCOUNT_SUSPENDED'
  | 'NOT_A_MEMBER'
  | 'MEMBER_SUSPENDED'
  | 'INSUFFICIENT_TIER'
  | 'NOT_VERIFIED'
  | 'NOT_ADMIN'
  | 'INSUFFICIENT_ADMIN_ROLE'
  | 'NOT_OWNER'

export type BusinessErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'NO_STORE_PROFILE'
  | 'PROFILE_NOT_APPROVED'
  | 'EVENT_FULL'
  | 'EVENT_NOT_BOOKABLE'
  | 'ORDER_ALREADY_CONFIRMED'
  | 'CONFIRMATION_CODE_EXPIRED'
  | 'CONFIRMATION_CODE_INVALID'
  | 'KYC_ALREADY_PENDING'
  | 'SUBSCRIPTION_ALREADY_ACTIVE'
  | 'INSUFFICIENT_STOCK'
  | 'PRODUCT_INACTIVE'
  | 'UPGRADE_IN_PROGRESS'

export class AuthError extends Error {
  constructor(public code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
  }
}

export class ValidationError extends Error {
  constructor(
    public code: string,
    public field?: string,
    public details?: Record<string, string[]>
  ) {
    super(code)
    this.name = 'ValidationError'
  }
}

export class BusinessError extends Error {
  constructor(
    public code: BusinessErrorCode,
    public context?: Record<string, unknown>
  ) {
    super(code)
    this.name = 'BusinessError'
  }
}
```

- [ ] **Step 3: Create error-to-UX mapping**

```typescript
// lib/error-messages.ts

type ErrorUxEntry = {
  message: string
  severity: 'info' | 'warning' | 'error'
  action?: { label: string; href: string }
}

export const ERROR_UX_MAP: Record<string, ErrorUxEntry> = {
  // Auth errors
  NOT_AUTHENTICATED: {
    message: 'Vous devez vous connecter pour continuer.',
    severity: 'warning',
    action: { label: 'Se connecter', href: '/login' },
  },
  ACCOUNT_SUSPENDED: {
    message: 'Votre compte a ete suspendu. Contactez le support.',
    severity: 'error',
    action: { label: 'Contacter le support', href: '/contact' },
  },
  INSUFFICIENT_TIER: {
    message: 'Cette fonctionnalite est reservee aux membres Premium.',
    severity: 'info',
    action: { label: 'Decouvrir Premium', href: '/upgrade' },
  },
  NOT_VERIFIED: {
    message: 'Votre profil doit etre verifie pour acceder a cette fonctionnalite.',
    severity: 'warning',
    action: { label: 'Verifier mon profil', href: '/kyc' },
  },
  NOT_OWNER: {
    message: "Vous n'avez pas acces a cette ressource.",
    severity: 'error',
  },

  // Business errors
  RESOURCE_NOT_FOUND: {
    message: 'Ressource introuvable.',
    severity: 'error',
  },
  EVENT_FULL: {
    message: "L'evenement est complet.",
    severity: 'warning',
  },
  CONFIRMATION_CODE_EXPIRED: {
    message: 'Le code de confirmation a expire. Contactez le support.',
    severity: 'error',
    action: { label: 'Contacter le support', href: '/contact' },
  },
  CONFIRMATION_CODE_INVALID: {
    message: 'Le code de confirmation est incorrect.',
    severity: 'error',
  },
  INSUFFICIENT_STOCK: {
    message: 'Stock insuffisant pour ce produit.',
    severity: 'warning',
  },
}

export function getErrorUx(code: string): ErrorUxEntry {
  return (
    ERROR_UX_MAP[code] ?? {
      message: 'Une erreur est survenue. Veuillez reessayer.',
      severity: 'error' as const,
    }
  )
}
```

- [ ] **Step 4: Create constants**

```typescript
// lib/constants.ts
import type { MemberTier, Currency } from '@prisma/client'

export const TIER_LABELS: Record<MemberTier, string> = {
  FREE: 'Free',
  PREMIUM: 'Premium',
  BUSINESS: 'Business',
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CDF: 'FC',
  EUR: '€',
}

export const COMMISSION_RATE = 0.1 // 10% commission Club M

export const CONFIRMATION_CODE_LENGTH = 6
export const CONFIRMATION_CODE_EXPIRY_DAYS = 14

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export const PASSWORD_MIN_LENGTH = 8

export const CLOUDINARY_FOLDERS = {
  avatars: 'club-m/avatars',
  kyc: 'club-m/kyc',
  business: 'club-m/business',
  products: 'club-m/products',
  events: 'club-m/events',
} as const
```

- [ ] **Step 5: Create permissions**

```typescript
// lib/permissions.ts
import type { MemberTier, AdminRole } from '@prisma/client'

const TIER_HIERARCHY: Record<MemberTier, number> = {
  FREE: 1,
  PREMIUM: 2,
  BUSINESS: 3,
}

export function hasMinTier(
  userTier: MemberTier,
  requiredTier: MemberTier
): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier]
}

const ADMIN_HIERARCHY: Record<AdminRole, number> = {
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
}

export function hasMinAdminRole(
  userRole: AdminRole,
  requiredRole: AdminRole
): boolean {
  return ADMIN_HIERARCHY[userRole] >= ADMIN_HIERARCHY[requiredRole]
}
```

- [ ] **Step 6: Create route definitions**

```typescript
// lib/routes.ts

export const PROTECTED_ROUTES = {
  member: [
    '/dashboard',
    '/profile',
    '/tickets',
    '/orders',
    '/business',
    '/upgrade',
    '/events',
    '/directory',
  ],
  admin: ['/admin'],
  auth: ['/login', '/register', '/verify-email', '/kyc'],
} as const

export function isProtectedMemberRoute(path: string): boolean {
  return PROTECTED_ROUTES.member.some((r) => path.startsWith(r))
}

export function isProtectedAdminRoute(path: string): boolean {
  return PROTECTED_ROUTES.admin.some((r) => path.startsWith(r))
}

export function isAuthRoute(path: string): boolean {
  return PROTECTED_ROUTES.auth.some((r) => path.startsWith(r))
}
```

- [ ] **Step 7: Create utils**

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateConfirmationCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No 0/O/1/I confusion
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

- [ ] **Step 8: Verify all files compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add lib/
git commit -m "feat: add core lib — errors, permissions, routes, constants, utils"
```

---

## Task 3: Integration Abstractions

**Files:**
- Create: `integrations/payment/types.ts`, `integrations/payment/index.ts`, `integrations/payment/local-fintech.ts`, `integrations/payment/errors.ts`
- Create: `integrations/email/types.ts`, `integrations/email/index.ts`, `integrations/email/resend.ts`
- Create: `integrations/storage/types.ts`, `integrations/storage/index.ts`, `integrations/storage/cloudinary.ts`
- Create: `integrations/kyc/types.ts`, `integrations/kyc/index.ts`, `integrations/kyc/manual.ts`

**Why:** Domains need to call integrations. The interfaces must exist so domain code can import them.

- [ ] **Step 1: Create payment integration**

```typescript
// integrations/payment/types.ts
export interface CreatePaymentParams {
  amount: number
  currency: 'USD' | 'CDF' | 'EUR'
  description: string
  metadata?: Record<string, string>
  returnUrl: string
  cancelUrl: string
}

export interface PaymentResult {
  providerRef: string
  redirectUrl: string
  status: 'pending' | 'success' | 'failed'
}

export interface WebhookEvent {
  providerRef: string
  status: 'success' | 'failed' | 'refunded'
  amount: number
  currency: string
  metadata?: Record<string, string>
}

export interface RefundResult {
  providerRef: string
  status: 'success' | 'failed'
}

export interface PaymentProvider {
  createPayment(params: CreatePaymentParams): Promise<PaymentResult>
  verifyWebhook(payload: unknown, signature: string): Promise<WebhookEvent>
  getPaymentStatus(providerRef: string): Promise<'pending' | 'success' | 'failed'>
  requestRefund(providerRef: string, amount?: number): Promise<RefundResult>
}
```

```typescript
// integrations/payment/errors.ts
export type PaymentErrorCode =
  | 'PROVIDER_UNAVAILABLE'
  | 'PAYMENT_DECLINED'
  | 'INVALID_AMOUNT'
  | 'PROVIDER_ERROR'

export class PaymentProviderError extends Error {
  constructor(
    public code: PaymentErrorCode,
    public originalError?: unknown
  ) {
    super(code)
    this.name = 'PaymentProviderError'
  }
}
```

```typescript
// integrations/payment/local-fintech.ts
import type { PaymentProvider, CreatePaymentParams, PaymentResult, WebhookEvent, RefundResult } from './types'
import { PaymentProviderError } from './errors'

export class LocalFintechProvider implements PaymentProvider {
  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    // TODO: Implement with actual local fintech API
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }

  async verifyWebhook(payload: unknown, signature: string): Promise<WebhookEvent> {
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }

  async getPaymentStatus(providerRef: string): Promise<'pending' | 'success' | 'failed'> {
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }

  async requestRefund(providerRef: string, amount?: number): Promise<RefundResult> {
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }
}
```

```typescript
// integrations/payment/index.ts
import type { PaymentProvider } from './types'
import { LocalFintechProvider } from './local-fintech'

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? 'local-fintech'
  switch (provider) {
    case 'local-fintech':
      return new LocalFintechProvider()
    default:
      throw new Error(`Unknown payment provider: ${provider}`)
  }
}

export type { PaymentProvider, CreatePaymentParams, PaymentResult, WebhookEvent, RefundResult } from './types'
export { PaymentProviderError } from './errors'
```

- [ ] **Step 2: Create email integration**

```typescript
// integrations/email/types.ts
export interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export interface EmailResult {
  id: string
  status: 'sent' | 'failed'
}

export interface EmailProvider {
  send(params: SendEmailParams): Promise<EmailResult>
}
```

```typescript
// integrations/email/resend.ts
import { Resend } from 'resend'
import type { EmailProvider, SendEmailParams, EmailResult } from './types'

const DEFAULT_FROM = 'Club M <noreply@clubm.cd>'

export class ResendEmailProvider implements EmailProvider {
  private client: Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not set')
    this.client = new Resend(apiKey)
  }

  async send(params: SendEmailParams): Promise<EmailResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: params.from ?? DEFAULT_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
      })

      if (error) {
        console.error('[Email] Send failed:', error)
        return { id: '', status: 'failed' }
      }

      return { id: data?.id ?? '', status: 'sent' }
    } catch (err) {
      console.error('[Email] Send error:', err)
      return { id: '', status: 'failed' }
    }
  }
}
```

```typescript
// integrations/email/index.ts
import type { EmailProvider } from './types'
import { ResendEmailProvider } from './resend'

export function getEmailProvider(): EmailProvider {
  return new ResendEmailProvider()
}

export type { EmailProvider, SendEmailParams, EmailResult } from './types'
```

- [ ] **Step 3: Create storage integration**

```typescript
// integrations/storage/types.ts
export interface UploadOptions {
  folder: string
  publicId?: string
  maxWidth?: number
  maxHeight?: number
}

export interface UploadResult {
  publicId: string
  url: string
  width: number
  height: number
}

export interface ImageTransforms {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'thumb'
  quality?: number
}

export interface StorageProvider {
  upload(file: File | Buffer, options: UploadOptions): Promise<UploadResult>
  delete(publicId: string): Promise<void>
  getUrl(publicId: string, transforms?: ImageTransforms): string
}
```

```typescript
// integrations/storage/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'
import type { StorageProvider, UploadOptions, UploadResult, ImageTransforms } from './types'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export class CloudinaryStorageProvider implements StorageProvider {
  async upload(file: File | Buffer, options: UploadOptions): Promise<UploadResult> {
    const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

    const result = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: options.folder,
            public_id: options.publicId,
            transformation: [
              {
                width: options.maxWidth ?? 1200,
                height: options.maxHeight ?? 1200,
                crop: 'limit',
              },
            ],
          },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error('No result from Cloudinary'))
            resolve({
              publicId: result.public_id,
              url: result.secure_url,
              width: result.width,
              height: result.height,
            })
          }
        )
        .end(buffer)
    })

    return result
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }

  getUrl(publicId: string, transforms?: ImageTransforms): string {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: transforms
        ? [
            {
              width: transforms.width,
              height: transforms.height,
              crop: transforms.crop ?? 'fill',
              quality: transforms.quality ?? 'auto',
            },
          ]
        : undefined,
    })
  }
}
```

```typescript
// integrations/storage/index.ts
import type { StorageProvider } from './types'
import { CloudinaryStorageProvider } from './cloudinary'

export function getStorageProvider(): StorageProvider {
  return new CloudinaryStorageProvider()
}

export type { StorageProvider, UploadOptions, UploadResult, ImageTransforms } from './types'
```

- [ ] **Step 4: Create KYC integration**

```typescript
// integrations/kyc/types.ts
export interface KycSubmitParams {
  memberId: string
  idDocumentUrl: string
  selfieUrl: string
}

export interface KycSubmitResult {
  providerRef: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface KycProviderStatus {
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
}

export interface KycProvider {
  submitVerification(params: KycSubmitParams): Promise<KycSubmitResult>
  getVerificationStatus(providerRef: string): Promise<KycProviderStatus>
}
```

```typescript
// integrations/kyc/manual.ts
import type { KycProvider, KycSubmitParams, KycSubmitResult, KycProviderStatus } from './types'

// MVP: KYC is reviewed manually by admins.
// This provider simply marks the submission as pending for admin review.
export class ManualKycProvider implements KycProvider {
  async submitVerification(params: KycSubmitParams): Promise<KycSubmitResult> {
    // No external call — admin reviews in the back-office
    return {
      providerRef: `manual-${params.memberId}-${Date.now()}`,
      status: 'pending',
    }
  }

  async getVerificationStatus(providerRef: string): Promise<KycProviderStatus> {
    // Status is managed in our DB, not from external provider
    return { status: 'pending' }
  }
}
```

```typescript
// integrations/kyc/index.ts
import type { KycProvider } from './types'
import { ManualKycProvider } from './manual'

export function getKycProvider(): KycProvider {
  const provider = process.env.KYC_PROVIDER ?? 'manual'
  switch (provider) {
    case 'manual':
      return new ManualKycProvider()
    default:
      throw new Error(`Unknown KYC provider: ${provider}`)
  }
}

export type { KycProvider, KycSubmitParams, KycSubmitResult, KycProviderStatus } from './types'
```

- [ ] **Step 5: Verify compilation**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add integrations/
git commit -m "feat: add integration abstractions — payment, email, storage, kyc"
```

---

## Task 4: Auth.js v5 Configuration

**Files:**
- Create: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`
- Modify: `package.json` (add next-auth v5 if needed), `.env`

**Why:** Authentication is required before any protected page or action can work.

**Important:** The project has `next-auth@4.24.13` in package.json. We need Auth.js v5 for Next.js 16 compatibility. Check the installed version and upgrade if needed.

- [ ] **Step 1: Check and install Auth.js v5**

```bash
cd /Users/lm/Desktop/club-m-new-version
npm ls next-auth
```

If v4, upgrade:
```bash
npm install next-auth@5
```

Refer to Auth.js v5 documentation for the exact import paths. The key differences from v4:
- Config is in a root `auth.ts` file, not in the API route
- Uses `NextAuth()` which returns `{ handlers, auth, signIn, signOut }`
- Session accessed via `auth()` in server components, not `getServerSession()`

- [ ] **Step 2: Create Auth.js configuration**

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { SESSION_MAX_AGE } from '@/lib/constants'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.user.findUnique({
          where: { email },
          include: {
            member: true,
            customer: true,
            adminAccount: true,
          },
        })

        if (!user) return null
        if (user.status !== 'ACTIVE') return null

        const passwordValid = await compare(password, user.passwordHash)
        if (!passwordValid) return null

        return {
          id: user.id,
          email: user.email,
          isMember: !!user.member,
          isCustomer: !!user.customer,
          isAdmin: !!user.adminAccount,
          memberTier: user.member?.tier ?? null,
          adminRole: user.adminAccount?.role ?? null,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isMember = user.isMember
        token.isCustomer = user.isCustomer
        token.isAdmin = user.isAdmin
        token.memberTier = user.memberTier
        token.adminRole = user.adminRole
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.isMember = token.isMember as boolean
      session.user.isCustomer = token.isCustomer as boolean
      session.user.isAdmin = token.isAdmin as boolean
      session.user.memberTier = token.memberTier as string | null
      session.user.adminRole = token.adminRole as string | null
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
```

- [ ] **Step 3: Create Auth.js type augmentation**

Create or update `types/next-auth.d.ts`:

```typescript
// types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    isMember: boolean
    isCustomer: boolean
    isAdmin: boolean
    memberTier: string | null
    adminRole: string | null
  }

  interface Session {
    user: User & {
      email: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isMember: boolean
    isCustomer: boolean
    isAdmin: boolean
    memberTier: string | null
    adminRole: string | null
  }
}
```

- [ ] **Step 4: Create route handler**

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

- [ ] **Step 5: Update .env with AUTH_SECRET**

The Auth.js v5 env var is `AUTH_SECRET` (not `NEXTAUTH_SECRET`). Verify and update `.env`:

```
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
```

- [ ] **Step 6: Commit**

```bash
git add lib/auth.ts types/next-auth.d.ts app/api/auth/ .env
git commit -m "feat: configure Auth.js v5 with credentials provider"
```

---

## Task 5: Auth Guards

**Files:**
- Create: `lib/auth-guards.ts`

**Why:** Every Server Action and query in the project will import these guards. They are the real security layer (Level 3).

- [ ] **Step 1: Create auth guards**

```typescript
// lib/auth-guards.ts
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { AuthError, BusinessError } from '@/lib/errors'
import { hasMinTier, hasMinAdminRole } from '@/lib/permissions'
import type { MemberTier, AdminRole, User, Member, Customer, AdminAccount } from '@prisma/client'

type UserWithRelations = User & {
  member: Member | null
  customer: Customer | null
  adminAccount: AdminAccount | null
}

export async function requireAuth(): Promise<UserWithRelations> {
  const session = await auth()
  if (!session?.user?.id) throw new AuthError('NOT_AUTHENTICATED')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true, customer: true, adminAccount: true },
  })

  if (!user) throw new AuthError('NOT_AUTHENTICATED')
  if (user.status === 'SUSPENDED') throw new AuthError('ACCOUNT_SUSPENDED')
  if (user.status === 'DELETED') throw new AuthError('ACCOUNT_INACTIVE')

  return user
}

export async function requireMember(
  minTier?: MemberTier
): Promise<{ user: UserWithRelations; member: Member }> {
  const user = await requireAuth()
  if (!user.member) throw new AuthError('NOT_A_MEMBER')
  if (user.member.status === 'SUSPENDED') throw new AuthError('MEMBER_SUSPENDED')
  if (user.member.status === 'BANNED') throw new AuthError('MEMBER_SUSPENDED')
  if (minTier && !hasMinTier(user.member.tier, minTier)) {
    throw new AuthError('INSUFFICIENT_TIER')
  }
  return { user, member: user.member }
}

export async function requireVerifiedMember(
  minTier?: MemberTier
): Promise<{ user: UserWithRelations; member: Member }> {
  const { user, member } = await requireMember(minTier)
  if (member.verificationStatus !== 'VERIFIED') {
    throw new AuthError('NOT_VERIFIED')
  }
  return { user, member }
}

export async function requireVerifiedBusiness(): Promise<{
  user: UserWithRelations
  member: Member
}> {
  const { user, member } = await requireVerifiedMember('BUSINESS')

  const profile = await db.businessProfile.findUnique({
    where: { memberId: member.id },
  })

  if (!profile || profile.profileType !== 'STORE') {
    throw new BusinessError('NO_STORE_PROFILE')
  }
  if (!profile.isApproved) {
    throw new BusinessError('PROFILE_NOT_APPROVED')
  }

  return { user, member }
}

export async function requireAdmin(
  minRole?: AdminRole
): Promise<{ user: UserWithRelations; admin: AdminAccount }> {
  const user = await requireAuth()
  if (!user.adminAccount) throw new AuthError('NOT_ADMIN')
  if (minRole && !hasMinAdminRole(user.adminAccount.role, minRole)) {
    throw new AuthError('INSUFFICIENT_ADMIN_ROLE')
  }
  return { user, admin: user.adminAccount }
}

export function requireOwnership(
  resourceOwnerId: string,
  currentUserId: string
): void {
  if (resourceOwnerId !== currentUserId) {
    throw new AuthError('NOT_OWNER')
  }
}
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add lib/auth-guards.ts
git commit -m "feat: add server-side auth guards with tier, KYC, ownership checks"
```

---

## Task 6: Middleware

**Files:**
- Create: `middleware.ts`

**Why:** First line of defense — redirects unauthenticated users before they reach protected pages.

- [ ] **Step 1: Create middleware**

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { isProtectedMemberRoute, isProtectedAdminRoute, isAuthRoute } from '@/lib/routes'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Auth routes: redirect to dashboard if already logged in
  if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      const redirectTo = req.auth?.user?.isAdmin ? '/admin/dashboard' : '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }
    return NextResponse.next()
  }

  // Member routes: require auth
  if (isProtectedMemberRoute(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      )
    }
    return NextResponse.next()
  }

  // Admin routes: require auth + admin flag in JWT
  if (isProtectedAdminRoute(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!req.auth?.user?.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/webhooks|_next/static|_next/image|favicon.ico|logos/).*)'],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add Next.js middleware for route protection"
```

---

## Task 7: Domain — Members (Registration & Queries)

**Files:**
- Create: `domains/members/types.ts`, `domains/members/validators.ts`, `domains/members/actions.ts`, `domains/members/queries.ts`
- Create: `domains/audit/types.ts`, `domains/audit/actions.ts`

**Why:** Registration is the first user-facing feature. It requires the full vertical: validation → action → DB write → session.

- [ ] **Step 1: Create member types**

```typescript
// domains/members/types.ts
import type { User, Member, Customer } from '@prisma/client'

export type UserWithMember = User & { member: Member }
export type UserWithCustomer = User & { customer: Customer }

export type RegisterMemberInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  certifyWoman: boolean
  acceptTerms: boolean
}

export type RegisterCustomerInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export type LoginInput = {
  email: string
  password: string
}
```

- [ ] **Step 2: Create member validators**

```typescript
// domains/members/validators.ts
import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

export const registerMemberSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caracteres`),
  firstName: z.string().min(1, 'Prenom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  certifyWoman: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez certifier etre une femme' }),
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions' }),
  }),
})

export const registerCustomerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caracteres`),
  firstName: z.string().min(1, 'Prenom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
```

- [ ] **Step 3: Create member queries**

```typescript
// domains/members/queries.ts
import { db } from '@/lib/db'

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: { member: true, customer: true, adminAccount: true },
  })
}

export async function getMemberByUserId(userId: string) {
  return db.member.findUnique({
    where: { userId },
  })
}

export async function getCustomerByUserId(userId: string) {
  return db.customer.findUnique({
    where: { userId },
  })
}
```

- [ ] **Step 4: Create audit domain**

```typescript
// domains/audit/types.ts
export type CreateAuditLogInput = {
  userId: string
  userEmail: string
  action: string
  entity: string
  entityId: string
  details?: Record<string, unknown>
}
```

```typescript
// domains/audit/actions.ts
'use server'

import { db } from '@/lib/db'
import type { CreateAuditLogInput } from './types'

export async function createAuditLog(input: CreateAuditLogInput) {
  return db.auditLog.create({
    data: {
      userId: input.userId,
      userEmail: input.userEmail,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      details: input.details ?? undefined,
    },
  })
}
```

- [ ] **Step 5: Create member actions**

```typescript
// domains/members/actions.ts
'use server'

import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { ValidationError } from '@/lib/errors'
import { registerMemberSchema, registerCustomerSchema } from './validators'
import { getUserByEmail } from './queries'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string; details?: Record<string, string[]> }

export async function registerMember(input: unknown): Promise<ActionResult<{ userId: string; memberId: string }>> {
  const parsed = registerMemberSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: parsed.error.flatten().fieldErrors }
  }

  const { email, password, firstName, lastName } = parsed.data

  const existing = await getUserByEmail(email)
  if (existing) {
    return { success: false, error: 'EMAIL_TAKEN', details: { email: ['Cette adresse email est deja utilisee'] } }
  }

  const passwordHash = await hash(password, 12)

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      member: {
        create: {
          firstName,
          lastName,
          tier: 'FREE',
          status: 'ACTIVE',
          verificationStatus: 'DECLARED',
        },
      },
    },
    include: { member: true },
  })

  // TODO: Send verification email (Plan 2)

  return { success: true, data: { userId: user.id, memberId: user.member!.id } }
}

export async function registerCustomer(input: unknown): Promise<ActionResult<{ userId: string; customerId: string }>> {
  const parsed = registerCustomerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'INVALID_INPUT', details: parsed.error.flatten().fieldErrors }
  }

  const { email, password, firstName, lastName, phone } = parsed.data

  const existing = await getUserByEmail(email)
  if (existing) {
    return { success: false, error: 'EMAIL_TAKEN', details: { email: ['Cette adresse email est deja utilisee'] } }
  }

  const passwordHash = await hash(password, 12)

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      customer: {
        create: {
          firstName,
          lastName,
          phone,
        },
      },
    },
    include: { customer: true },
  })

  return { success: true, data: { userId: user.id, customerId: user.customer!.id } }
}
```

- [ ] **Step 6: Verify compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add domains/
git commit -m "feat: add members domain — registration, queries, validators, audit"
```

---

## Task 8: Providers & Root Layout

**Files:**
- Create: `providers/auth-provider.tsx`, `providers/theme-provider.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`

**Why:** All pages need the session and theme providers wrapping them.

- [ ] **Step 1: Install shadcn/ui base components**

```bash
cd /Users/lm/Desktop/club-m-new-version
npx shadcn@latest add button input label card sonner
```

- [ ] **Step 2: Create auth provider**

```typescript
// providers/auth-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

- [ ] **Step 3: Create theme provider**

```typescript
// providers/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  )
}
```

- [ ] **Step 4: Update root layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Club M — Communaute Femmes Entrepreneures',
  description: 'Plateforme communautaire pour femmes entrepreneures a Kinshasa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add providers/ app/layout.tsx app/globals.css components/ui/
git commit -m "feat: add providers, root layout, shadcn base components"
```

---

## Task 9: Auth Pages (Login + Register)

**Files:**
- Create: `app/(auth)/layout.tsx`, `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, `app/(auth)/register/customer/page.tsx`

**Why:** These are the entry points for all users. Without them, nothing can be tested end-to-end.

- [ ] **Step 1: Create auth layout**

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create login page**

```tsx
// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      toast.error('Email ou mot de passe incorrect')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>Connectez-vous a votre compte Club M</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>
              <Link href="/register" className="underline hover:text-primary">
                Rejoindre Club M
              </Link>
            </p>
            <p>
              <Link href="/register/customer" className="underline hover:text-primary">
                Creer un compte acheteur
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
```

- [ ] **Step 3: Create member registration page**

```tsx
// app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { registerMember } from '@/domains/members/actions'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const input = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      certifyWoman: formData.get('certifyWoman') === 'on',
      acceptTerms: formData.get('acceptTerms') === 'on',
    }

    const result = await registerMember(input)

    if (!result.success) {
      if (result.details) {
        setErrors(result.details)
      } else {
        toast.error('Une erreur est survenue')
      }
      setLoading(false)
      return
    }

    // Auto-login after registration
    await signIn('credentials', {
      email: input.email,
      password: input.password,
      redirect: false,
    })
    toast.success('Bienvenue dans Club M !')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Rejoindre Club M</CardTitle>
        <CardDescription>Creez votre compte membre gratuit</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenom</Label>
              <Input id="firstName" name="firstName" required />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" required />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName[0]}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            {errors.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" required minLength={8} />
            {errors.password && <p className="text-sm text-destructive">{errors.password[0]}</p>}
          </div>
          <div className="space-y-3">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="certifyWoman" className="mt-1" required />
              <span>Je certifie etre une femme</span>
            </label>
            {errors.certifyWoman && <p className="text-sm text-destructive">{errors.certifyWoman[0]}</p>}
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="acceptTerms" className="mt-1" required />
              <span>J'accepte les conditions generales d'utilisation</span>
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creation...' : 'Creer mon compte'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Deja membre ?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
```

- [ ] **Step 4: Create customer registration page**

```tsx
// app/(auth)/register/customer/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { registerCustomer } from '@/domains/members/actions'

export default function RegisterCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const input = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: (formData.get('phone') as string) || undefined,
    }

    const result = await registerCustomer(input)

    if (!result.success) {
      if (result.details) {
        setErrors(result.details)
      } else {
        toast.error('Une erreur est survenue')
      }
      setLoading(false)
      return
    }

    await signIn('credentials', {
      email: input.email,
      password: input.password,
      redirect: false,
    })
    toast.success('Compte cree avec succes !')
    router.push('/')
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Compte acheteur</CardTitle>
        <CardDescription>Creez un compte pour acheter sur Club M</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenom</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            {errors.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" required minLength={8} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telephone (optionnel)</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creation...' : 'Creer mon compte'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            <Link href="/login" className="underline hover:text-primary">
              Deja un compte ? Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add app/(auth)/
git commit -m "feat: add auth pages — login, member registration, customer registration"
```

---

## Task 10: Protected Layouts & Placeholder Pages

**Files:**
- Create: `app/(public)/layout.tsx`, `app/(public)/page.tsx`
- Create: `app/(member)/layout.tsx`, `app/(member)/dashboard/page.tsx`
- Create: `app/(admin)/layout.tsx`, `app/(admin)/dashboard/page.tsx`
- Create: `components/shared/navbar.tsx`, `components/member/member-sidebar.tsx`, `components/admin/admin-sidebar.tsx`

**Why:** These prove the full auth flow works end-to-end: register → login → see role-appropriate dashboard.

- [ ] **Step 1: Create navbar**

```tsx
// components/shared/navbar.tsx
import Link from 'next/link'
import { auth } from '@/lib/auth'

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Club M
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Rejoindre Club M
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create member sidebar**

```tsx
// components/member/member-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { LayoutDashboard, User, Calendar, BookOpen, Ticket, ShoppingBag, TrendingUp, LogOut } from 'lucide-react'

const memberLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profil', icon: User },
  { href: '/events', label: 'Evenements', icon: Calendar },
  { href: '/directory', label: 'Annuaire', icon: BookOpen },
  { href: '/tickets', label: 'Mes tickets', icon: Ticket },
  { href: '/orders', label: 'Mes achats', icon: ShoppingBag },
]

const businessLinks = [
  { href: '/business', label: 'Mon business', icon: TrendingUp },
]

export function MemberSidebar({ memberTier }: { memberTier: string }) {
  const pathname = usePathname()
  const showBusiness = memberTier === 'BUSINESS'

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold">
          Club M
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {memberLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname.startsWith(link.href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
        {showBusiness && (
          <>
            <div className="my-3 border-t" />
            {businessLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </>
        )}
      </nav>
      <div className="border-t p-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Create admin sidebar**

```tsx
// components/admin/admin-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Calendar, BookOpen, ShoppingBag, CreditCard, ClipboardList, LogOut } from 'lucide-react'

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Membres', icon: Users },
  { href: '/admin/events', label: 'Evenements', icon: Calendar },
  { href: '/admin/directory', label: 'Annuaire', icon: BookOpen },
  { href: '/admin/products', label: 'Produits', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/payments', label: 'Paiements', icon: CreditCard },
  { href: '/admin/audit', label: 'Journal', icon: ClipboardList },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          Club M <span className="text-xs text-muted-foreground">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === link.href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 4: Create public layout + homepage placeholder**

```tsx
// app/(public)/layout.tsx
import { Navbar } from '@/components/shared/navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
```

```tsx
// app/(public)/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Club M
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        La communaute des femmes entrepreneures a Kinshasa
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/register">Rejoindre Club M</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create member layout with guard**

```tsx
// app/(member)/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberSidebar } from '@/components/member/member-sidebar'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user) redirect('/login')
  if (user.status === 'SUSPENDED') redirect('/login?error=suspended')
  if (!user.member) redirect('/')

  return (
    <div className="flex h-screen">
      <MemberSidebar memberTier={user.member.tier} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 6: Create member dashboard placeholder**

```tsx
// app/(member)/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TIER_LABELS } from '@/lib/constants'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const member = await db.member.findUnique({
    where: { userId: session.user.id },
  })

  if (!member) redirect('/')

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Bonjour, {member.firstName} !
      </h1>
      <p className="mt-2 text-muted-foreground">
        Membre {TIER_LABELS[member.tier]}
      </p>
    </div>
  )
}
```

- [ ] **Step 7: Create admin layout with guard**

```tsx
// app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { adminAccount: true },
  })

  if (!user?.adminAccount) redirect('/dashboard')

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 8: Create admin dashboard placeholder**

```tsx
// app/(admin)/dashboard/page.tsx
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Administration Club M</h1>
      <p className="mt-2 text-muted-foreground">
        Tableau de bord — en construction
      </p>
    </div>
  )
}
```

- [ ] **Step 9: Commit**

```bash
git add app/(public)/ app/(member)/ app/(admin)/ components/shared/ components/member/ components/admin/
git commit -m "feat: add protected layouts, sidebars, placeholder pages for all spaces"
```

---

## Task 11: Seed Script & End-to-End Verification

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add seed script)

**Why:** We need test data to verify the full auth flow works.

- [ ] **Step 1: Create seed script**

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Admin
  const adminPassword = await hash('admin123', 12)
  const admin = await db.user.upsert({
    where: { email: 'admin@clubm.cd' },
    update: {},
    create: {
      email: 'admin@clubm.cd',
      passwordHash: adminPassword,
      emailVerified: true,
      adminAccount: {
        create: { role: 'SUPER_ADMIN' },
      },
    },
  })
  console.log(`Admin: admin@clubm.cd / admin123 (id: ${admin.id})`)

  // Member Free
  const memberPassword = await hash('member123', 12)
  const freeMember = await db.user.upsert({
    where: { email: 'free@clubm.cd' },
    update: {},
    create: {
      email: 'free@clubm.cd',
      passwordHash: memberPassword,
      emailVerified: true,
      member: {
        create: {
          firstName: 'Marie',
          lastName: 'Kabila',
          tier: 'FREE',
          verificationStatus: 'DECLARED',
        },
      },
    },
  })
  console.log(`Free member: free@clubm.cd / member123 (id: ${freeMember.id})`)

  // Member Premium (verified)
  const premiumMember = await db.user.upsert({
    where: { email: 'premium@clubm.cd' },
    update: {},
    create: {
      email: 'premium@clubm.cd',
      passwordHash: memberPassword,
      emailVerified: true,
      member: {
        create: {
          firstName: 'Sarah',
          lastName: 'Lumumba',
          tier: 'PREMIUM',
          verificationStatus: 'VERIFIED',
          businessProfile: {
            create: {
              businessName: 'Sarah Consulting',
              slug: 'sarah-consulting',
              description: 'Conseil en strategie pour entreprises',
              category: 'Conseil',
              profileType: 'SHOWCASE',
              isPublished: true,
              isApproved: true,
            },
          },
        },
      },
    },
  })
  console.log(`Premium member: premium@clubm.cd / member123 (id: ${premiumMember.id})`)

  // Member Business (verified)
  const businessMember = await db.user.upsert({
    where: { email: 'business@clubm.cd' },
    update: {},
    create: {
      email: 'business@clubm.cd',
      passwordHash: memberPassword,
      emailVerified: true,
      member: {
        create: {
          firstName: 'Grace',
          lastName: 'Mwamba',
          tier: 'BUSINESS',
          verificationStatus: 'VERIFIED',
          businessProfile: {
            create: {
              businessName: 'Grace Fashion',
              slug: 'grace-fashion',
              description: 'Mode et accessoires pour femmes',
              category: 'Mode',
              profileType: 'STORE',
              isPublished: true,
              isApproved: true,
            },
          },
        },
      },
    },
  })
  console.log(`Business member: business@clubm.cd / member123 (id: ${businessMember.id})`)

  // Customer
  const customerPassword = await hash('customer123', 12)
  const customer = await db.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      passwordHash: customerPassword,
      emailVerified: true,
      customer: {
        create: {
          firstName: 'Jean',
          lastName: 'Mukendi',
          phone: '+243812345678',
        },
      },
    },
  })
  console.log(`Customer: client@example.com / customer123 (id: ${customer.id})`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
```

- [ ] **Step 2: Add seed script to package.json**

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

Install tsx if not present:
```bash
npm install -D tsx
```

- [ ] **Step 3: Run seed**

```bash
npx prisma db seed
```

Expected: 5 users created (admin, free member, premium member, business member, customer).

- [ ] **Step 4: Start dev server and verify**

```bash
npm run dev
```

Test manually:
1. Go to `http://localhost:3000` → Homepage with "Rejoindre Club M" button
2. Go to `/login` → Login page
3. Login with `admin@clubm.cd` / `admin123` → Redirect to `/admin/dashboard`
4. Logout → Go to `/login`
5. Login with `free@clubm.cd` / `member123` → Redirect to `/dashboard`, see "Bonjour, Marie !"
6. Logout → Go to `/login`
7. Login with `business@clubm.cd` / `member123` → Dashboard + "Mon business" link visible in sidebar
8. Go to `/register` → Registration form, create a new member → Auto-redirect to dashboard
9. Go to `/admin/dashboard` as non-admin → Redirect to `/dashboard`

- [ ] **Step 5: Commit seed and final adjustments**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add seed script with admin, members, customer test data"
```

---

## Task 12: Continuity Files

**Files:**
- Create: `CLAUDE.md`, `PROJECT_STATE.md`, `SESSION_LOG.md`

**Why:** Required by the project workflow for session continuity.

- [ ] **Step 1: Create CLAUDE.md**

```markdown
# Club M — CLAUDE.md

## Project

Club M is a community platform for women entrepreneurs in Kinshasa, DRC.
Monolithic Next.js 16 app with route groups: (public), (auth), (member), (admin).

## Non-Negotiable Rules

1. No business logic in `app/` — pages call `domains/` and render results
2. No direct Prisma imports in `app/` or `components/` — use `domains/*/queries.ts` or `actions.ts`
3. Every Server Action starts with a guard: `requireAuth()`, `requireMember()`, etc.
4. Every Server Action validates input with Zod
5. Errors use typed classes: `AuthError`, `ValidationError`, `BusinessError`
6. JWT is a transport optimization — guards always re-read the DB
7. Images go through Cloudinary — no local uploads
8. Soft-delete only — never hard-delete records

## Session Protocol

### Start of session
- Read CLAUDE.md, PROJECT_STATE.md, SESSION_LOG.md
- Summarize current state
- Identify next action

### End of session
- Update PROJECT_STATE.md
- Add entry to SESSION_LOG.md

## Key Specs

- Design spec: `docs/superpowers/specs/2026-03-23-club-m-platform-design.md`
- Plan 1 (Foundation): `docs/superpowers/plans/2026-03-23-plan-1-foundation.md`

## Test Accounts (dev)

- Admin: `admin@clubm.cd` / `admin123`
- Free member: `free@clubm.cd` / `member123`
- Premium member: `premium@clubm.cd` / `member123`
- Business member: `business@clubm.cd` / `member123`
- Customer: `client@example.com` / `customer123`
```

- [ ] **Step 2: Create PROJECT_STATE.md**

```markdown
# Club M — Project State

## Vision
Community platform for women entrepreneurs in Kinshasa (RDC).
3 spaces: Public, Member (Free/Premium/Business), Admin.

## Architecture
- Next.js 16 monolith with route groups
- Prisma 7 + PostgreSQL
- Auth.js v5 (JWT)
- Domain-driven structure: `domains/`, `integrations/`, `lib/`

## What Works
- [ ] Database schema (all models)
- [ ] Core lib (errors, permissions, routes, constants, utils)
- [ ] Integration abstractions (payment, email, storage, kyc)
- [ ] Auth.js v5 configuration
- [ ] Server-side auth guards
- [ ] Middleware route protection
- [ ] Member registration + Customer registration
- [ ] Login with role-based redirect
- [ ] Protected layouts (member, admin)
- [ ] Seed data (admin, members, customer)
- [ ] Continuity files

## In Progress
- Plan 2: Member space + KYC + Upgrade

## Remaining (by plan)
- Plan 2: Member dashboard, profile, KYC, upgrade flow
- Plan 3: Events, directory, boutique, business dashboard
- Plan 4: Admin panel, public site optimization, polish

## Known Issues
- Email verification not yet implemented (TODO in Plan 2)
- Payment provider is a stub (needs real fintech integration)

## Key Decisions
- Soft-delete only (UserStatus.DELETED, never hard delete)
- JWT + DB re-read in guards (JWT is transport, DB is truth)
- KYC is manual/admin for MVP (no external provider)
- No guest checkout (always require account)
- Annuaire-first architecture (no standalone marketplace page)
```

- [ ] **Step 3: Create SESSION_LOG.md**

```markdown
# Club M — Session Log

## Session 1 — 2026-03-23

### Actions
- Brainstormed and validated product design
- Wrote design spec v1.1 (all 10 sections)
- Automated spec review: fixed 3 critical, 6 major, 8 minor issues
- Wrote Plan 1 (Foundation)

### Files Created
- `docs/superpowers/specs/2026-03-23-club-m-platform-design.md`
- `docs/superpowers/plans/2026-03-23-plan-1-foundation.md`

### Decisions
- Monolith modulaire Next.js (Approach A)
- 4 sequential implementation plans
- Auth.js v5 (not v4) for Next.js 16 compatibility
- Soft-delete strategy
- Manual KYC for MVP

### Next Session
- Execute Plan 1 (Foundation)
- Then write and execute Plan 2
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md PROJECT_STATE.md SESSION_LOG.md
git commit -m "feat: add project continuity files — CLAUDE.md, PROJECT_STATE.md, SESSION_LOG.md"
```

---

## Validation Criteria

At the end of Plan 1, ALL of the following must be true:

| # | Criteria | How to verify |
|---|----------|---------------|
| 1 | Database has all tables | `npx prisma migrate status` shows no pending migrations |
| 2 | Prisma client generates | `npx prisma generate` succeeds |
| 3 | App compiles | `npx tsc --noEmit` has no errors |
| 4 | Dev server runs | `npm run dev` starts without errors |
| 5 | Member registration works | Fill form at `/register`, account created in DB |
| 6 | Customer registration works | Fill form at `/register/customer`, account created in DB |
| 7 | Login works | Login at `/login`, redirect to role-appropriate dashboard |
| 8 | Member dashboard is protected | Unauthenticated user redirected to `/login` |
| 9 | Admin dashboard is protected | Non-admin redirected to `/dashboard` |
| 10 | Auth guard blocks unauthorized | Server Actions reject unauthenticated/unauthorized requests |
| 11 | Seed data loads | `npx prisma db seed` creates 5 test accounts |
| 12 | Continuity files exist | CLAUDE.md, PROJECT_STATE.md, SESSION_LOG.md at root |

## Commit Strategy

Each task produces 1-2 focused commits. Total expected: ~12 commits.

```
feat: add complete Prisma schema with all models and indexes
feat: add core lib — errors, permissions, routes, constants, utils
feat: add integration abstractions — payment, email, storage, kyc
feat: configure Auth.js v5 with credentials provider
feat: add server-side auth guards with tier, KYC, ownership checks
feat: add Next.js middleware for route protection
feat: add members domain — registration, queries, validators, audit
feat: add providers, root layout, shadcn base components
feat: add auth pages — login, member registration, customer registration
feat: add protected layouts, sidebars, placeholder pages for all spaces
feat: add seed script with admin, members, customer test data
feat: add project continuity files — CLAUDE.md, PROJECT_STATE.md, SESSION_LOG.md
```
