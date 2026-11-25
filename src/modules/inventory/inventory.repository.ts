// Study: This file is about tools, equipment, and materials that warehouses store, issue, and take back. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `{ InventoryAssetType, Prisma }` from `"@prisma/client"` so this file can use it.
import { InventoryAssetType, Prisma } from "@prisma/client";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Describe which information `InventoryAssetFilters` can contain so TypeScript can catch mistakes while checking the code.
export type InventoryAssetFilters = { type?: InventoryAssetType; search?: string };

// Study: Set up a reusable step named `listInventoryAssets`.
export const listInventoryAssets = (organizationId: string, skip: number, take: number, filters: InventoryAssetFilters) => prisma.inventoryAsset.findMany({
    // Study: Set the conditions that records must meet using organizationId, isActive.
    where: {
        // Study: Carry the value of `organizationId` into the new group under the same name.
        organizationId,
        // Study: Set `isActive` to `true`.
        isActive: true,
        // Study: Expand the values from `(filters.type ? { type: filters.type } : {})` into the surrounding collection.
        ...(filters.type ? { type: filters.type } : {}),
        // Study: Expand the values from `(filters.search ? { OR: [ { code: { contains: filters.search, mode: "insensitive" }…` into the surrounding collection.
        ...(filters.search ? { OR: [
            // Study: Start the object passed to the surrounding expression.
            { code: { contains: filters.search, mode: "insensitive" } },
            // Study: Start the object passed to the surrounding expression.
            { name: { contains: filters.search, mode: "insensitive" } },
        // Study: Finish this group and continue the surrounding step.
        ] } : {}),
    // Study: End this group of values.
    },
    // Study: Set the sort order for the returned records.
    orderBy: [{ type: "asc" }, { name: "asc" }],
    // Study: Carry the value of `skip` into the new group under the same name.
    skip,
    // Study: Carry the value of `take` into the new group under the same name.
    take,
// Study: End this group of values.
});

// Study: Set up a reusable step named `countInventoryAssets`.
export const countInventoryAssets = (organizationId: string, filters: InventoryAssetFilters) => prisma.inventoryAsset.count({
    // Study: Set the conditions that records must meet using organizationId, isActive.
    where: {
        // Study: Carry the value of `organizationId` into the new group under the same name.
        organizationId,
        // Study: Set `isActive` to `true`.
        isActive: true,
        // Study: Expand the values from `(filters.type ? { type: filters.type } : {})` into the surrounding collection.
        ...(filters.type ? { type: filters.type } : {}),
        // Study: Expand the values from `(filters.search ? { OR: [ { code: { contains: filters.search, mode: "insensitive" }…` into the surrounding collection.
        ...(filters.search ? { OR: [
            // Study: Start the object passed to the surrounding expression.
            { code: { contains: filters.search, mode: "insensitive" } },
            // Study: Start the object passed to the surrounding expression.
            { name: { contains: filters.search, mode: "insensitive" } },
        // Study: Finish this group and continue the surrounding step.
        ] } : {}),
    // Study: End this group of values.
    },
// Study: End this group of values.
});

// Study: Set up a reusable step named `findInventoryAsset`.
export const findInventoryAsset = (organizationId: string, id: string) => prisma.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } });

// Study: Set up a reusable step named `createInventoryAsset`.
export const createInventoryAsset = (data: Prisma.InventoryAssetUncheckedCreateInput) => prisma.inventoryAsset.create({ data });

// Study: Set up a reusable step named `updateInventoryAsset`.
export const updateInventoryAsset = (organizationId: string, id: string, data: Prisma.InventoryAssetUpdateManyMutationInput) => prisma.inventoryAsset.updateMany({
    // Study: Set the conditions that records must meet using id, organizationId, isActive.
    where: { id, organizationId, isActive: true },
    // Study: Carry the value of `data` into the new group under the same name.
    data,
// Study: End this group of values.
});

// Study: Set up a reusable step named `deactivateInventoryAsset`.
export const deactivateInventoryAsset = (organizationId: string, id: string) => prisma.inventoryAsset.updateMany({
    // Study: Set the conditions that records must meet using id, organizationId, isActive.
    where: { id, organizationId, isActive: true },
    // Study: Supply the values to write to the database.
    data: { isActive: false },
// Study: End this group of values.
});
