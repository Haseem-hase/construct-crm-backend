CREATE TYPE "InventoryWarehouseType" AS ENUM ('CENTRAL', 'PROJECT_SITE');
CREATE TYPE "InventoryRequestStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'ISSUED', 'PARTIALLY_RETURNED', 'RETURNED', 'CANCELLED');
CREATE TYPE "InventoryReturnStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'CANCELLED');
CREATE TYPE "InventoryConditionReportStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'IN_REPAIR', 'RESOLVED', 'WRITTEN_OFF');
CREATE TYPE "InventoryStockMovementType" AS ENUM ('RECEIPT', 'ISSUE', 'RETURN', 'DAMAGE_OUT', 'REPAIR_IN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT');

CREATE TABLE "inventory_warehouses" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "InventoryWarehouseType" NOT NULL DEFAULT 'CENTRAL',
  "projectId" TEXT,
  "address" TEXT,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "inventory_warehouses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_warehouse_stocks" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "onHandQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "reservedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "maintenanceQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "inventory_warehouse_stocks_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "inventory_warehouse_stocks_onhand_nonnegative" CHECK ("onHandQty" >= 0),
  CONSTRAINT "inventory_warehouse_stocks_reserved_nonnegative" CHECK ("reservedQty" >= 0),
  CONSTRAINT "inventory_warehouse_stocks_maintenance_nonnegative" CHECK ("maintenanceQty" >= 0)
);

CREATE TABLE "inventory_requests" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "referenceNumber" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "requestedForLabourAssignmentId" TEXT,
  "requestedById" TEXT NOT NULL,
  "reviewedById" TEXT,
  "status" "InventoryRequestStatus" NOT NULL DEFAULT 'SUBMITTED',
  "purpose" TEXT,
  "reviewNote" TEXT,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "issuedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "inventory_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_request_lines" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "requestedQty" DECIMAL(18,4) NOT NULL,
  "approvedQty" DECIMAL(18,4),
  "issuedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "returnedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "inventory_request_lines_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "inventory_request_lines_requested_positive" CHECK ("requestedQty" > 0),
  CONSTRAINT "inventory_request_lines_approved_nonnegative" CHECK ("approvedQty" IS NULL OR "approvedQty" >= 0),
  CONSTRAINT "inventory_request_lines_issued_nonnegative" CHECK ("issuedQty" >= 0),
  CONSTRAINT "inventory_request_lines_returned_nonnegative" CHECK ("returnedQty" >= 0)
);

CREATE TABLE "inventory_return_requests" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "referenceNumber" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "requestedById" TEXT NOT NULL,
  "reviewedById" TEXT,
  "status" "InventoryReturnStatus" NOT NULL DEFAULT 'SUBMITTED',
  "reviewNote" TEXT,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "inventory_return_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_return_lines" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "returnRequestId" TEXT NOT NULL,
  "requestLineId" TEXT NOT NULL,
  "quantity" DECIMAL(18,4) NOT NULL,
  "condition" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "inventory_return_lines_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "inventory_return_lines_quantity_positive" CHECK ("quantity" > 0)
);

CREATE TABLE "inventory_condition_reports" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "requestId" TEXT,
  "requestLineId" TEXT,
  "reportedById" TEXT NOT NULL,
  "reviewedById" TEXT,
  "quantity" DECIMAL(18,4) NOT NULL,
  "description" TEXT NOT NULL,
  "status" "InventoryConditionReportStatus" NOT NULL DEFAULT 'SUBMITTED',
  "resolutionNote" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "inventory_condition_reports_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "inventory_condition_reports_quantity_positive" CHECK ("quantity" > 0)
);

CREATE TABLE "inventory_stock_movements" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "requestId" TEXT,
  "requestLineId" TEXT,
  "returnRequestId" TEXT,
  "conditionReportId" TEXT,
  "type" "InventoryStockMovementType" NOT NULL,
  "quantityDelta" DECIMAL(18,4) NOT NULL,
  "reason" TEXT,
  "actorId" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "inventory_stock_movements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inventory_warehouses_organizationId_code_key" ON "inventory_warehouses"("organizationId", "code");
CREATE INDEX "inventory_warehouses_organizationId_isActive_idx" ON "inventory_warehouses"("organizationId", "isActive");
CREATE UNIQUE INDEX "inventory_warehouse_stocks_organizationId_assetId_warehouseId_key" ON "inventory_warehouse_stocks"("organizationId", "assetId", "warehouseId");
CREATE INDEX "inventory_warehouse_stocks_organizationId_warehouseId_idx" ON "inventory_warehouse_stocks"("organizationId", "warehouseId");
CREATE INDEX "inventory_warehouse_stocks_organizationId_assetId_idx" ON "inventory_warehouse_stocks"("organizationId", "assetId");
CREATE UNIQUE INDEX "inventory_requests_organizationId_referenceNumber_key" ON "inventory_requests"("organizationId", "referenceNumber");
CREATE INDEX "inventory_requests_organizationId_status_submittedAt_idx" ON "inventory_requests"("organizationId", "status", "submittedAt");
CREATE INDEX "inventory_requests_organizationId_projectId_idx" ON "inventory_requests"("organizationId", "projectId");
CREATE INDEX "inventory_requests_organizationId_requestedForLabourAssignmentId_idx" ON "inventory_requests"("organizationId", "requestedForLabourAssignmentId");
CREATE INDEX "inventory_request_lines_organizationId_requestId_idx" ON "inventory_request_lines"("organizationId", "requestId");
CREATE UNIQUE INDEX "inventory_return_requests_organizationId_referenceNumber_key" ON "inventory_return_requests"("organizationId", "referenceNumber");
CREATE INDEX "inventory_return_requests_organizationId_status_submittedAt_idx" ON "inventory_return_requests"("organizationId", "status", "submittedAt");
CREATE INDEX "inventory_return_lines_organizationId_returnRequestId_idx" ON "inventory_return_lines"("organizationId", "returnRequestId");
CREATE INDEX "inventory_condition_reports_organizationId_status_createdAt_idx" ON "inventory_condition_reports"("organizationId", "status", "createdAt");
CREATE INDEX "inventory_stock_movements_organizationId_assetId_occurredAt_idx" ON "inventory_stock_movements"("organizationId", "assetId", "occurredAt");
CREATE INDEX "inventory_stock_movements_organizationId_warehouseId_occurredAt_idx" ON "inventory_stock_movements"("organizationId", "warehouseId", "occurredAt");

ALTER TABLE "inventory_warehouses" ADD CONSTRAINT "inventory_warehouses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_warehouses" ADD CONSTRAINT "inventory_warehouses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_warehouse_stocks" ADD CONSTRAINT "inventory_warehouse_stocks_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "inventory_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_warehouse_stocks" ADD CONSTRAINT "inventory_warehouse_stocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory_warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_requests" ADD CONSTRAINT "inventory_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_requests" ADD CONSTRAINT "inventory_requests_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory_warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_requests" ADD CONSTRAINT "inventory_requests_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_requests" ADD CONSTRAINT "inventory_requests_requestedForLabourAssignmentId_fkey" FOREIGN KEY ("requestedForLabourAssignmentId") REFERENCES "labour_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_requests" ADD CONSTRAINT "inventory_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_requests" ADD CONSTRAINT "inventory_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_request_lines" ADD CONSTRAINT "inventory_request_lines_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "inventory_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_request_lines" ADD CONSTRAINT "inventory_request_lines_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "inventory_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_return_requests" ADD CONSTRAINT "inventory_return_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_return_requests" ADD CONSTRAINT "inventory_return_requests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "inventory_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_return_requests" ADD CONSTRAINT "inventory_return_requests_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory_warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_return_requests" ADD CONSTRAINT "inventory_return_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_return_requests" ADD CONSTRAINT "inventory_return_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_return_lines" ADD CONSTRAINT "inventory_return_lines_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "inventory_return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_return_lines" ADD CONSTRAINT "inventory_return_lines_requestLineId_fkey" FOREIGN KEY ("requestLineId") REFERENCES "inventory_request_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_condition_reports" ADD CONSTRAINT "inventory_condition_reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_condition_reports" ADD CONSTRAINT "inventory_condition_reports_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "inventory_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_condition_reports" ADD CONSTRAINT "inventory_condition_reports_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory_warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_condition_reports" ADD CONSTRAINT "inventory_condition_reports_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "inventory_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inventory_condition_reports" ADD CONSTRAINT "inventory_condition_reports_requestLineId_fkey" FOREIGN KEY ("requestLineId") REFERENCES "inventory_request_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inventory_condition_reports" ADD CONSTRAINT "inventory_condition_reports_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_condition_reports" ADD CONSTRAINT "inventory_condition_reports_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "inventory_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory_warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "inventory_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_requestLineId_fkey" FOREIGN KEY ("requestLineId") REFERENCES "inventory_request_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "inventory_return_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_conditionReportId_fkey" FOREIGN KEY ("conditionReportId") REFERENCES "inventory_condition_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Give each organization a central warehouse and preserve the stock already in its inventory catalog.
INSERT INTO "inventory_warehouses" ("id", "organizationId", "code", "name", "type", "isDefault", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, o."id", 'MAIN', 'Main Warehouse', 'CENTRAL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "organizations" o
;

INSERT INTO "inventory_warehouse_stocks" ("id", "organizationId", "assetId", "warehouseId", "onHandQty", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, a."organizationId", a."id", w."id", a."quantity", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "inventory_assets" a
JOIN "inventory_warehouses" w ON w."organizationId" = a."organizationId" AND w."isDefault" = true;
