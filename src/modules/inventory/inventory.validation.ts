import { z } from "zod";

const uuid = z.string().uuid();
const nonnegativeDecimal = z.union([z.string(), z.number()])
    .transform(String)
    .refine(value => /^\d{1,14}(?:\.\d{1,4})?$/.test(value), "Use a non-negative number with up to 4 decimal places.");

export const idParamsSchema = z.object({ id: uuid });

export const inventoryAssetSchema = z.object({
    type: z.enum(["MATERIAL", "TOOL", "MACHINERY"]),
    code: z.string().trim().min(1).max(80),
    name: z.string().trim().min(1).max(180),
    quantity: nonnegativeDecimal,
    price: nonnegativeDecimal,
    description: z.string().trim().max(2000).nullable().optional(),
    imageUrl: z.string().trim().max(2048).refine(value => value.startsWith("/uploads/") || z.string().url().safeParse(value).success, "Use a valid image URL.").nullable().optional(),
});

export const inventoryAssetUpdateSchema = inventoryAssetSchema.partial()
    .refine(value => Object.keys(value).length > 0, "At least one field must be provided.");

export const inventoryAssetListSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(120).optional(),
    type: z.enum(["MATERIAL", "TOOL", "MACHINERY"]).optional(),
});

export const inventoryWarehouseSchema = z.object({
    code: z.string().trim().min(1).max(80),
    name: z.string().trim().min(1).max(180),
    type: z.enum(["CENTRAL", "PROJECT_SITE"]).default("CENTRAL"),
    projectId: uuid.optional(),
    address: z.string().trim().max(500).nullable().optional(),
});

export const stockAdjustmentSchema = z.object({
    assetId: uuid,
    warehouseId: uuid,
    quantityDelta: z.union([z.string(), z.number()]).transform(String)
        .refine(value => /^-?\d{1,14}(?:\.\d{1,4})?$/.test(value) && Number(value) !== 0, "Enter a non-zero quantity adjustment."),
    reason: z.string().trim().min(3).max(500),
});

export const warehouseStockListSchema = z.object({
    warehouseId: uuid.optional(),
    search: z.string().trim().max(120).optional(),
});

export const inventoryRequestSchema = z.object({
    warehouseId: uuid,
    projectId: uuid,
    labourAssignmentId: uuid.optional(),
    purpose: z.string().trim().max(1000).nullable().optional(),
    lines: z.array(z.object({ assetId: uuid, quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero.") })).min(1).max(100)
        .refine(lines => new Set(lines.map(line => line.assetId)).size === lines.length, "Each item can only appear once in a request."),
});

export const inventoryRequestReviewSchema = z.object({
    decision: z.enum(["APPROVE", "REJECT"]),
    note: z.string().trim().max(1000).nullable().optional(),
});

export const inventoryRequestListSchema = z.object({
    status: z.enum(["SUBMITTED", "APPROVED", "REJECTED", "ISSUED", "PARTIALLY_RETURNED", "RETURNED", "CANCELLED"]).optional(),
});

export const inventoryReturnSchema = z.object({
    requestId: uuid,
    lines: z.array(z.object({
        requestLineId: uuid,
        quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero."),
        condition: z.enum(["GOOD", "DAMAGED", "REPAIR_REQUIRED"]).default("GOOD"),
    })).min(1).max(100).refine(lines => new Set(lines.map(line => line.requestLineId)).size === lines.length, "Each issued item can only appear once in a return."),
});

export const inventoryReturnReviewSchema = z.object({
    decision: z.enum(["APPROVE", "REJECT"]),
    note: z.string().trim().max(1000).nullable().optional(),
});

export const inventoryConditionReportSchema = z.object({
    requestLineId: uuid,
    quantity: nonnegativeDecimal.refine(value => Number(value) > 0, "Quantity must be greater than zero."),
    description: z.string().trim().min(5).max(2000),
});

export const inventoryConditionReviewSchema = z.object({
    status: z.enum(["UNDER_REVIEW", "IN_REPAIR", "RESOLVED", "WRITTEN_OFF"]),
    resolutionNote: z.string().trim().max(1000).nullable().optional(),
});

export type InventoryRequestInput = z.infer<typeof inventoryRequestSchema>;
export type InventoryReturnInput = z.infer<typeof inventoryReturnSchema>;
export type InventoryConditionReportInput = z.infer<typeof inventoryConditionReportSchema>;

export type InventoryAssetInput = z.infer<typeof inventoryAssetSchema>;
export type InventoryAssetUpdate = z.infer<typeof inventoryAssetUpdateSchema>;
export type InventoryAssetListQuery = z.infer<typeof inventoryAssetListSchema>;
