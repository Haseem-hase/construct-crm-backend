// Study: Use Zod to parse and validate inputs for inventory assets, warehouse stock, requests, returns, and condition reports.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Build a Zod validation rule with `z.string().uuid` and store the result as `uuid`.
const uuid = z.string().uuid();
// Study: Build a Zod validation rule with `z.union([z.string(), z.number()]) .transform(String) .refine` and store the result as `nonnegativeDecimal`.
const nonnegativeDecimal = z.union([z.string(), z.number()])
    // Study: Convert the parsed value to the shape needed by callers.
    .transform(String)
    // Study: Apply a custom validation rule.
    .refine(value => /^\d{1,14}(?:\.\d{1,4})?$/.test(value), "Use a non-negative number with up to 4 decimal places.");

// Study: Build a Zod validation rule with `z.object` and store the result as `idParamsSchema`.
export const idParamsSchema = z.object({ id: uuid });

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryAssetSchema`.
export const inventoryAssetSchema = z.object({
    // Study: Validate `type` with `z.enum(["MATERIAL", "TOOL", "MACHINERY"])`.
    type: z.enum(["MATERIAL", "TOOL", "MACHINERY"]),
    // Study: Validate `code` with `z.string().trim().min(1).max(80)`.
    code: z.string().trim().min(1).max(80),
    // Study: Validate `name` with `z.string().trim().min(1).max(180)`.
    name: z.string().trim().min(1).max(180),
    // Study: Set `quantity` to `nonnegativeDecimal`.
    quantity: nonnegativeDecimal,
    // Study: Set `price` to `nonnegativeDecimal`.
    price: nonnegativeDecimal,
    // Study: Validate `description` with `z.string().trim().max(2000).nullable().optional()`.
    description: z.string().trim().max(2000).nullable().optional(),
    // Study: Validate `imageUrl` with `z.string().trim().max(2048).refine(value => value.startsWith("/uploads/") || z.stri…`.
    imageUrl: z.string().trim().max(2048).refine(value => value.startsWith("/uploads/") || z.string().url().safeParse(value).success, "Use a valid image URL.").nullable().optional(),
// Study: Close the object literal.
});

// Study: Call `inventoryAssetSchema.partial() .refine` and store the result as `inventoryAssetUpdateSchema`.
export const inventoryAssetUpdateSchema = inventoryAssetSchema.partial()
    // Study: Apply a custom validation rule.
    .refine(value => Object.keys(value).length > 0, "At least one field must be provided.");

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryAssetListSchema`.
export const inventoryAssetListSchema = z.object({
    // Study: Validate `page` with `z.coerce.number().int().min(1).default(1)`.
    page: z.coerce.number().int().min(1).default(1),
    // Study: Validate `pageSize` with `z.coerce.number().int().min(1).max(100).default(20)`.
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    // Study: Validate `search` with `z.string().trim().max(120).optional()`.
    search: z.string().trim().max(120).optional(),
    // Study: Validate `type` with `z.enum(["MATERIAL", "TOOL", "MACHINERY"]).optional()`.
    type: z.enum(["MATERIAL", "TOOL", "MACHINERY"]).optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryWarehouseSchema`.
export const inventoryWarehouseSchema = z.object({
    // Study: Validate `code` with `z.string().trim().min(1).max(80)`.
    code: z.string().trim().min(1).max(80),
    // Study: Validate `name` with `z.string().trim().min(1).max(180)`.
    name: z.string().trim().min(1).max(180),
    // Study: Validate `type` with `z.enum(["CENTRAL", "PROJECT_SITE"]).default("CENTRAL")`.
    type: z.enum(["CENTRAL", "PROJECT_SITE"]).default("CENTRAL"),
    // Study: Set `projectId` to `uuid.optional()`.
    projectId: uuid.optional(),
    // Study: Validate `address` with `z.string().trim().max(500).nullable().optional()`.
    address: z.string().trim().max(500).nullable().optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `stockAdjustmentSchema`.
export const stockAdjustmentSchema = z.object({
    // Study: Set `assetId` to `uuid`.
    assetId: uuid,
    // Study: Set `warehouseId` to `uuid`.
    warehouseId: uuid,
    // Study: Validate `quantityDelta` with `z.union([z.string(), z.number()]).transform(String) .refine(value => /^-?\d{1,14}(?…`.
    quantityDelta: z.union([z.string(), z.number()]).transform(String)
        // Study: Apply a custom validation rule.
        .refine(value => /^-?\d{1,14}(?:\.\d{1,4})?$/.test(value) && Number(value) !== 0, "Enter a non-zero quantity adjustment."),
    // Study: Validate `reason` with `z.string().trim().min(3).max(500)`.
    reason: z.string().trim().min(3).max(500),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `warehouseStockListSchema`.
export const warehouseStockListSchema = z.object({
    // Study: Set `warehouseId` to `uuid.optional()`.
    warehouseId: uuid.optional(),
    // Study: Validate `search` with `z.string().trim().max(120).optional()`.
    search: z.string().trim().max(120).optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryRequestSchema`.
export const inventoryRequestSchema = z.object({
    // Study: Set `warehouseId` to `uuid`.
    warehouseId: uuid,
    // Study: Set `projectId` to `uuid`.
    projectId: uuid,
    // Study: Set `labourAssignmentId` to `uuid.optional()`.
    labourAssignmentId: uuid.optional(),
    // Study: Validate `purpose` with `z.string().trim().max(1000).nullable().optional()`.
    purpose: z.string().trim().max(1000).nullable().optional(),
    // Study: Validate `lines` with `z.array(z.object({ assetId: uuid, quantity: nonnegativeDecimal.refine(value => Numb…`.
    lines: z.array(z.object({ assetId: uuid, quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero.") })).min(1).max(100)
        // Study: Apply a custom validation rule.
        .refine(lines => new Set(lines.map(line => line.assetId)).size === lines.length, "Each item can only appear once in a request."),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryRequestReviewSchema`.
export const inventoryRequestReviewSchema = z.object({
    // Study: Validate `decision` with `z.enum(["APPROVE", "REJECT"])`.
    decision: z.enum(["APPROVE", "REJECT"]),
    // Study: Validate `note` with `z.string().trim().max(1000).nullable().optional()`.
    note: z.string().trim().max(1000).nullable().optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryRequestListSchema`.
export const inventoryRequestListSchema = z.object({
    // Study: Validate `status` with `z.enum(["SUBMITTED", "APPROVED", "REJECTED", "ISSUED", "PARTIALLY_RETURNED", "RETUR…`.
    status: z.enum(["SUBMITTED", "APPROVED", "REJECTED", "ISSUED", "PARTIALLY_RETURNED", "RETURNED", "CANCELLED"]).optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryReturnSchema`.
export const inventoryReturnSchema = z.object({
    // Study: Set `requestId` to `uuid`.
    requestId: uuid,
    // Study: Validate `lines` with `z.array(z.object({ requestLineId: uuid, quantity: nonnegativeDecimal.refine(value =…`.
    lines: z.array(z.object({
        // Study: Set `requestLineId` to `uuid`.
        requestLineId: uuid,
        // Study: Set `quantity` to `nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater tha…`.
        quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero."),
        // Study: Validate `condition` with `z.enum(["GOOD", "DAMAGED", "REPAIR_REQUIRED"]).default("GOOD")`.
        condition: z.enum(["GOOD", "DAMAGED", "REPAIR_REQUIRED"]).default("GOOD"),
    // Study: Transform each item in `lines`.
    })).min(1).max(100).refine(lines => new Set(lines.map(line => line.requestLineId)).size === lines.length, "Each issued item can only appear once in a return."),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryReturnReviewSchema`.
export const inventoryReturnReviewSchema = z.object({
    // Study: Validate `decision` with `z.enum(["APPROVE", "REJECT"])`.
    decision: z.enum(["APPROVE", "REJECT"]),
    // Study: Validate `note` with `z.string().trim().max(1000).nullable().optional()`.
    note: z.string().trim().max(1000).nullable().optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryConditionReportSchema`.
export const inventoryConditionReportSchema = z.object({
    // Study: Set `requestLineId` to `uuid`.
    requestLineId: uuid,
    // Study: Set `quantity` to `nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater tha…`.
    quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero."),
    // Study: Validate `description` with `z.string().trim().min(5).max(2000)`.
    description: z.string().trim().min(5).max(2000),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `inventoryConditionReviewSchema`.
export const inventoryConditionReviewSchema = z.object({
    // Study: Validate `status` with `z.enum(["UNDER_REVIEW", "IN_REPAIR", "RESOLVED", "WRITTEN_OFF"])`.
    status: z.enum(["UNDER_REVIEW", "IN_REPAIR", "RESOLVED", "WRITTEN_OFF"]),
    // Study: Validate `resolutionNote` with `z.string().trim().max(1000).nullable().optional()`.
    resolutionNote: z.string().trim().max(1000).nullable().optional(),
// Study: Close the object literal.
});

// Study: Define the compile-time contract named `InventoryRequestInput` from the Zod schema so the types follow validation.
export type InventoryRequestInput = z.infer<typeof inventoryRequestSchema>;
// Study: Define the compile-time contract named `InventoryReturnInput` from the Zod schema so the types follow validation.
export type InventoryReturnInput = z.infer<typeof inventoryReturnSchema>;
// Study: Define the compile-time contract named `InventoryConditionReportInput` from the Zod schema so the types follow validation.
export type InventoryConditionReportInput = z.infer<typeof inventoryConditionReportSchema>;

// Study: Define the compile-time contract named `InventoryAssetInput` from the Zod schema so the types follow validation.
export type InventoryAssetInput = z.infer<typeof inventoryAssetSchema>;
// Study: Define the compile-time contract named `InventoryAssetUpdate` from the Zod schema so the types follow validation.
export type InventoryAssetUpdate = z.infer<typeof inventoryAssetUpdateSchema>;
// Study: Define the compile-time contract named `InventoryAssetListQuery` from the Zod schema so the types follow validation.
export type InventoryAssetListQuery = z.infer<typeof inventoryAssetListSchema>;
