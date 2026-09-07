/*
  Warnings:

  - You are about to drop the column `description` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `customers` table. All the data in the column will be lost.
  - Added the required column `type` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Made the column `city` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateSequence
CREATE SEQUENCE IF NOT EXISTS "customer_code_seq" START 1;

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('COMPANY', 'GOVERNMENT', 'INDIVIDUAL', 'OTHER');

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "description",
DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "postalCode",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parentCustomerId" TEXT,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "type" "CustomerType" NOT NULL,
ALTER COLUMN "customerCode" SET DEFAULT ('CUS-'::text || lpad((nextval('customer_code_seq'::regclass))::text, 3, '0'::text)),
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_parentCustomerId_fkey" FOREIGN KEY ("parentCustomerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
