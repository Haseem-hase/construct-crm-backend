-- Keep the former warehouse and stock-ledger records available for reference,
-- while taking their unused tables and enums out of Prisma's active public schema.
CREATE SCHEMA IF NOT EXISTS "legacy_inventory";

ALTER TYPE "WarehouseType" SET SCHEMA "legacy_inventory";
ALTER TYPE "StockDocumentType" SET SCHEMA "legacy_inventory";
ALTER TYPE "StockDocumentStatus" SET SCHEMA "legacy_inventory";
ALTER TYPE "StockMovementType" SET SCHEMA "legacy_inventory";
ALTER TYPE "ProjectMaterialAllocationStatus" SET SCHEMA "legacy_inventory";

ALTER TABLE "inventory_categories" SET SCHEMA "legacy_inventory";
ALTER TABLE "units_of_measure" SET SCHEMA "legacy_inventory";
ALTER TABLE "inventory_items" SET SCHEMA "legacy_inventory";
ALTER TABLE "warehouses" SET SCHEMA "legacy_inventory";
ALTER TABLE "storage_locations" SET SCHEMA "legacy_inventory";
ALTER TABLE "stock_balances" SET SCHEMA "legacy_inventory";
ALTER TABLE "stock_documents" SET SCHEMA "legacy_inventory";
ALTER TABLE "stock_document_lines" SET SCHEMA "legacy_inventory";
ALTER TABLE "stock_movements" SET SCHEMA "legacy_inventory";
ALTER TABLE "project_material_allocations" SET SCHEMA "legacy_inventory";
ALTER TABLE "suppliers" SET SCHEMA "legacy_inventory";
