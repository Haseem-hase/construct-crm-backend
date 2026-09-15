/*
  Warnings:

  - You are about to drop the column `customerId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `progressPercentage` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledEndDate` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `projects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_customerId_fkey";

-- DropIndex
DROP INDEX "projects_customerId_idx";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "customerId",
DROP COLUMN "progressPercentage",
DROP COLUMN "scheduledEndDate",
DROP COLUMN "startDate";
