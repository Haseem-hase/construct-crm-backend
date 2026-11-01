CREATE TYPE "InventoryAssetType" AS ENUM ('MATERIAL', 'TOOL', 'MACHINERY');

CREATE TABLE "inventory_assets" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "InventoryAssetType" NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "price" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_assets_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "inventory_assets_quantity_nonnegative_check" CHECK ("quantity" >= 0),
    CONSTRAINT "inventory_assets_price_nonnegative_check" CHECK ("price" >= 0)
);

CREATE UNIQUE INDEX "inventory_assets_organizationId_code_key" ON "inventory_assets"("organizationId", "code");
CREATE INDEX "inventory_assets_organizationId_type_isActive_idx" ON "inventory_assets"("organizationId", "type", "isActive");
CREATE INDEX "inventory_assets_organizationId_name_idx" ON "inventory_assets"("organizationId", "name");

ALTER TABLE "inventory_assets" ADD CONSTRAINT "inventory_assets_organizationId_fkey"
FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep the existing material catalog visible in the simplified register.
-- Existing stock balances are rolled up across locations; movement history is untouched.
INSERT INTO "inventory_assets" (
    "id", "organizationId", "type", "code", "name", "quantity", "price",
    "description", "imageUrl", "isActive", "createdAt", "updatedAt"
)
SELECT
    i."id", i."organizationId", 'MATERIAL'::"InventoryAssetType", i."sku", i."name",
    COALESCE(b."onHandQty", 0), COALESCE(i."defaultCost", b."weightedAverageUnitCost", 0),
    i."description", NULL, i."isActive", i."createdAt", i."updatedAt"
FROM "inventory_items" i
LEFT JOIN LATERAL (
    SELECT
        SUM(sb."onHandQty") AS "onHandQty",
        CASE WHEN SUM(sb."onHandQty") > 0
            THEN SUM(sb."onHandQty" * sb."weightedAverageUnitCost") / SUM(sb."onHandQty")
            ELSE NULL
        END AS "weightedAverageUnitCost"
    FROM "stock_balances" sb
    WHERE sb."organizationId" = i."organizationId" AND sb."itemId" = i."id"
) b ON true;
