-- Ensure each optional location reference belongs to the same warehouse as its
-- balance, document line, or movement, in addition to the same organization.
CREATE UNIQUE INDEX "storage_locations_id_warehouseId_organizationId_key"
ON "storage_locations" ("id", "warehouseId", "organizationId");

ALTER TABLE "stock_balances"
DROP CONSTRAINT "stock_balances_storageLocationId_organizationId_fkey";
ALTER TABLE "stock_balances"
ADD CONSTRAINT "stock_balances_storageLocationId_warehouseId_organizationId_fkey"
FOREIGN KEY ("storageLocationId", "warehouseId", "organizationId")
REFERENCES "storage_locations" ("id", "warehouseId", "organizationId")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "stock_document_lines"
DROP CONSTRAINT "stock_document_lines_sourceStorageLocationId_organizationI_fkey";
ALTER TABLE "stock_document_lines"
ADD CONSTRAINT "stock_document_lines_sourceStorageLocationId_sourceWarehous_fkey"
FOREIGN KEY ("sourceStorageLocationId", "sourceWarehouseId", "organizationId")
REFERENCES "storage_locations" ("id", "warehouseId", "organizationId")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "stock_document_lines"
DROP CONSTRAINT "stock_document_lines_destinationStorageLocationId_organiza_fkey";
ALTER TABLE "stock_document_lines"
ADD CONSTRAINT "stock_document_lines_destinationStorageLocationId_destinatio_fkey"
FOREIGN KEY ("destinationStorageLocationId", "destinationWarehouseId", "organizationId")
REFERENCES "storage_locations" ("id", "warehouseId", "organizationId")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "stock_movements"
DROP CONSTRAINT "stock_movements_storageLocationId_organizationId_fkey";
ALTER TABLE "stock_movements"
ADD CONSTRAINT "stock_movements_storageLocationId_warehouseId_organization_fkey"
FOREIGN KEY ("storageLocationId", "warehouseId", "organizationId")
REFERENCES "storage_locations" ("id", "warehouseId", "organizationId")
ON DELETE RESTRICT ON UPDATE CASCADE;
