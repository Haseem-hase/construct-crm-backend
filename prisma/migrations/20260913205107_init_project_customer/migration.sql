/*
  Warnings:

  - Added the required column `country` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectCustomerRelationshipType" AS ENUM ('OWNER', 'CLIENT', 'DEVELOPER', 'INVESTOR', 'PARTNER', 'OTHER');

-- CreateSequence
CREATE SEQUENCE IF NOT EXISTS project_code_seq START 1;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "actualStartDate" TIMESTAMP(3),
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "plannedEndDate" TIMESTAMP(3),
ADD COLUMN     "plannedStartDate" TIMESTAMP(3),
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "projectCode" SET DEFAULT ('PROJ-'::text || lpad((nextval('project_code_seq'::regclass))::text, 6, '0'::text));

-- CreateTable
CREATE TABLE "project_customers" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "relationshipType" "ProjectCustomerRelationshipType" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_customers_projectId_idx" ON "project_customers"("projectId");

-- CreateIndex
CREATE INDEX "project_customers_customerId_idx" ON "project_customers"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "project_customers_projectId_customerId_relationshipType_key" ON "project_customers"("projectId", "customerId", "relationshipType");

-- AddForeignKey
ALTER TABLE "project_customers" ADD CONSTRAINT "project_customers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- AddForeignKey
ALTER TABLE "project_customers" ADD CONSTRAINT "project_customers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create partial unique index to ensure only one primary customer per project
CREATE UNIQUE INDEX "project_customers_projectId_isPrimary_key" ON "project_customers"("projectId") WHERE "isPrimary" = true;
