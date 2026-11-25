// Study: Read and write database records through Prisma for inventory assets, warehouse stock, requests, returns, and condition reports.
// Study: Import `{ InventoryAssetType, Prisma }` from `"@prisma/client"`.
import { InventoryAssetType, Prisma } from "@prisma/client";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Define the compile-time contract named `InventoryAssetFilters`.
export type InventoryAssetFilters = { type?: InventoryAssetType; search?: string };

// Study: Export `listInventoryAssets` as a reusable function.
export const listInventoryAssets = (organizationId: string, skip: number, take: number, filters: InventoryAssetFilters) => prisma.inventoryAsset.findMany({
    // Study: Set the conditions that database records must match using organizationId, isActive.
    where: {
        // Study: Pass the current `organizationId` value under the same property name.
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
        // Study: Close this group and continue the enclosing expression.
        ] } : {}),
    // Study: Close the object literal.
    },
    // Study: Set the sort order for the returned records.
    orderBy: [{ type: "asc" }, { name: "asc" }],
    // Study: Pass the current `skip` value under the same property name.
    skip,
    // Study: Pass the current `take` value under the same property name.
    take,
// Study: Close the object literal.
});

// Study: Export `countInventoryAssets` as a reusable function.
export const countInventoryAssets = (organizationId: string, filters: InventoryAssetFilters) => prisma.inventoryAsset.count({
    // Study: Set the conditions that database records must match using organizationId, isActive.
    where: {
        // Study: Pass the current `organizationId` value under the same property name.
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
        // Study: Close this group and continue the enclosing expression.
        ] } : {}),
    // Study: Close the object literal.
    },
// Study: Close the object literal.
});

// Study: Export `findInventoryAsset` as a reusable function.
export const findInventoryAsset = (organizationId: string, id: string) => prisma.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } });

// Study: Export `createInventoryAsset` as a reusable function.
export const createInventoryAsset = (data: Prisma.InventoryAssetUncheckedCreateInput) => prisma.inventoryAsset.create({ data });

// Study: Export `updateInventoryAsset` as a reusable function.
export const updateInventoryAsset = (organizationId: string, id: string, data: Prisma.InventoryAssetUpdateManyMutationInput) => prisma.inventoryAsset.updateMany({
    // Study: Set the conditions that database records must match using id, organizationId, isActive.
    where: { id, organizationId, isActive: true },
    // Study: Pass the current `data` value under the same property name.
    data,
// Study: Close the object literal.
});

// Study: Export `deactivateInventoryAsset` as a reusable function.
export const deactivateInventoryAsset = (organizationId: string, id: string) => prisma.inventoryAsset.updateMany({
    // Study: Set the conditions that database records must match using id, organizationId, isActive.
    where: { id, organizationId, isActive: true },
    // Study: Supply the values to write to the database.
    data: { isActive: false },
// Study: Close the object literal.
});
