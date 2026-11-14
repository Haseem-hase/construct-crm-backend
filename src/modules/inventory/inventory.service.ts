import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import prisma from "../../lib/prisma";
import { BadRequestError } from "../../errors/BadRequestError";
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

export const createInventoryAsset = async (organizationId: string, input: InventoryAssetInput, actorId?: string) => {
    try {
        const warehouse = await ensureMainWarehouse(organizationId);
        return await prisma.$transaction(async tx => {
            const asset = await tx.inventoryAsset.create({ data: {
                organizationId,
                type: input.type,
                code: input.code,
                name: input.name,
                quantity: new Prisma.Decimal(input.quantity),
                price: new Prisma.Decimal(input.price),
                description: input.description ?? null,
                imageUrl: input.imageUrl ?? null,
            } });
            await tx.inventoryWarehouseStock.create({
                data: { organizationId, assetId: asset.id, warehouseId: warehouse.id, onHandQty: new Prisma.Decimal(input.quantity) },
            });
            if (actorId && new Prisma.Decimal(input.quantity).isPositive()) {
                await tx.inventoryStockMovement.create({
                    data: { organizationId, assetId: asset.id, warehouseId: warehouse.id, type: "RECEIPT", quantityDelta: new Prisma.Decimal(input.quantity), reason: "Opening stock received", actorId },
                });
            }
            return asset;
        });
    } catch (error) {
        return mapUniqueConflict(error);
    }
};

export const updateInventoryAsset = async (organizationId: string, id: string, input: InventoryAssetUpdate, actorId?: string) => {
    const existing = await repository.findInventoryAsset(organizationId, id);
    if (!existing) throw new NotFoundError("Inventory record not found.");

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
        return await prisma.$transaction(async tx => {
            if (input.quantity !== undefined) {
                const nextQty = new Prisma.Decimal(input.quantity);
                const delta = nextQty.minus(existing.quantity);
                if (!delta.isZero()) {
                    const warehouse = await tx.inventoryWarehouse.findFirst({ where: { organizationId, isDefault: true, isActive: true } });
                    if (!warehouse) throw new BadRequestError("Create a default warehouse before changing stock.");
                    const stock = await tx.inventoryWarehouseStock.upsert({
                        where: { organizationId_assetId_warehouseId: { organizationId, assetId: id, warehouseId: warehouse.id } },
                        create: { organizationId, assetId: id, warehouseId: warehouse.id },
                        update: {},
                    });
                    const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
                    if (delta.isNegative() && available.lessThan(delta.abs())) {
                        throw new BadRequestError("The default warehouse does not have enough unreserved stock for this quantity change. Use a stock adjustment for a specific warehouse.");
                    }
                    await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { onHandQty: { increment: delta } } });
                    if (actorId) await tx.inventoryStockMovement.create({
                        data: {
                            organizationId, assetId: id, warehouseId: warehouse.id,
                            type: delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
                            quantityDelta: delta, reason: "Inventory quantity updated", actorId,
                        },
                    });
                }
            }
            const updated = await tx.inventoryAsset.updateMany({ where: { id, organizationId, isActive: true }, data });
            if (!updated.count) throw new NotFoundError("Inventory record not found.");
            return tx.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
        return mapUniqueConflict(error);
    }
};

export const deactivateInventoryAsset = async (organizationId: string, id: string) => {
    const result = await repository.deactivateInventoryAsset(organizationId, id);
    if (!result.count) throw new NotFoundError("Inventory record not found.");
    return { id, isActive: false };
};

export const ensureMainWarehouse = async (organizationId: string) => {
    const existing = await prisma.inventoryWarehouse.findFirst({
        where: { organizationId, isDefault: true, isActive: true },
    });
    if (existing) return existing;
    try {
        return await prisma.inventoryWarehouse.create({
            data: { organizationId, code: "MAIN", name: "Main Warehouse", type: "CENTRAL", isDefault: true },
        });
    } catch (error) {
        const raced = await prisma.inventoryWarehouse.findFirst({ where: { organizationId, isDefault: true, isActive: true } });
        if (raced) return raced;
        throw error;
    }
};

export const listInventoryWarehouses = async (organizationId: string) => {
    await ensureMainWarehouse(organizationId);
    return prisma.inventoryWarehouse.findMany({
        where: { organizationId, isActive: true },
        include: { _count: { select: { stocks: true } }, project: { select: { id: true, name: true, projectCode: true } } },
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });
};

export const createInventoryWarehouse = async (organizationId: string, input: {
    code: string; name: string; type: "CENTRAL" | "PROJECT_SITE"; projectId?: string; address?: string | null;
}) => {
    if (input.type === "PROJECT_SITE" && !input.projectId) throw new BadRequestError("Select the project served by this site warehouse.");
    if (input.type === "CENTRAL" && input.projectId) throw new BadRequestError("Central warehouses cannot be linked to a project.");
    if (input.projectId) {
        const project = await prisma.project.findFirst({ where: { id: input.projectId, organizationId }, select: { id: true } });
        if (!project) throw new BadRequestError("The selected project does not belong to this organization.");
    }
    try {
        return await prisma.inventoryWarehouse.create({ data: { organizationId, ...input } });
    } catch (error) {
        return mapUniqueConflict(error);
    }
};

export const listWarehouseStock = async (organizationId: string, warehouseId?: string, search?: string) => {
    const rows = await prisma.inventoryWarehouseStock.findMany({
        where: {
            organizationId,
            warehouse: { organizationId, isActive: true },
            asset: { organizationId, isActive: true, ...(search ? { OR: [
                { name: { contains: search, mode: "insensitive" } },
                { code: { contains: search, mode: "insensitive" } },
            ] } : {}) },
            ...(warehouseId ? { warehouseId } : {}),
        },
        include: { asset: true, warehouse: true },
        orderBy: [{ asset: { type: "asc" } }, { asset: { name: "asc" } }],
    });
    return rows.map(row => ({
        ...row,
        availableQty: row.onHandQty.minus(row.reservedQty).minus(row.maintenanceQty).toString(),
    }));
};

export const adjustWarehouseStock = async (organizationId: string, actorId: string, input: {
    assetId: string; warehouseId: string; quantityDelta: string; reason: string;
}) => {
    const delta = new Prisma.Decimal(input.quantityDelta);
    return prisma.$transaction(async tx => {
        const [asset, warehouse] = await Promise.all([
            tx.inventoryAsset.findFirst({ where: { id: input.assetId, organizationId, isActive: true } }),
            tx.inventoryWarehouse.findFirst({ where: { id: input.warehouseId, organizationId, isActive: true } }),
        ]);
        if (!asset) throw new NotFoundError("Inventory item not found.");
        if (!warehouse) throw new NotFoundError("Warehouse not found.");

        const stock = await tx.inventoryWarehouseStock.upsert({
            where: { organizationId_assetId_warehouseId: { organizationId, assetId: input.assetId, warehouseId: input.warehouseId } },
            create: { organizationId, assetId: input.assetId, warehouseId: input.warehouseId },
            update: {},
        });
        const nextOnHand = stock.onHandQty.plus(delta);
        const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
        if (nextOnHand.isNegative() || (delta.isNegative() && available.lessThan(delta.abs()))) {
            throw new BadRequestError("This adjustment would reduce stock below the quantity already reserved or under maintenance.");
        }

        await tx.inventoryWarehouseStock.update({
            where: { id: stock.id },
            data: { onHandQty: { increment: delta } },
        });
        await tx.inventoryAsset.update({ where: { id: asset.id }, data: { quantity: { increment: delta } } });
        await tx.inventoryStockMovement.create({
            data: {
                organizationId, assetId: asset.id, warehouseId: warehouse.id,
                type: delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
                quantityDelta: delta, reason: input.reason, actorId,
            },
        });
        return { ...stock, onHandQty: nextOnHand, availableQty: nextOnHand.minus(stock.reservedQty).minus(stock.maintenanceQty).toString(), reason: input.reason };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
};

/** Use the trusted inventory tenant for request and warehouse project selectors. */
export const getInventoryRequestOptions = async (organizationId: string) => {
    const [projects, labourAssignments] = await Promise.all([
        prisma.project.findMany({
            where: { organizationId },
            select: { id: true, name: true, projectCode: true },
            orderBy: { name: "asc" },
        }),
        prisma.labourAssignment.findMany({
            where: { status: "ACTIVE", assignment: { project: { organizationId } } },
            select: {
                id: true, status: true,
                labour: { select: { fullName: true } },
                assignment: { select: {
                    project: { select: { id: true } },
                    contractor: { select: { fullName: true } },
                } },
            },
        }),
    ]);
    return { projects, labourAssignments };
};
