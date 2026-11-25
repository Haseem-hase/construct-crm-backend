// Study: Apply business rules and coordinate database operations for inventory assets, warehouse stock, requests, returns, and condition reports.
// Study: Import `{ Prisma }` from `"@prisma/client"`.
import { Prisma } from "@prisma/client";
// Study: Import `{ randomUUID }` from `"crypto"`.
import { randomUUID } from "crypto";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `* as repository` from `"./inventory.repository"`.
import * as repository from "./inventory.repository";
// Study: Import `{ InventoryAssetInput, InventoryAssetListQuery, InventoryAssetUpdate }` from `"./inventory.validation"`.
import { InventoryAssetInput, InventoryAssetListQuery, InventoryAssetUpdate } from "./inventory.validation";

// Study: Define `mapUniqueConflict` as a reusable function.
const mapUniqueConflict = (error: unknown): never => {
    // Study: Run the following branch when `error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"` is truthy.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        // Study: Stop this execution path by throwing `new ConflictError("That inventory code is already in use by your organization.")`.
        throw new ConflictError("That inventory code is already in use by your organization.");
    // Study: Close the code block.
    }
    // Study: Stop this execution path by throwing `error`.
    throw error;
// Study: Close the code block.
};

// Study: Export `listInventoryAssets` as an async function that returns a promise.
export const listInventoryAssets = async (organizationId: string, query: InventoryAssetListQuery) => {
    // Study: Build the object `filters` with the entries below.
    const filters = { type: query.type, search: query.search };
    // Study: Run the listed asynchronous operations together and collect their results in order and wait for it to finish and store its result in `[rows, total]`.
    const [rows, total] = await Promise.all([
        // Study: Call `repository.listInventoryAssets`.
        repository.listInventoryAssets(organizationId, (query.page - 1) * query.pageSize, query.pageSize, filters),
        // Study: Call `repository.countInventoryAssets`.
        repository.countInventoryAssets(organizationId, filters),
    // Study: Close the array literal.
    ]);

    // Study: Return `{ rows, pagination: { page: query.page, pageSize: query.pageSize, total, totalPages…` to the caller.
    return {
        // Study: Pass the current `rows` value under the same property name.
        rows,
        // Study: Start the nested value for `pagination`.
        pagination: {
            // Study: Set `page` to `query.page`.
            page: query.page,
            // Study: Set `pageSize` to `query.pageSize`.
            pageSize: query.pageSize,
            // Study: Pass the current `total` value under the same property name.
            total,
            // Study: Set `totalPages` to `Math.ceil(total / query.pageSize)`.
            totalPages: Math.ceil(total / query.pageSize),
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    };
// Study: Close the code block.
};

// Study: Export `getInventoryAsset` as an async function that returns a promise.
export const getInventoryAsset = async (organizationId: string, id: string) => {
    // Study: Call `repository.findInventoryAsset` and wait for it to finish and store its result in `asset`.
    const asset = await repository.findInventoryAsset(organizationId, id);
    // Study: Run the following branch when `!asset` is truthy and throw `new NotFoundError("Inventory record not found.")`.
    if (!asset) throw new NotFoundError("Inventory record not found.");
    // Study: Return `asset` to the caller.
    return asset;
// Study: Close the code block.
};

// Study: Export `createInventoryAsset` as an async function that returns a promise.
export const createInventoryAsset = async (organizationId: string, input: InventoryAssetInput, actorId?: string) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `ensureMainWarehouse` and wait for it to finish and store its result in `warehouse`.
        const warehouse = await ensureMainWarehouse(organizationId);
        // Study: Return `await prisma.$transaction(async tx => { const asset = await tx.inventoryAsset.creat…` to the caller.
        return await prisma.$transaction(async tx => {
            // Study: Insert a new record through `tx.inventoryAsset` and wait for it to finish and store its result in `asset`.
            const asset = await tx.inventoryAsset.create({ data: {
                // Study: Pass the current `organizationId` value under the same property name.
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
            // Study: Close this group and continue the enclosing expression.
            } });
            // Study: Insert a new record through `tx.inventoryWarehouseStock` and wait for it to finish.
            await tx.inventoryWarehouseStock.create({
                // Study: Supply the values to write to the database.
                data: { organizationId, assetId: asset.id, warehouseId: warehouse.id, onHandQty: new Prisma.Decimal(input.quantity) },
            // Study: Close the object literal.
            });
            // Study: Run the following branch when `actorId && new Prisma.Decimal(input.quantity).isPositive()` is truthy.
            if (actorId && new Prisma.Decimal(input.quantity).isPositive()) {
                // Study: Insert a new record through `tx.inventoryStockMovement` and wait for it to finish.
                await tx.inventoryStockMovement.create({
                    // Study: Supply the values to write to the database.
                    data: { organizationId, assetId: asset.id, warehouseId: warehouse.id, type: "RECEIPT", quantityDelta: new Prisma.Decimal(input.quantity), reason: "Opening stock received", actorId },
                // Study: Close the object literal.
                });
            // Study: Close the code block.
            }
            // Study: Return `asset` to the caller.
            return asset;
        // Study: Close the code block.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Return `mapUniqueConflict(error)` to the caller.
        return mapUniqueConflict(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `updateInventoryAsset` as an async function that returns a promise.
export const updateInventoryAsset = async (organizationId: string, id: string, input: InventoryAssetUpdate, actorId?: string) => {
    // Study: Call `repository.findInventoryAsset` and wait for it to finish and store its result in `existing`.
    const existing = await repository.findInventoryAsset(organizationId, id);
    // Study: Run the following branch when `!existing` is truthy and throw `new NotFoundError("Inventory record not found.")`.
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
    // Study: Close the object literal.
    };

    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Return `await prisma.$transaction(async tx => { if (input.quantity !== undefined) { const n…` to the caller.
        return await prisma.$transaction(async tx => {
            // Study: Run the following branch when `input.quantity !== undefined` is truthy.
            if (input.quantity !== undefined) {
                // Study: Create an instance of `Prisma.Decimal` and store the result as `nextQty`.
                const nextQty = new Prisma.Decimal(input.quantity);
                // Study: Call `nextQty.minus` and store the result as `delta`.
                const delta = nextQty.minus(existing.quantity);
                // Study: Run the following branch when `!delta.isZero()` is truthy.
                if (!delta.isZero()) {
                    // Study: Fetch the first record that matches the filters through `tx.inventoryWarehouse` and wait for it to finish and store its result in `warehouse`.
                    const warehouse = await tx.inventoryWarehouse.findFirst({ where: { organizationId, isDefault: true, isActive: true } });
                    // Study: Run the following branch when `!warehouse` is truthy and throw `new BadRequestError("Create a default warehouse before changing stock.")`.
                    if (!warehouse) throw new BadRequestError("Create a default warehouse before changing stock.");
                    // Study: Update the matching record or create it if it is missing through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
                    const stock = await tx.inventoryWarehouseStock.upsert({
                        // Study: Set the conditions that database records must match using organizationId_assetId_warehouseId.
                        where: { organizationId_assetId_warehouseId: { organizationId, assetId: id, warehouseId: warehouse.id } },
                        // Study: Start the nested value for `create`.
                        create: { organizationId, assetId: id, warehouseId: warehouse.id },
                        // Study: Start the nested value for `update`.
                        update: {},
                    // Study: Close the object literal.
                    });
                    // Study: Call `stock.onHandQty.minus(stock.reservedQty).minus` and store the result as `available`.
                    const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
                    // Study: Run the following branch when `delta.isNegative() && available.lessThan(delta.abs())` is truthy.
                    if (delta.isNegative() && available.lessThan(delta.abs())) {
                        // Study: Stop this execution path by throwing `new BadRequestError("The default warehouse does not have enough unreserved stock fo…`.
                        throw new BadRequestError("The default warehouse does not have enough unreserved stock for this quantity change. Use a stock adjustment for a specific warehouse.");
                    // Study: Close the code block.
                    }
                    // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
                    await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { onHandQty: { increment: delta } } });
                    // Study: Run the following branch when `actorId` is truthy.
                    if (actorId) await tx.inventoryStockMovement.create({
                        // Study: Supply the values to write to the database.
                        data: {
                            // Study: Pass the current `organizationId` value under the same property name.
                            organizationId, assetId: id, warehouseId: warehouse.id,
                            // Study: Set `type` to `delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT"`.
                            type: delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
                            // Study: Set `quantityDelta` to `delta`.
                            quantityDelta: delta, reason: "Inventory quantity updated", actorId,
                        // Study: Close the object literal.
                        },
                    // Study: Close the object literal.
                    });
                // Study: Close the code block.
                }
            // Study: Close the code block.
            }
            // Study: Update all records matching the filters through `tx.inventoryAsset` and wait for it to finish and store its result in `updated`.
            const updated = await tx.inventoryAsset.updateMany({ where: { id, organizationId, isActive: true }, data });
            // Study: Run the following branch when `!updated.count` is truthy and throw `new NotFoundError("Inventory record not found.")`.
            if (!updated.count) throw new NotFoundError("Inventory record not found.");
            // Study: Return `tx.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } })` to the caller.
            return tx.inventoryAsset.findFirst({ where: { id, organizationId, isActive: true } });
        // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Return `mapUniqueConflict(error)` to the caller.
        return mapUniqueConflict(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `deactivateInventoryAsset` as an async function that returns a promise.
export const deactivateInventoryAsset = async (organizationId: string, id: string) => {
    // Study: Call `repository.deactivateInventoryAsset` and wait for it to finish and store its result in `result`.
    const result = await repository.deactivateInventoryAsset(organizationId, id);
    // Study: Run the following branch when `!result.count` is truthy and throw `new NotFoundError("Inventory record not found.")`.
    if (!result.count) throw new NotFoundError("Inventory record not found.");
    // Study: Return `{ id, isActive: false }` to the caller.
    return { id, isActive: false };
// Study: Close the code block.
};

// Study: Export `ensureMainWarehouse` as an async function that returns a promise.
export const ensureMainWarehouse = async (organizationId: string) => {
    // Study: Fetch the first record that matches the filters through `prisma.inventoryWarehouse` and wait for it to finish and store its result in `existing`.
    const existing = await prisma.inventoryWarehouse.findFirst({
        // Study: Set the conditions that database records must match using organizationId, isDefault, isActive.
        where: { organizationId, isDefault: true, isActive: true },
    // Study: Close the object literal.
    });
    // Study: Run the following branch when `existing` is truthy and exit the function.
    if (existing) return existing;
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Return `await prisma.inventoryWarehouse.create({ data: { organizationId, code: "MAIN", name…` to the caller.
        return await prisma.inventoryWarehouse.create({
            // Study: Supply the values to write to the database.
            data: { organizationId, code: "MAIN", name: "Main Warehouse", type: "CENTRAL", isDefault: true },
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Fetch the first record that matches the filters through `prisma.inventoryWarehouse` and wait for it to finish and store its result in `raced`.
        const raced = await prisma.inventoryWarehouse.findFirst({ where: { organizationId, isDefault: true, isActive: true } });
        // Study: Run the following branch when `raced` is truthy and exit the function.
        if (raced) return raced;
        // Study: Stop this execution path by throwing `error`.
        throw error;
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `listInventoryWarehouses` as an async function that returns a promise.
export const listInventoryWarehouses = async (organizationId: string) => {
    // Study: Call `ensureMainWarehouse` and wait for it to finish.
    await ensureMainWarehouse(organizationId);
    // Study: Return `prisma.inventoryWarehouse.findMany({ where: { organizationId, isActive: true }, inc…` to the caller.
    return prisma.inventoryWarehouse.findMany({
        // Study: Set the conditions that database records must match using organizationId, isActive.
        where: { organizationId, isActive: true },
        // Study: Load related database records with the main result.
        include: { _count: { select: { stocks: true } }, project: { select: { id: true, name: true, projectCode: true } } },
        // Study: Set the sort order for the returned records.
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `createInventoryWarehouse` as an async function that returns a promise.
export const createInventoryWarehouse = async (organizationId: string, input: {
    // Study: Define `code` with type `string`.
    code: string; name: string; type: "CENTRAL" | "PROJECT_SITE"; projectId?: string; address?: string | null;
// Study: Close this group and continue the enclosing expression.
}) => {
    // Study: Run the following branch when `input.type === "PROJECT_SITE" && !input.projectId` is truthy and throw `new BadRequestError("Select the project served by this site warehouse.")`.
    if (input.type === "PROJECT_SITE" && !input.projectId) throw new BadRequestError("Select the project served by this site warehouse.");
    // Study: Run the following branch when `input.type === "CENTRAL" && input.projectId` is truthy and throw `new BadRequestError("Central warehouses cannot be linked to a project.")`.
    if (input.type === "CENTRAL" && input.projectId) throw new BadRequestError("Central warehouses cannot be linked to a project.");
    // Study: Run the following branch when `input.projectId` is truthy.
    if (input.projectId) {
        // Study: Fetch the first record that matches the filters through `prisma.project` and wait for it to finish and store its result in `project`.
        const project = await prisma.project.findFirst({ where: { id: input.projectId, organizationId }, select: { id: true } });
        // Study: Run the following branch when `!project` is truthy and throw `new BadRequestError("The selected project does not belong to this organization.")`.
        if (!project) throw new BadRequestError("The selected project does not belong to this organization.");
    // Study: Close the code block.
    }
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Return `await prisma.inventoryWarehouse.create({ data: { organizationId, ...input } })` to the caller.
        return await prisma.inventoryWarehouse.create({ data: { organizationId, ...input } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Return `mapUniqueConflict(error)` to the caller.
        return mapUniqueConflict(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `listWarehouseStock` as an async function that returns a promise.
export const listWarehouseStock = async (organizationId: string, warehouseId?: string, search?: string) => {
    // Study: Fetch records matching the query through `prisma.inventoryWarehouseStock` and wait for it to finish and store its result in `rows`.
    const rows = await prisma.inventoryWarehouseStock.findMany({
        // Study: Set the conditions that database records must match using organizationId, warehouse, asset.
        where: {
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
            // Study: Start the nested value for `warehouse`.
            warehouse: { organizationId, isActive: true },
            // Study: Start the nested value for `asset`.
            asset: { organizationId, isActive: true, ...(search ? { OR: [
                // Study: Start the object passed to the surrounding expression.
                { name: { contains: search, mode: "insensitive" } },
                // Study: Start the object passed to the surrounding expression.
                { code: { contains: search, mode: "insensitive" } },
            // Study: Close this group and continue the enclosing expression.
            ] } : {}) },
            // Study: Expand the values from `(warehouseId ? { warehouseId } : {})` into the surrounding collection.
            ...(warehouseId ? { warehouseId } : {}),
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: { asset: true, warehouse: true },
        // Study: Set the sort order for the returned records.
        orderBy: [{ asset: { type: "asc" } }, { asset: { name: "asc" } }],
    // Study: Close the object literal.
    });
    // Study: Return `rows.map(row => ({ ...row, availableQty: row.onHandQty.minus(row.reservedQty).minus…` to the caller.
    return rows.map(row => ({
        // Study: Expand the values from `row` into the surrounding collection.
        ...row,
        // Study: Set `availableQty` to `row.onHandQty.minus(row.reservedQty).minus(row.maintenanceQty).toString()`.
        availableQty: row.onHandQty.minus(row.reservedQty).minus(row.maintenanceQty).toString(),
    // Study: Close the object literal.
    }));
// Study: Close the code block.
};

// Study: Export `adjustWarehouseStock` as an async function that returns a promise.
export const adjustWarehouseStock = async (organizationId: string, actorId: string, input: {
    // Study: Define `assetId` with type `string`.
    assetId: string; warehouseId: string; quantityDelta: string; reason: string;
// Study: Close this group and continue the enclosing expression.
}) => {
    // Study: Create an instance of `Prisma.Decimal` and store the result as `delta`.
    const delta = new Prisma.Decimal(input.quantityDelta);
    // Study: Return `prisma.$transaction(async tx => { const [asset, warehouse] = await Promise.all([ tx…` to the caller.
    return prisma.$transaction(async tx => {
        // Study: Run the listed asynchronous operations together and collect their results in order and wait for it to finish and store its result in `[asset, warehouse]`.
        const [asset, warehouse] = await Promise.all([
            // Study: Fetch the first record that matches the filters through `tx.inventoryAsset`.
            tx.inventoryAsset.findFirst({ where: { id: input.assetId, organizationId, isActive: true } }),
            // Study: Fetch the first record that matches the filters through `tx.inventoryWarehouse`.
            tx.inventoryWarehouse.findFirst({ where: { id: input.warehouseId, organizationId, isActive: true } }),
        // Study: Close the array literal.
        ]);
        // Study: Run the following branch when `!asset` is truthy and throw `new NotFoundError("Inventory item not found.")`.
        if (!asset) throw new NotFoundError("Inventory item not found.");
        // Study: Run the following branch when `!warehouse` is truthy and throw `new NotFoundError("Warehouse not found.")`.
        if (!warehouse) throw new NotFoundError("Warehouse not found.");

        // Study: Update the matching record or create it if it is missing through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
        const stock = await tx.inventoryWarehouseStock.upsert({
            // Study: Set the conditions that database records must match using organizationId_assetId_warehouseId.
            where: { organizationId_assetId_warehouseId: { organizationId, assetId: input.assetId, warehouseId: input.warehouseId } },
            // Study: Start the nested value for `create`.
            create: { organizationId, assetId: input.assetId, warehouseId: input.warehouseId },
            // Study: Start the nested value for `update`.
            update: {},
        // Study: Close the object literal.
        });
        // Study: Call `stock.onHandQty.plus` and store the result as `nextOnHand`.
        const nextOnHand = stock.onHandQty.plus(delta);
        // Study: Call `stock.onHandQty.minus(stock.reservedQty).minus` and store the result as `available`.
        const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
        // Study: Run the following branch when `nextOnHand.isNegative() || (delta.isNegative() && available.lessThan(delta.abs()))` is truthy.
        if (nextOnHand.isNegative() || (delta.isNegative() && available.lessThan(delta.abs()))) {
            // Study: Stop this execution path by throwing `new BadRequestError("This adjustment would reduce stock below the quantity already …`.
            throw new BadRequestError("This adjustment would reduce stock below the quantity already reserved or under maintenance.");
        // Study: Close the code block.
        }

        // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
        await tx.inventoryWarehouseStock.update({
            // Study: Set the conditions that database records must match using id.
            where: { id: stock.id },
            // Study: Supply the values to write to the database.
            data: { onHandQty: { increment: delta } },
        // Study: Close the object literal.
        });
        // Study: Update the uniquely identified record through `tx.inventoryAsset` and wait for it to finish.
        await tx.inventoryAsset.update({ where: { id: asset.id }, data: { quantity: { increment: delta } } });
        // Study: Insert a new record through `tx.inventoryStockMovement` and wait for it to finish.
        await tx.inventoryStockMovement.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId, assetId: asset.id, warehouseId: warehouse.id,
                // Study: Set `type` to `delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT"`.
                type: delta.isPositive() ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
                // Study: Set `quantityDelta` to `delta`.
                quantityDelta: delta, reason: input.reason, actorId,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });
        // Study: Return `{ ...stock, onHandQty: nextOnHand, availableQty: nextOnHand.minus(stock.reservedQty…` to the caller.
        return { ...stock, onHandQty: nextOnHand, availableQty: nextOnHand.minus(stock.reservedQty).minus(stock.maintenanceQty).toString(), reason: input.reason };
    // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
// Study: Close the code block.
};

/** Use the trusted inventory tenant for request and warehouse project selectors. */
// Study: Export `getInventoryRequestOptions` as an async function that returns a promise.
export const getInventoryRequestOptions = async (organizationId: string) => {
    // Study: Run the listed asynchronous operations together and collect their results in order and wait for it to finish and store its result in `[projects, labourAssignments]`.
    const [projects, labourAssignments] = await Promise.all([
        // Study: Fetch records matching the query through `prisma.project`.
        prisma.project.findMany({
            // Study: Set the conditions that database records must match using organizationId.
            where: { organizationId },
            // Study: Choose which fields Prisma returns.
            select: { id: true, name: true, projectCode: true },
            // Study: Set the sort order for the returned records.
            orderBy: { name: "asc" },
        // Study: Close the object literal.
        }),
        // Study: Fetch records matching the query through `prisma.labourAssignment`.
        prisma.labourAssignment.findMany({
            // Study: Set the conditions that database records must match using status, assignment.
            where: { status: "ACTIVE", assignment: { project: { organizationId } } },
            // Study: Choose which fields Prisma returns.
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
                // Study: Close this group and continue the enclosing expression.
                } },
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        }),
    // Study: Close the array literal.
    ]);
    // Study: Return `{ projects, labourAssignments }` to the caller.
    return { projects, labourAssignments };
// Study: Close the code block.
};
