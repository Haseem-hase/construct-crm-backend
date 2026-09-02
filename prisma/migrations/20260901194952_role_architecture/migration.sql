/*
  Warnings:

  - You are about to drop the column `roleId` on the `role_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationRoleId,permissionId]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationRoleId` to the `role_permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropIndex
DROP INDEX "role_permissions_roleId_permissionId_key";

-- DropIndex
DROP INDEX "roles_organizationId_idx";

-- DropIndex
DROP INDEX "roles_organizationId_name_key";

-- AlterTable
ALTER TABLE "role_permissions" DROP COLUMN "roleId",
ADD COLUMN     "organizationRoleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "organizationId",
ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roleId",
ADD COLUMN     "organizationRoleId" TEXT;

-- CreateTable
CREATE TABLE "organization_roles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organization_roles_organizationId_idx" ON "organization_roles"("organizationId");

-- CreateIndex
CREATE INDEX "organization_roles_roleId_idx" ON "organization_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_organizationId_roleId_key" ON "organization_roles"("organizationId", "roleId");

-- CreateIndex
CREATE INDEX "role_permissions_organizationRoleId_idx" ON "role_permissions"("organizationRoleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_organizationRoleId_permissionId_key" ON "role_permissions"("organizationRoleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- AddForeignKey
ALTER TABLE "organization_roles" ADD CONSTRAINT "organization_roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_roles" ADD CONSTRAINT "organization_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_organizationRoleId_fkey" FOREIGN KEY ("organizationRoleId") REFERENCES "organization_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationRoleId_fkey" FOREIGN KEY ("organizationRoleId") REFERENCES "organization_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
