-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('CENTRAL', 'PROJECT_SITE');

-- CreateEnum
CREATE TYPE "StockDocumentType" AS ENUM ('RECEIPT', 'ISSUE', 'TRANSFER', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "StockDocumentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'POSTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('RECEIPT', 'ISSUE', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT');

-- CreateEnum
CREATE TYPE "ProjectMaterialAllocationStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'RELEASED', 'CLOSED');

-- CreateTable
CREATE TABLE "inventory_categories" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentCategoryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units_of_measure" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "precision" INTEGER NOT NULL DEFAULT 4,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_of_measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "unitOfMeasureId" TEXT NOT NULL,
    "reorderLevel" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "defaultCost" DECIMAL(18,4),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WarehouseType" NOT NULL DEFAULT 'CENTRAL',
    "projectId" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_locations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_balances" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "storageLocationId" TEXT,
    "onHandQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "reservedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "weightedAverageUnitCost" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_documents" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "type" "StockDocumentType" NOT NULL,
    "status" "StockDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "reason" TEXT,
    "externalReference" TEXT,
    "supplierId" TEXT,
    "idempotencyKey" TEXT,
    "createdById" TEXT NOT NULL,
    "postedById" TEXT,
    "approvedById" TEXT,
    "rejectedById" TEXT,
    "postedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_document_lines" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "allocationId" TEXT,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unitCost" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "sourceWarehouseId" TEXT,
    "sourceStorageLocationId" TEXT,
    "destinationWarehouseId" TEXT,
    "destinationStorageLocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_document_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "storageLocationId" TEXT,
    "documentId" TEXT NOT NULL,
    "documentLineId" TEXT,
    "type" "StockMovementType" NOT NULL,
    "quantityDelta" DECIMAL(18,4) NOT NULL,
    "unitCost" DECIMAL(18,4) NOT NULL,
    "actorId" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_material_allocations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "allocatedQty" DECIMAL(18,4) NOT NULL,
    "consumedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "releasedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "status" "ProjectMaterialAllocationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_material_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "supplierCode" TEXT,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_categories_organizationId_idx" ON "inventory_categories"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_categories_id_organizationId_key" ON "inventory_categories"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_categories_organizationId_name_key" ON "inventory_categories"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "units_of_measure_code_key" ON "units_of_measure"("code");

-- CreateIndex
CREATE INDEX "inventory_items_organizationId_idx" ON "inventory_items"("organizationId");

-- CreateIndex
CREATE INDEX "inventory_items_organizationId_categoryId_idx" ON "inventory_items"("organizationId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_id_organizationId_key" ON "inventory_items"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_organizationId_sku_key" ON "inventory_items"("organizationId", "sku");

-- CreateIndex
CREATE INDEX "warehouses_organizationId_idx" ON "warehouses"("organizationId");

-- CreateIndex
CREATE INDEX "warehouses_organizationId_projectId_idx" ON "warehouses"("organizationId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_id_organizationId_key" ON "warehouses"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_organizationId_code_key" ON "warehouses"("organizationId", "code");

-- CreateIndex
CREATE INDEX "storage_locations_organizationId_idx" ON "storage_locations"("organizationId");

-- CreateIndex
CREATE INDEX "storage_locations_warehouseId_idx" ON "storage_locations"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "storage_locations_id_organizationId_key" ON "storage_locations"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "storage_locations_warehouseId_code_key" ON "storage_locations"("warehouseId", "code");

-- CreateIndex
CREATE INDEX "stock_balances_organizationId_idx" ON "stock_balances"("organizationId");

-- CreateIndex
CREATE INDEX "stock_balances_organizationId_itemId_idx" ON "stock_balances"("organizationId", "itemId");

-- CreateIndex
CREATE INDEX "stock_balances_organizationId_warehouseId_idx" ON "stock_balances"("organizationId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_balances_id_organizationId_key" ON "stock_balances"("id", "organizationId");

-- CreateIndex
CREATE INDEX "stock_documents_organizationId_type_status_idx" ON "stock_documents"("organizationId", "type", "status");

-- CreateIndex
CREATE INDEX "stock_documents_organizationId_createdAt_idx" ON "stock_documents"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "stock_documents_id_organizationId_key" ON "stock_documents"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_documents_organizationId_referenceNumber_key" ON "stock_documents"("organizationId", "referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stock_documents_organizationId_idempotencyKey_key" ON "stock_documents"("organizationId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "stock_document_lines_organizationId_documentId_idx" ON "stock_document_lines"("organizationId", "documentId");

-- CreateIndex
CREATE INDEX "stock_document_lines_organizationId_itemId_idx" ON "stock_document_lines"("organizationId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_document_lines_id_organizationId_key" ON "stock_document_lines"("id", "organizationId");

-- CreateIndex
CREATE INDEX "stock_movements_organizationId_itemId_occurredAt_idx" ON "stock_movements"("organizationId", "itemId", "occurredAt");

-- CreateIndex
CREATE INDEX "stock_movements_organizationId_warehouseId_occurredAt_idx" ON "stock_movements"("organizationId", "warehouseId", "occurredAt");

-- CreateIndex
CREATE INDEX "stock_movements_organizationId_documentId_idx" ON "stock_movements"("organizationId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_movements_organizationId_idempotencyKey_key" ON "stock_movements"("organizationId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "project_material_allocations_organizationId_projectId_idx" ON "project_material_allocations"("organizationId", "projectId");

-- CreateIndex
CREATE INDEX "project_material_allocations_organizationId_itemId_idx" ON "project_material_allocations"("organizationId", "itemId");

-- CreateIndex
CREATE INDEX "project_material_allocations_organizationId_warehouseId_idx" ON "project_material_allocations"("organizationId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "project_material_allocations_id_organizationId_key" ON "project_material_allocations"("id", "organizationId");

-- CreateIndex
CREATE INDEX "suppliers_organizationId_idx" ON "suppliers"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_id_organizationId_key" ON "suppliers"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_organizationId_supplierCode_key" ON "suppliers"("organizationId", "supplierCode");

-- CreateIndex
CREATE UNIQUE INDEX "projects_id_organizationId_key" ON "projects"("id", "organizationId");

-- AddForeignKey
ALTER TABLE "inventory_categories" ADD CONSTRAINT "inventory_categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_categories" ADD CONSTRAINT "inventory_categories_parentCategoryId_organizationId_fkey" FOREIGN KEY ("parentCategoryId", "organizationId") REFERENCES "inventory_categories"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_categoryId_organizationId_fkey" FOREIGN KEY ("categoryId", "organizationId") REFERENCES "inventory_categories"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_unitOfMeasureId_fkey" FOREIGN KEY ("unitOfMeasureId") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_projectId_organizationId_fkey" FOREIGN KEY ("projectId", "organizationId") REFERENCES "projects"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_warehouseId_organizationId_fkey" FOREIGN KEY ("warehouseId", "organizationId") REFERENCES "warehouses"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_itemId_organizationId_fkey" FOREIGN KEY ("itemId", "organizationId") REFERENCES "inventory_items"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_warehouseId_organizationId_fkey" FOREIGN KEY ("warehouseId", "organizationId") REFERENCES "warehouses"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_storageLocationId_organizationId_fkey" FOREIGN KEY ("storageLocationId", "organizationId") REFERENCES "storage_locations"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_documents" ADD CONSTRAINT "stock_documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_documents" ADD CONSTRAINT "stock_documents_supplierId_organizationId_fkey" FOREIGN KEY ("supplierId", "organizationId") REFERENCES "suppliers"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_documents" ADD CONSTRAINT "stock_documents_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_documents" ADD CONSTRAINT "stock_documents_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_documents" ADD CONSTRAINT "stock_documents_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_documents" ADD CONSTRAINT "stock_documents_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_documentId_organizationId_fkey" FOREIGN KEY ("documentId", "organizationId") REFERENCES "stock_documents"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_itemId_organizationId_fkey" FOREIGN KEY ("itemId", "organizationId") REFERENCES "inventory_items"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_allocationId_organizationId_fkey" FOREIGN KEY ("allocationId", "organizationId") REFERENCES "project_material_allocations"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_sourceWarehouseId_organizationId_fkey" FOREIGN KEY ("sourceWarehouseId", "organizationId") REFERENCES "warehouses"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_sourceStorageLocationId_organizationI_fkey" FOREIGN KEY ("sourceStorageLocationId", "organizationId") REFERENCES "storage_locations"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_destinationWarehouseId_organizationId_fkey" FOREIGN KEY ("destinationWarehouseId", "organizationId") REFERENCES "warehouses"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_destinationStorageLocationId_organiza_fkey" FOREIGN KEY ("destinationStorageLocationId", "organizationId") REFERENCES "storage_locations"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_itemId_organizationId_fkey" FOREIGN KEY ("itemId", "organizationId") REFERENCES "inventory_items"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_warehouseId_organizationId_fkey" FOREIGN KEY ("warehouseId", "organizationId") REFERENCES "warehouses"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_storageLocationId_organizationId_fkey" FOREIGN KEY ("storageLocationId", "organizationId") REFERENCES "storage_locations"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_documentId_organizationId_fkey" FOREIGN KEY ("documentId", "organizationId") REFERENCES "stock_documents"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_documentLineId_organizationId_fkey" FOREIGN KEY ("documentLineId", "organizationId") REFERENCES "stock_document_lines"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_material_allocations" ADD CONSTRAINT "project_material_allocations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_material_allocations" ADD CONSTRAINT "project_material_allocations_projectId_organizationId_fkey" FOREIGN KEY ("projectId", "organizationId") REFERENCES "projects"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_material_allocations" ADD CONSTRAINT "project_material_allocations_itemId_organizationId_fkey" FOREIGN KEY ("itemId", "organizationId") REFERENCES "inventory_items"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_material_allocations" ADD CONSTRAINT "project_material_allocations_warehouseId_organizationId_fkey" FOREIGN KEY ("warehouseId", "organizationId") REFERENCES "warehouses"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_material_allocations" ADD CONSTRAINT "project_material_allocations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_material_allocations" ADD CONSTRAINT "project_material_allocations_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- PostgreSQL treats NULL values as distinct in ordinary unique indexes; these
-- partial indexes enforce a single warehouse-level balance as well as one per bin.
CREATE UNIQUE INDEX "stock_balances_org_item_warehouse_no_location_key"
ON "stock_balances" ("organizationId", "itemId", "warehouseId")
WHERE "storageLocationId" IS NULL;

CREATE UNIQUE INDEX "stock_balances_org_item_warehouse_location_key"
ON "stock_balances" ("organizationId", "itemId", "warehouseId", "storageLocationId")
WHERE "storageLocationId" IS NOT NULL;

ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_quantities_nonnegative_check"
CHECK ("onHandQty" >= 0 AND "reservedQty" >= 0 AND "reservedQty" <= "onHandQty");
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_cost_nonnegative_check"
CHECK ("weightedAverageUnitCost" >= 0);
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_reorder_level_nonnegative_check"
CHECK ("reorderLevel" >= 0 AND ("defaultCost" IS NULL OR "defaultCost" >= 0));
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_project_site_project_check"
CHECK (("type" = 'CENTRAL' AND "projectId" IS NULL) OR ("type" = 'PROJECT_SITE' AND "projectId" IS NOT NULL));
ALTER TABLE "units_of_measure" ADD CONSTRAINT "units_of_measure_precision_range_check"
CHECK ("precision" >= 0 AND "precision" <= 4);
ALTER TABLE "stock_document_lines" ADD CONSTRAINT "stock_document_lines_quantity_cost_check"
CHECK ("quantity" > 0 AND "unitCost" >= 0);
ALTER TABLE "stock_documents" ADD CONSTRAINT "stock_documents_lifecycle_actor_timestamp_check"
CHECK (
  ("status" <> 'POSTED' OR ("postedById" IS NOT NULL AND "postedAt" IS NOT NULL)) AND
  ("status" <> 'REJECTED' OR ("rejectedById" IS NOT NULL AND "rejectedAt" IS NOT NULL)) AND
  (("approvedById" IS NULL) = ("approvedAt" IS NULL))
);
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_quantity_cost_sign_check"
CHECK (
  "quantityDelta" <> 0 AND "unitCost" >= 0 AND
  (("type" IN ('RECEIPT', 'TRANSFER_IN', 'ADJUSTMENT_IN') AND "quantityDelta" > 0) OR
   ("type" IN ('ISSUE', 'TRANSFER_OUT', 'ADJUSTMENT_OUT') AND "quantityDelta" < 0))
);
ALTER TABLE "project_material_allocations" ADD CONSTRAINT "project_material_allocations_quantities_check"
CHECK ("allocatedQty" > 0 AND "consumedQty" >= 0 AND "releasedQty" >= 0 AND "consumedQty" + "releasedQty" <= "allocatedQty");

-- The ledger is append-only. Corrections are compensating movements.
CREATE FUNCTION "prevent_stock_movement_mutation"() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Stock movement ledger rows are immutable';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "stock_movements_immutable" BEFORE UPDATE OR DELETE ON "stock_movements"
FOR EACH ROW EXECUTE FUNCTION "prevent_stock_movement_mutation"();
