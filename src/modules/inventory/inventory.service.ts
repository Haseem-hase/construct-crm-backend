import { Prisma } from "@prisma/client";
import { ConflictError } from "../../errors/ConflictError";
import { NotFoundError } from "../../errors/NotFoundError";
import * as repository from "./inventory.repository";
import { InventoryAssetInput, InventoryAssetListQuery, InventoryAssetUpdate } from "./inventory.validation";

const mapUniqueConflict = (error: unknown): never => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("That inventory code is already in use by your organization.");
    }
    throw error;
};

export const listInventoryAssets = async (organizationId: string, query: InventoryAssetListQuery) => {
    const filters = { type: query.type, search: query.search };
    const [rows, total] = await Promise.all([
        repository.listInventoryAssets(organizationId, (query.page - 1) * query.pageSize, query.pageSize, filters),
        repository.countInventoryAssets(organizationId, filters),
    ]);

    return {
        rows,
        pagination: {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages: Math.ceil(total / query.pageSize),
        },
    };
};

export const getInventoryAsset = async (organizationId: string, id: string) => {
    const asset = await repository.findInventoryAsset(organizationId, id);
    if (!asset) throw new NotFoundError("Inventory record not found.");
    return asset;
};

export const createInventoryAsset = async (organizationId: string, input: InventoryAssetInput) => {
    try {
        return await repository.createInventoryAsset({
            organizationId,
            type: input.type,
            code: input.code,
            name: input.name,
            quantity: new Prisma.Decimal(input.quantity),
            price: new Prisma.Decimal(input.price),
            description: input.description ?? null,
            imageUrl: input.imageUrl ?? null,
        });
    } catch (error) {
        return mapUniqueConflict(error);
    }
};

export const updateInventoryAsset = async (organizationId: string, id: string, input: InventoryAssetUpdate) => {
    if (!(await repository.findInventoryAsset(organizationId, id))) throw new NotFoundError("Inventory record not found.");

    const data: Prisma.InventoryAssetUpdateManyMutationInput = {
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.quantity !== undefined ? { quantity: new Prisma.Decimal(input.quantity) } : {}),
        ...(input.price !== undefined ? { price: new Prisma.Decimal(input.price) } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
    };

    try {
        const updated = await repository.updateInventoryAsset(organizationId, id, data);
        if (!updated.count) throw new NotFoundError("Inventory record not found.");
        return await repository.findInventoryAsset(organizationId, id);
    } catch (error) {
        return mapUniqueConflict(error);
    }
};

export const deactivateInventoryAsset = async (organizationId: string, id: string) => {
    const result = await repository.deactivateInventoryAsset(organizationId, id);
    if (!result.count) throw new NotFoundError("Inventory record not found.");
    return { id, isActive: false };
};
