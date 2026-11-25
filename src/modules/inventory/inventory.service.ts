// Study: This file is about tools, equipment, and materials that warehouses store, issue, and take back. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";
// Study: Bring in `{ randomUUID }` from `"crypto"` so this file can use it.
import { randomUUID } from "crypto";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `* as repository` from `"./inventory.repository"` so this file can use it.
import * as repository from "./inventory.repository";
// Study: Bring in `{ InventoryAssetInput, InventoryAssetListQuery, InventoryAssetUpdate }` from `"./inventory.validation"` so this file can use it.
import { InventoryAssetInput, InventoryAssetListQuery, InventoryAssetUpdate } from "./inventory.validation";

// Study: Set up a reusable step named `mapUniqueConflict`.
const mapUniqueConflict = (error: unknown): never => {
    // Study: Do the next step if this check passes: `error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"`.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        // Study: Stop here and report this problem: "That inventory code is already in use by your organization."
        throw new ConflictError("That inventory code is already in use by your organization.");
    // Study: End this group of steps.
    }
    // Study: Stop here and pass the problem onward: `error`.
    throw error;
// Study: End this group of steps.
};

// Study: Make `listInventoryAssets` available to other files. Its result arrives after its work finishes.
export const listInventoryAssets = async (organizationId: string, query: InventoryAssetListQuery) => {
    // Study: Build the object `filters` with the entries below.
    const filters = { type: query.type, search: query.search };
    // Study: Run the listed asynchronous operations together and collect their results in order and wait for it to finish and store its result in `[rows, total]`.
    const [rows, total] = await Promise.all([
        // Study: Call `repository.listInventoryAssets`.
        repository.listInventoryAssets(organizationId, (query.page - 1) * query.pageSize, query.pageSize, filters),
        // Study: Call `repository.countInventoryAssets`.
        repository.countInventoryAssets(organizationId, filters),
    // Study: End this group of values.
    ]);

    // Study: Give `{ rows, pagination: { page: query.page, pageSize: query.pageSize, total, totalPages…` back to the code that asked for it.
    return {
        // Study: Carry the value of `rows` into the new group under the same name.
        rows,
        // Study: Start the nested value for `pagination`.
        pagination: {
            // Study: Set `page` to `query.page`.
            page: query.page,
            // Study: Set `pageSize` to `query.pageSize`.
            pageSize: query.pageSize,
            // Study: Carry the value of `total` into the new group under the same name.
            total,
            // Study: Set `totalPages` to `Math.ceil(total / query.pageSize)`.
            totalPages: Math.ceil(total / query.pageSize),
        // Study: End this group of values.
        },
    // Study: End this group of values.
    };
// Study: End this group of steps.
};

// Study: Make `getInventoryAsset` available to other files. Its result arrives after its work finishes.
export const getInventoryAsset = async (organizationId: string, id: string) => {
    // Study: Call `repository.findInventoryAsset` and wait for it to finish and store its result in `asset`.
    const asset = await repository.findInventoryAsset(organizationId, id);
    // Study: Do the next step if there is no value for `asset` . If so, stop and report "Inventory record not found."
    if (!asset) throw new NotFoundError("Inventory record not found.");
    // Study: Give `asset` back to the code that asked for it.
    return asset;
// Study: End this group of steps.
};

// Study: Make `createInventoryAsset` available to other files. Its result arrives after its work finishes.
export const createInventoryAsset = async (organizationId: string, input: InventoryAssetInput, actorId?: string) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `ensureMainWarehouse` and wait for it to finish and store its result in `warehouse`.
        const warehouse = await ensureMainWarehouse(organizationId);
        // Study: Give `await prisma.$transaction(async tx => { const asset = await tx.inventoryAsset.creat…` back to the code that asked for it.
        return await prisma.$transaction(async tx => {
            // Study: Insert a new record through `tx.inventoryAsset` and wait for it to finish and store its result in `asset`.
            const asset = await tx.inventoryAsset.create({ data: {
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
                // Study: Set `type` to `input.type`.
                type: input.type,
                // Study: Set `code` to `input.code`.
                code: input.code,
                // Study: Set `name` to `input.name`.
                name: input.name,
                // Study: Set `quantity` to `new Prisma.Decimal(input.quantity)`.
                quantity: new Prisma.Decimal(input.quantity),
                // Study: Set `price` to `new Prisma.Decimal(input.price)`.
                price: new Prisma.Decimal(input.price),
                // Study: Set `description` to `input.description ?? null`.
                description: input.description ?? null,
                // Study: Set `imageUrl` to `input.imageUrl ?? null`.
                imageUrl: input.imageUrl ?? null,
            // Study: Finish this group and continue the surrounding step.
            } });
            // Study: Insert a new record through `tx.inventoryWarehouseStock` and wait for it to finish.
            await tx.inventoryWarehouseStock.create({
                // Study: Supply the values to write to the database.
                data: { organizationId, assetId: asset.id, warehouseId: warehouse.id, onHandQty: new Prisma.Decimal(input.quantity) },
            // Study: End this group of values.
            });
            // Study: Do the next step if this check passes: `actorId && new Prisma.Decimal(input.quantity).isPositive()`.
            if (actorId && new Prisma.Decimal(input.quantity).isPositive()) {
                // Study: Insert a new record through `tx.inventoryStockMovement` and wait for it to finish.
                await tx.inventoryStockMovement.create({
                    // Study: Supply the values to write to the database.
                    data: { organizationId, assetId: asset.id, warehouseId: warehouse.id, type: "RECEIPT", quantityDelta: new Prisma.Decimal(input.quantity), reason: "Opening stock received", actorId },
                // Study: End this group of values.
                });
            // Study: End this group of steps.
            }
            // Study: Give `asset` back to the code that asked for it.
            return asset;
        // Study: End this group of steps.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Give `mapUniqueConflict(error)` back to the code that asked for it.
        return mapUniqueConflict(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `updateInventoryAsset` available to other files. Its result arrives after its work finishes.
export const updateInventoryAsset = async (organizationId: string, id: string, input: InventoryAssetUpdate, actorId?: string) => {
    // Study: Call `repository.findInventoryAsset` and wait for it to finish and store its result in `existing`.
    const existing = await repository.findInventoryAsset(organizationId, id);
    // Study: Do the next step if there is no value for `existing` . If so, stop and report "Inventory record not found."
    if (!existing) throw new NotFoundError("Inventory record not found.");

    // Study: Build the object `data` with the entries below.
    const data: Prisma.InventoryAssetUpdateManyMutationInput = {
        // Study: Expand the values from `(input.type !== undefined ? { type: input.type } : {})` into the surrounding collection.
        ...(input.type !== undefined ? { type: input.type } : {}),
        // Study: Expand the values from `(input.code !== undefined ? { code: input.code } : {})` into the surrounding collection.
        ...(input.code !== undefined ? { code: input.code } : {}),
        // Study: Expand the values from `(input.name !== undefined ? { name: input.name } : {})` into the surrounding collection.
        ...(input.name !== undefined ? { name: input.name } : {}),
        // Study: Expand the values from `(input.quantity !== undefined ? { quantity: new Prisma.Decimal(input.quantity) } : {})` into the surrounding collection.
        ...(input.quantity !== undefined ? { quantity: new Prisma.Decimal(input.quantity) } : {}),
        // Study: Expand the values from `(input.price !== undefined ? { price: new Prisma.Decimal(input.price) } : {})` into the surrounding collection.
        ...(input.price !== undefined ? { price: new Prisma.Decimal(input.price) } : {}),
        // Study: Expand the values from `(input.description !== undefined ? { description: input.description } : {})` into the surrounding collection.
        ...(input.description !== undefined ? { description: input.description } : {}),
        // Study: Expand the values from `(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {})` into the surrounding collection.
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
    // Study: End this group of values.
    };

    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Give `await prisma.$transaction(async tx => { if (input.quantity !== undefined) { const n…` back to the code that asked for it.
        return await prisma.$transaction(async tx => {
            // Study: Do the next step if this check passes: `input.quantity !== undefined`.
            if (input.quantity !== undefined) {
                // Study: Create an instance of `Prisma.Decimal` and store the result as `nextQty`.
                const nextQty = new Prisma.Decimal(input.quantity);
                // Study: Call `nextQty.minus` and store the result as `delta`.
                const delta = nextQty.minus(existing.quantity);
                // Study: Do the next step if this check passes: `!delta.isZero()`.
                if (!delta.isZero()) {
                    // Study: Find the first record that meets these checks using `tx.inventoryWarehouse` and wait for it to finish and store its result in `warehouse`.
                    const warehouse = await tx.inventoryWarehouse.findFirst({ where: { organizationId, isDefault: true, isActive: true } });
                    // Study: Do the next step if there is no value for `warehouse` . If so, stop and report "Create a default warehouse before changing stock."
                    if (!warehouse) throw new BadRequestError("Create a default warehouse before changing stock.");
                    // Study: Update the matching record or create it if it is missing through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
                    const stock = await tx.inventoryWarehouseStock.upsert({
                        // Study: Set the conditions that records must meet using organizationId_assetId_warehouseId.
                        where: { organizationId_assetId_warehouseId: { organizationId, assetId: id, warehouseId: warehouse.id } },
                        // Study: Start the nested value for `create`.
                        create: { organizationId, assetId: id, warehouseId: warehouse.id },
                        // Study: Start the nested value for `update`.
                        update: {},
                    // Study: End this group of values.
                    });
                    // Study: Call `stock.onHandQty.minus(stock.reservedQty).minus` and store the result as `available`.
                    const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
                    // Study: Do the next step if this check passes: `delta.isNegative() && available.lessThan(delta.abs())`.
                    if (delta.isNegative() && available.lessThan(delta.abs())) {
                        // Study: Stop here and pass the problem onward: `new BadRequestError("The default warehouse does not have enough unreserved stock fo…`.
                        throw new BadRequestError("The default warehouse does not have enough unreserved stock for this quantity change. Use a stock adjustment for a specific warehouse.");
                    // Study: End this group of steps.
                    }
                    // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
                    await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { onHandQty: { increment: delta } } });
                    // Study: Do the next step if this check passes: `actorId`.
                    if (actorId) await tx.inventoryStockMovement.create({
                        // Study: Supply the values to write to the database.
                        data: {
                            // Study: Carry the value of `organizationId` into the new group under the same name.
                            organizationId, assetId: id, warehouseId: warehouse.id,
                            // Study: Set `type` to `delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT"`.
                            type: delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
                            // Study: Set `quantityDelta` to `delta`.
                            quantityDelta: delta, reason: "Inventory quantity updated", actorId,
                        // Study: End this group of values.
                        },
                    // Study: End this group of values.
                    });
                // Study: End this group of steps.
                }
            // Study: End this group of steps.
            }
            // Study: Update all records matching the filters through `tx.inventoryAsset` and wait for it to finish and store its result in `updated`.
            const updated = await tx.inventoryAsset.updateMany({ where: { id, organizationId, isActive: true }, data });
            // Study: Do the next step if this check passes: `!updated.count` . If so, stop and report "Inventory record not found."
            if (!updated.count) throw new NotFoundError("Inventory record not found.");
            // Study: Give `tx.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } })` back to the code that asked for it.
            return tx.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } });
        // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Give `mapUniqueConflict(error)` back to the code that asked for it.
        return mapUniqueConflict(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `deactivateInventoryAsset` available to other files. Its result arrives after its work finishes.
export const deactivateInventoryAsset = async (organizationId: string, id: string) => {
    // Study: Call `repository.deactivateInventoryAsset` and wait for it to finish and store its result in `result`.
    const result = await repository.deactivateInventoryAsset(organizationId, id);
    // Study: Do the next step if this check passes: `!result.count` . If so, stop and report "Inventory record not found."
    if (!result.count) throw new NotFoundError("Inventory record not found.");
    // Study: Give `{ id, isActive: false }` back to the code that asked for it.
    return { id, isActive: false };
// Study: End this group of steps.
};

// Study: Make `ensureMainWarehouse` available to other files. Its result arrives after its work finishes.
export const ensureMainWarehouse = async (organizationId: string) => {
    // Study: Find the first record that meets these checks using `prisma.inventoryWarehouse` and wait for it to finish and store its result in `existing`.
    const existing = await prisma.inventoryWarehouse.findFirst({
        // Study: Set the conditions that records must meet using organizationId, isDefault, isActive.
        where: { organizationId, isDefault: true, isActive: true },
    // Study: End this group of values.
    });
    // Study: Do the next step if this check passes: `existing` and exit the function.
    if (existing) return existing;
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Give `await prisma.inventoryWarehouse.create({ data: { organizationId, code: "MAIN", name…` back to the code that asked for it.
        return await prisma.inventoryWarehouse.create({
            // Study: Supply the values to write to the database.
            data: { organizationId, code: "MAIN", name: "Main Warehouse", type: "CENTRAL", isDefault: true },
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Find the first record that meets these checks using `prisma.inventoryWarehouse` and wait for it to finish and store its result in `raced`.
        const raced = await prisma.inventoryWarehouse.findFirst({ where: { organizationId, isDefault: true, isActive: true } });
        // Study: Do the next step if this check passes: `raced` and exit the function.
        if (raced) return raced;
        // Study: Stop here and pass the problem onward: `error`.
        throw error;
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `listInventoryWarehouses` available to other files. Its result arrives after its work finishes.
export const listInventoryWarehouses = async (organizationId: string) => {
    // Study: Call `ensureMainWarehouse` and wait for it to finish.
    await ensureMainWarehouse(organizationId);
    // Study: Give `prisma.inventoryWarehouse.findMany({ where: { organizationId, isActive: true }, inc…` back to the code that asked for it.
    return prisma.inventoryWarehouse.findMany({
        // Study: Set the conditions that records must meet using organizationId, isActive.
        where: { organizationId, isActive: true },
        // Study: Ask for linked information along with the main record.
        include: { _count: { select: { stocks: true } }, project: { select: { id: true, name: true, projectCode: true } } },
        // Study: Set the sort order for the returned records.
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `createInventoryWarehouse` available to other files. Its result arrives after its work finishes.
export const createInventoryWarehouse = async (organizationId: string, input: {
    // Study: Define `code` with type `string`.
    code: string; name: string; type: "CENTRAL" | "PROJECT_SITE"; projectId?: string; address?: string | null;
// Study: Finish this group and continue the surrounding step.
}) => {
    // Study: Do the next step if this check passes: `input.type === "PROJECT_SITE" && !input.projectId` . If so, stop and report "Select the project served by this site warehouse."
    if (input.type === "PROJECT_SITE" && !input.projectId) throw new BadRequestError("Select the project served by this site warehouse.");
    // Study: Do the next step if this check passes: `input.type === "CENTRAL" && input.projectId` . If so, stop and report "Central warehouses cannot be linked to a project."
    if (input.type === "CENTRAL" && input.projectId) throw new BadRequestError("Central warehouses cannot be linked to a project.");
    // Study: Do the next step if this check passes: `input.projectId`.
    if (input.projectId) {
        // Study: Find the first record that meets these checks using `prisma.project` and wait for it to finish and store its result in `project`.
        const project = await prisma.project.findFirst({ where: { id: input.projectId, organizationId }, select: { id: true } });
        // Study: Do the next step if there is no value for `project` . If so, stop and report "The selected project does not belong to this organization."
        if (!project) throw new BadRequestError("The selected project does not belong to this organization.");
    // Study: End this group of steps.
    }
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Give `await prisma.inventoryWarehouse.create({ data: { organizationId, ...input } })` back to the code that asked for it.
        return await prisma.inventoryWarehouse.create({ data: { organizationId, ...input } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Give `mapUniqueConflict(error)` back to the code that asked for it.
        return mapUniqueConflict(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `listWarehouseStock` available to other files. Its result arrives after its work finishes.
export const listWarehouseStock = async (organizationId: string, warehouseId?: string, search?: string) => {
    // Study: Find all matching records using `prisma.inventoryWarehouseStock` and wait for it to finish and store its result in `rows`.
    const rows = await prisma.inventoryWarehouseStock.findMany({
        // Study: Set the conditions that records must meet using organizationId, warehouse, asset.
        where: {
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
            // Study: Start the nested value for `warehouse`.
            warehouse: { organizationId, isActive: true },
            // Study: Start the nested value for `asset`.
            asset: { organizationId, isActive: true, ...(search ? { OR: [
                // Study: Start the object passed to the surrounding expression.
                { name: { contains: search, mode: "insensitive" } },
                // Study: Start the object passed to the surrounding expression.
                { code: { contains: search, mode: "insensitive" } },
            // Study: Finish this group and continue the surrounding step.
            ] } : {}) },
            // Study: Expand the values from `(warehouseId ? { warehouseId } : {})` into the surrounding collection.
            ...(warehouseId ? { warehouseId } : {}),
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: { asset: true, warehouse: true },
        // Study: Set the sort order for the returned records.
        orderBy: [{ asset: { type: "asc" } }, { asset: { name: "asc" } }],
    // Study: End this group of values.
    });
    // Study: Give `rows.map(row => ({ ...row, availableQty: row.onHandQty.minus(row.reservedQty).minus…` back to the code that asked for it.
    return rows.map(row => ({
        // Study: Expand the values from `row` into the surrounding collection.
        ...row,
        // Study: Set `availableQty` to `row.onHandQty.minus(row.reservedQty).minus(row.maintenanceQty).toString()`.
        availableQty: row.onHandQty.minus(row.reservedQty).minus(row.maintenanceQty).toString(),
    // Study: End this group of values.
    }));
// Study: End this group of steps.
};

// Study: Make `adjustWarehouseStock` available to other files. Its result arrives after its work finishes.
export const adjustWarehouseStock = async (organizationId: string, actorId: string, input: {
    // Study: Define `assetId` with type `string`.
    assetId: string; warehouseId: string; quantityDelta: string; reason: string;
// Study: Finish this group and continue the surrounding step.
}) => {
    // Study: Create an instance of `Prisma.Decimal` and store the result as `delta`.
    const delta = new Prisma.Decimal(input.quantityDelta);
    // Study: Give `prisma.$transaction(async tx => { const [asset, warehouse] = await Promise.all([ tx…` back to the code that asked for it.
    return prisma.$transaction(async tx => {
        // Study: Run the listed asynchronous operations together and collect their results in order and wait for it to finish and store its result in `[asset, warehouse]`.
        const [asset, warehouse] = await Promise.all([
            // Study: Find the first record that meets these checks using `tx.inventoryAsset`.
            tx.inventoryAsset.findFirst({ where: { id: input.assetId, organizationId, isActive: true } }),
            // Study: Find the first record that meets these checks using `tx.inventoryWarehouse`.
            tx.inventoryWarehouse.findFirst({ where: { id: input.warehouseId, organizationId, isActive: true } }),
        // Study: End this group of values.
        ]);
        // Study: Do the next step if there is no value for `asset` . If so, stop and report "Inventory item not found."
        if (!asset) throw new NotFoundError("Inventory item not found.");
        // Study: Do the next step if there is no value for `warehouse` . If so, stop and report "Warehouse not found."
        if (!warehouse) throw new NotFoundError("Warehouse not found.");

        // Study: Update the matching record or create it if it is missing through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
        const stock = await tx.inventoryWarehouseStock.upsert({
            // Study: Set the conditions that records must meet using organizationId_assetId_warehouseId.
            where: { organizationId_assetId_warehouseId: { organizationId, assetId: input.assetId, warehouseId: input.warehouseId } },
            // Study: Start the nested value for `create`.
            create: { organizationId, assetId: input.assetId, warehouseId: input.warehouseId },
            // Study: Start the nested value for `update`.
            update: {},
        // Study: End this group of values.
        });
        // Study: Call `stock.onHandQty.plus` and store the result as `nextOnHand`.
        const nextOnHand = stock.onHandQty.plus(delta);
        // Study: Call `stock.onHandQty.minus(stock.reservedQty).minus` and store the result as `available`.
        const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
        // Study: Do the next step if this check passes: `nextOnHand.isNegative() || (delta.isNegative() && available.lessThan(delta.abs()))`.
        if (nextOnHand.isNegative() || (delta.isNegative() && available.lessThan(delta.abs()))) {
            // Study: Stop here and pass the problem onward: `new BadRequestError("This adjustment would reduce stock below the quantity already …`.
            throw new BadRequestError("This adjustment would reduce stock below the quantity already reserved or under maintenance.");
        // Study: End this group of steps.
        }

        // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
        await tx.inventoryWarehouseStock.update({
            // Study: Set the conditions that records must meet using id.
            where: { id: stock.id },
            // Study: Supply the values to write to the database.
            data: { onHandQty: { increment: delta } },
        // Study: End this group of values.
        });
        // Study: Update the uniquely identified record through `tx.inventoryAsset` and wait for it to finish.
        await tx.inventoryAsset.update({ where: { id: asset.id }, data: { quantity: { increment: delta } } });
        // Study: Insert a new record through `tx.inventoryStockMovement` and wait for it to finish.
        await tx.inventoryStockMovement.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId, assetId: asset.id, warehouseId: warehouse.id,
                // Study: Set `type` to `delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT"`.
                type: delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
                // Study: Set `quantityDelta` to `delta`.
                quantityDelta: delta, reason: input.reason, actorId,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });
        // Study: Give `{ ...stock, onHandQty: nextOnHand, availableQty: nextOnHand.minus(stock.reservedQty…` back to the code that asked for it.
        return { ...stock, onHandQty: nextOnHand, availableQty: nextOnHand.minus(stock.reservedQty).minus(stock.maintenanceQty).toString(), reason: input.reason };
    // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
// Study: End this group of steps.
};

/** Use the trusted inventory tenant for request and warehouse project selectors. */
// Study: Make `getInventoryRequestOptions` available to other files. Its result arrives after its work finishes.
export const getInventoryRequestOptions = async (organizationId: string) => {
    // Study: Run the listed asynchronous operations together and collect their results in order and wait for it to finish and store its result in `[projects, labourAssignments]`.
    const [projects, labourAssignments] = await Promise.all([
        // Study: Find all matching records using `prisma.project`.
        prisma.project.findMany({
            // Study: Set the conditions that records must meet using organizationId.
            where: { organizationId },
            // Study: Choose which details the database gives back.
            select: { id: true, name: true, projectCode: true },
            // Study: Set the sort order for the returned records.
            orderBy: { name: "asc" },
        // Study: End this group of values.
        }),
        // Study: Find all matching records using `prisma.labourAssignment`.
        prisma.labourAssignment.findMany({
            // Study: Set the conditions that records must meet using status, assignment.
            where: { status: "ACTIVE", assignment: { project: { organizationId } } },
            // Study: Choose which details the database gives back.
            select: {
                // Study: Set `id` to `true`.
                id: true, status: true,
                // Study: Load `labour` and return its selected fields: fullName.
                labour: { select: { fullName: true } },
                // Study: Load `assignment` and return its selected fields: project, contractor.
                assignment: { select: {
                    // Study: Load `project` and return its selected fields: id.
                    project: { select: { id: true } },
                    // Study: Load `contractor` and return its selected fields: fullName.
                    contractor: { select: { fullName: true } },
                // Study: Finish this group and continue the surrounding step.
                } },
            // Study: End this group of values.
            },
        // Study: End this group of values.
        }),
    // Study: End this group of values.
    ]);
    // Study: Give `{ projects, labourAssignments }` back to the code that asked for it.
    return { projects, labourAssignments };
// Study: End this group of steps.
};
