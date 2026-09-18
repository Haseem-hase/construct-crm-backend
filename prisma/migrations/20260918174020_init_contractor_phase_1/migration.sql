-- CreateSequence
CREATE SEQUENCE IF NOT EXISTS contractor_code_seq;

-- CreateEnum
CREATE TYPE "ContractorStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE', 'TERMINATED');

-- CreateTable
CREATE TABLE "contractors" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contractorCode" TEXT NOT NULL DEFAULT ('CON-'::text || lpad((nextval('contractor_code_seq'::regclass))::text, 4, '0'::text)),
    "fullName" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "alternativePhone" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "nationalId" TEXT,
    "licenseNumber" TEXT,
    "licenseExpiryDate" TIMESTAMP(3),
    "status" "ContractorStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contractors_contractorCode_key" ON "contractors"("contractorCode");

-- CreateIndex
CREATE INDEX "contractors_organizationId_idx" ON "contractors"("organizationId");

-- CreateIndex
CREATE INDEX "contractors_organizationId_status_idx" ON "contractors"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "contractors_organizationId_phone_key" ON "contractors"("organizationId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "contractors_organizationId_email_key" ON "contractors"("organizationId", "email");

-- AddForeignKey
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
