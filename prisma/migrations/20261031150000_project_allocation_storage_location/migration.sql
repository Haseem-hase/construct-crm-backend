ALTER TABLE "project_material_allocations"
ADD COLUMN "storageLocationId" TEXT;

ALTER TABLE "project_material_allocations"
ADD CONSTRAINT "project_material_allocations_storageLocationId_warehouseId_organizationId_fkey"
FOREIGN KEY ("storageLocationId", "warehouseId", "organizationId")
REFERENCES "storage_locations" ("id", "warehouseId", "organizationId")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "project_material_allocations_organizationId_warehouseId_storageLocationId_idx"
ON "project_material_allocations" ("organizationId", "warehouseId", "storageLocationId");
