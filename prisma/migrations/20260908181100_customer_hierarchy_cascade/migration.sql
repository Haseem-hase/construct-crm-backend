-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_parentCustomerId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_organizationId_key" ON "customers"("id", "organizationId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_parentCustomerId_organizationId_fkey" FOREIGN KEY ("parentCustomerId", "organizationId") REFERENCES "customers"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

