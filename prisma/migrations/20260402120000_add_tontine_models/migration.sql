-- CreateEnum
CREATE TYPE "TontineStatus" AS ENUM ('DRAFT', 'OPEN', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TontineMemberRole" AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE "TontineMemberStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'LEFT');

-- CreateTable
CREATE TABLE "Tontine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "monthlyAmount" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "durationMonths" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "totalSpots" INTEGER NOT NULL,
    "description" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "notifyMembers" BOOLEAN NOT NULL DEFAULT true,
    "allowPreRegistration" BOOLEAN NOT NULL DEFAULT false,
    "status" "TontineStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tontine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TontineMember" (
    "id" TEXT NOT NULL,
    "tontineId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" "TontineMemberRole" NOT NULL DEFAULT 'MEMBER',
    "status" "TontineMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TontineMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TontinePayment" (
    "id" TEXT NOT NULL,
    "tontineMemberId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TontinePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tontine_code_key" ON "Tontine"("code");
CREATE INDEX "Tontine_status_idx" ON "Tontine"("status");

CREATE UNIQUE INDEX "TontineMember_tontineId_memberId_key" ON "TontineMember"("tontineId", "memberId");
CREATE INDEX "TontineMember_tontineId_idx" ON "TontineMember"("tontineId");
CREATE INDEX "TontineMember_memberId_idx" ON "TontineMember"("memberId");

CREATE INDEX "TontinePayment_tontineMemberId_idx" ON "TontinePayment"("tontineMemberId");
CREATE INDEX "TontinePayment_dueDate_idx" ON "TontinePayment"("dueDate");

-- AddForeignKey
ALTER TABLE "TontineMember" ADD CONSTRAINT "TontineMember_tontineId_fkey" FOREIGN KEY ("tontineId") REFERENCES "Tontine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TontineMember" ADD CONSTRAINT "TontineMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TontinePayment" ADD CONSTRAINT "TontinePayment_tontineMemberId_fkey" FOREIGN KEY ("tontineMemberId") REFERENCES "TontineMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
