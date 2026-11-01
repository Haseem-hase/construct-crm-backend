import { InventoryAssetType, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

export type InventoryAssetFilters = { type?: InventoryAssetType; search?: string };

export const listInventoryAssets = (organizationId: string, skip: number, take: number, filters: InventoryAssetFilters) => prisma.inventoryAsset.findMany({
    where: {
        organizationId,
        isActive: true,
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.search ? { OR: [
            { code: { contains: filters.search, mode: "insensitive" } },
            { name: { contains: filters.search, mode: "insensitive" } },
        ] } : {}),
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    skip,
    take,
});

export const countInventoryAssets = (organizationId: string, filters: InventoryAssetFilters) => prisma.inventoryAsset.count({
    where: {
        organizationId,
        isActive: true,
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.search ? { OR: [
            { code: { contains: filters.search, mode: "insensitive" } },
            { name: { contains: filters.search, mode: "insensitive" } },
        ] } : {}),
    },
});

export const findInventoryAsset = (organizationId: string, id: string) => prisma.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } });

export const createInventoryAsset = (data: Prisma.InventoryAssetUncheckedCreateInput) => prisma.inventoryAsset.create({ data });

export const updateInventoryAsset = (organizationId: string, id: string, data: Prisma.InventoryAssetUpdateManyMutationInput) => prisma.inventoryAsset.updateMany({
    where: { id, organizationId, isActive: true },
    data,
});

export const deactivateInventoryAsset = (organizationId: string, id: string) => prisma.inventoryAsset.updateMany({
    where: { id, organizationId, isActive: true },
    data: { isActive: false },
});
