// Study: This file is about tools, equipment, and materials that warehouses store, issue, and take back. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Set up a check for incoming information using `z.string().uuid` and store the result as `uuid`.
const uuid = z.string().uuid();
// Study: Set up a check for incoming information using `z.union([z.string(), z.number()]) .transform(String) .refine` and store the result as `nonnegativeDecimal`.
const nonnegativeDecimal = z.union([z.string(), z.number()])
    // Study: Convert the parsed value to the shape needed by callers.
    .transform(String)
    // Study: Apply a custom validation rule.
    .refine(value => /^\d{1,14}(?:\.\d{1,4})?$/.test(value), "Use a non-negative number with up to 4 decimal places.");

// Study: Set up a check for incoming information using `z.object` and store the result as `idParamsSchema`.
export const idParamsSchema = z.object({ id: uuid });

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryAssetSchema`.
export const inventoryAssetSchema = z.object({
    // Study: Check `type` using the rule `z.enum(["MATERIAL", "TOOL", "MACHINERY"])`.
    type: z.enum(["MATERIAL", "TOOL", "MACHINERY"]),
    // Study: Check `code` using the rule `z.string().trim().min(1).max(80)`.
    code: z.string().trim().min(1).max(80),
    // Study: Check `name` using the rule `z.string().trim().min(1).max(180)`.
    name: z.string().trim().min(1).max(180),
    // Study: Set `quantity` to `nonnegativeDecimal`.
    quantity: nonnegativeDecimal,
    // Study: Set `price` to `nonnegativeDecimal`.
    price: nonnegativeDecimal,
    // Study: Check `description` using the rule `z.string().trim().max(2000).nullable().optional()`.
    description: z.string().trim().max(2000).nullable().optional(),
    // Study: Check `imageUrl` using the rule `z.string().trim().max(2048).refine(value => value.startsWith("/uploads/") || z.stri…`.
    imageUrl: z.string().trim().max(2048).refine(value => value.startsWith("/uploads/") || z.string().url().safeParse(value).success, "Use a valid image URL.").nullable().optional(),
// Study: End this group of values.
});

// Study: Call `inventoryAssetSchema.partial() .refine` and store the result as `inventoryAssetUpdateSchema`.
export const inventoryAssetUpdateSchema = inventoryAssetSchema.partial()
    // Study: Apply a custom validation rule.
    .refine(value => Object.keys(value).length > 0, "At least one field must be provided.");

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryAssetListSchema`.
export const inventoryAssetListSchema = z.object({
    // Study: Check `page` using the rule `z.coerce.number().int().min(1).default(1)`.
    page: z.coerce.number().int().min(1).default(1),
    // Study: Check `pageSize` using the rule `z.coerce.number().int().min(1).max(100).default(20)`.
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    // Study: Check `search` using the rule `z.string().trim().max(120).optional()`.
    search: z.string().trim().max(120).optional(),
    // Study: Check `type` using the rule `z.enum(["MATERIAL", "TOOL", "MACHINERY"]).optional()`.
    type: z.enum(["MATERIAL", "TOOL", "MACHINERY"]).optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryWarehouseSchema`.
export const inventoryWarehouseSchema = z.object({
    // Study: Check `code` using the rule `z.string().trim().min(1).max(80)`.
    code: z.string().trim().min(1).max(80),
    // Study: Check `name` using the rule `z.string().trim().min(1).max(180)`.
    name: z.string().trim().min(1).max(180),
    // Study: Check `type` using the rule `z.enum(["CENTRAL", "PROJECT_SITE"]).default("CENTRAL")`.
    type: z.enum(["CENTRAL", "PROJECT_SITE"]).default("CENTRAL"),
    // Study: Set `projectId` to `uuid.optional()`.
    projectId: uuid.optional(),
    // Study: Check `address` using the rule `z.string().trim().max(500).nullable().optional()`.
    address: z.string().trim().max(500).nullable().optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `stockAdjustmentSchema`.
export const stockAdjustmentSchema = z.object({
    // Study: Set `assetId` to `uuid`.
    assetId: uuid,
    // Study: Set `warehouseId` to `uuid`.
    warehouseId: uuid,
    // Study: Check `quantityDelta` using the rule `z.union([z.string(), z.number()]).transform(String) .refine(value => /^-?\d{1,14}(?…`.
    quantityDelta: z.union([z.string(), z.number()]).transform(String)
        // Study: Apply a custom validation rule.
        .refine(value => /^-?\d{1,14}(?:\.\d{1,4})?$/.test(value) && Number(value) !== 0, "Enter a non-zero quantity adjustment."),
    // Study: Check `reason` using the rule `z.string().trim().min(3).max(500)`.
    reason: z.string().trim().min(3).max(500),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `warehouseStockListSchema`.
export const warehouseStockListSchema = z.object({
    // Study: Set `warehouseId` to `uuid.optional()`.
    warehouseId: uuid.optional(),
    // Study: Check `search` using the rule `z.string().trim().max(120).optional()`.
    search: z.string().trim().max(120).optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryRequestSchema`.
export const inventoryRequestSchema = z.object({
    // Study: Set `warehouseId` to `uuid`.
    warehouseId: uuid,
    // Study: Set `projectId` to `uuid`.
    projectId: uuid,
    // Study: Set `labourAssignmentId` to `uuid.optional()`.
    labourAssignmentId: uuid.optional(),
    // Study: Check `purpose` using the rule `z.string().trim().max(1000).nullable().optional()`.
    purpose: z.string().trim().max(1000).nullable().optional(),
    // Study: Check `lines` using the rule `z.array(z.object({ assetId: uuid, quantity: nonnegativeDecimal.refine(value => Numb…`.
    lines: z.array(z.object({ assetId: uuid, quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero.") })).min(1).max(100)
        // Study: Apply a custom validation rule.
        .refine(lines => new Set(lines.map(line => line.assetId)).size === lines.length, "Each item can only appear once in a request."),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryRequestReviewSchema`.
export const inventoryRequestReviewSchema = z.object({
    // Study: Check `decision` using the rule `z.enum(["APPROVE", "REJECT"])`.
    decision: z.enum(["APPROVE", "REJECT"]),
    // Study: Check `note` using the rule `z.string().trim().max(1000).nullable().optional()`.
    note: z.string().trim().max(1000).nullable().optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryRequestListSchema`.
export const inventoryRequestListSchema = z.object({
    // Study: Check `status` using the rule `z.enum(["SUBMITTED", "APPROVED", "REJECTED", "ISSUED", "PARTIALLY_RETURNED", "RETUR…`.
    status: z.enum(["SUBMITTED", "APPROVED", "REJECTED", "ISSUED", "PARTIALLY_RETURNED", "RETURNED", "CANCELLED"]).optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryReturnSchema`.
export const inventoryReturnSchema = z.object({
    // Study: Set `requestId` to `uuid`.
    requestId: uuid,
    // Study: Check `lines` using the rule `z.array(z.object({ requestLineId: uuid, quantity: nonnegativeDecimal.refine(value =…`.
    lines: z.array(z.object({
        // Study: Set `requestLineId` to `uuid`.
        requestLineId: uuid,
        // Study: Set `quantity` to `nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater tha…`.
        quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero."),
        // Study: Check `condition` using the rule `z.enum(["GOOD", "DAMAGED", "REPAIR_REQUIRED"]).default("GOOD")`.
        condition: z.enum(["GOOD", "DAMAGED", "REPAIR_REQUIRED"]).default("GOOD"),
    // Study: Transform each item in `lines`.
    })).min(1).max(100).refine(lines => new Set(lines.map(line => line.requestLineId)).size === lines.length, "Each issued item can only appear once in a return."),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryReturnReviewSchema`.
export const inventoryReturnReviewSchema = z.object({
    // Study: Check `decision` using the rule `z.enum(["APPROVE", "REJECT"])`.
    decision: z.enum(["APPROVE", "REJECT"]),
    // Study: Check `note` using the rule `z.string().trim().max(1000).nullable().optional()`.
    note: z.string().trim().max(1000).nullable().optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryConditionReportSchema`.
export const inventoryConditionReportSchema = z.object({
    // Study: Set `requestLineId` to `uuid`.
    requestLineId: uuid,
    // Study: Set `quantity` to `nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater tha…`.
    quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero."),
    // Study: Check `description` using the rule `z.string().trim().min(5).max(2000)`.
    description: z.string().trim().min(5).max(2000),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `inventoryConditionReviewSchema`.
export const inventoryConditionReviewSchema = z.object({
    // Study: Check `status` using the rule `z.enum(["UNDER_REVIEW", "IN_REPAIR", "RESOLVED", "WRITTEN_OFF"])`.
    status: z.enum(["UNDER_REVIEW", "IN_REPAIR", "RESOLVED", "WRITTEN_OFF"]),
    // Study: Check `resolutionNote` using the rule `z.string().trim().max(1000).nullable().optional()`.
    resolutionNote: z.string().trim().max(1000).nullable().optional(),
// Study: End this group of values.
});

// Study: Derive the expected information for `InventoryRequestInput` from the same rules that check submitted values.
export type InventoryRequestInput = z.infer<typeof inventoryRequestSchema>;
// Study: Derive the expected information for `InventoryReturnInput` from the same rules that check submitted values.
export type InventoryReturnInput = z.infer<typeof inventoryReturnSchema>;
// Study: Derive the expected information for `InventoryConditionReportInput` from the same rules that check submitted values.
export type InventoryConditionReportInput = z.infer<typeof inventoryConditionReportSchema>;

// Study: Derive the expected information for `InventoryAssetInput` from the same rules that check submitted values.
export type InventoryAssetInput = z.infer<typeof inventoryAssetSchema>;
// Study: Derive the expected information for `InventoryAssetUpdate` from the same rules that check submitted values.
export type InventoryAssetUpdate = z.infer<typeof inventoryAssetUpdateSchema>;
// Study: Derive the expected information for `InventoryAssetListQuery` from the same rules that check submitted values.
export type InventoryAssetListQuery = z.infer<typeof inventoryAssetListSchema>;
