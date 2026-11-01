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
    imageUrl: z.string().trim().url().max(2048).nullable().optional(),
});

export const inventoryAssetUpdateSchema = inventoryAssetSchema.partial()
    .refine(value => Object.keys(value).length > 0, "At least one field must be provided.");

export const inventoryAssetListSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(120).optional(),
    type: z.enum(["MATERIAL", "TOOL", "MACHINERY"]).optional(),
});

export type InventoryAssetInput = z.infer<typeof inventoryAssetSchema>;
export type InventoryAssetUpdate = z.infer<typeof inventoryAssetUpdateSchema>;
export type InventoryAssetListQuery = z.infer<typeof inventoryAssetListSchema>;
