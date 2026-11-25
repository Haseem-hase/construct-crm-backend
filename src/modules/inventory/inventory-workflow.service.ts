// Study: This file is about tools, equipment, and materials that warehouses store, issue, and take back. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";
// Study: Bring in `{ randomUUID }` from `"crypto"` so this file can use it.
import { randomUUID } from "crypto";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ InventoryConditionReportInput, InventoryRequestInput, InventoryReturnInput }` from `"./inventory.validation"` so this file can use it.
import { InventoryConditionReportInput, InventoryRequestInput, InventoryReturnInput } from "./inventory.validation";

// Study: Set `requestInclude` to `{ project: { select: { id: true, name: true, projectCode: true } }, requestedForLab…`.
const requestInclude = {
    // Study: Load `project` and return its selected fields: id, name, projectCode.
    project: { select: { id: true, name: true, projectCode: true } },
    // Study: Load `requestedForLabourAssignment` and return its selected fields: id, labour, assignment.
    requestedForLabourAssignment: { select: { id: true, labour: { select: { id: true, fullName: true, phone: true } }, assignment: { select: { contractor: { select: { id: true, fullName: true } } } } } },
    // Study: Load `warehouse` and return its selected fields: id, name, code.
    warehouse: { select: { id: true, name: true, code: true } },
    // Study: Load `requestedBy` and return its selected fields: id, fullName, email.
    requestedBy: { select: { id: true, fullName: true, email: true } },
    // Study: Load `reviewedBy` and return its selected fields: id, fullName, email.
    reviewedBy: { select: { id: true, fullName: true, email: true } },
    // Study: Start the nested value for `lines`.
    lines: { include: { asset: { select: { id: true, code: true, name: true, type: true, quantity: true, price: true } } } },
// Study: Ask TypeScript to check this group of information while keeping its exact list of fields.
} satisfies Prisma.InventoryRequestInclude;

// Study: Set `returnInclude` to `{ request: { include: { project: { select: { id: true, name: true, projectCode: tru…`.
const returnInclude = {
    // Study: Start the nested value for `request`.
    request: { include: { project: { select: { id: true, name: true, projectCode: true } } } },
    // Study: Load `warehouse` and return its selected fields: id, name, code.
    warehouse: { select: { id: true, name: true, code: true } },
    // Study: Load `requestedBy` and return its selected fields: id, fullName, email.
    requestedBy: { select: { id: true, fullName: true, email: true } },
    // Study: Load `reviewedBy` and return its selected fields: id, fullName, email.
    reviewedBy: { select: { id: true, fullName: true, email: true } },
    // Study: Start the nested value for `lines`.
    lines: { include: { requestLine: { include: { asset: { select: { id: true, name: true, code: true, type: true } } } } } },
// Study: Ask TypeScript to check this group of information while keeping its exact list of fields.
} satisfies Prisma.InventoryReturnRequestInclude;

// Study: Set `conditionInclude` to `{ asset: { select: { id: true, name: true, code: true, type: true } }, warehouse: {…`.
const conditionInclude = {
    // Study: Load `asset` and return its selected fields: id, name, code, type.
    asset: { select: { id: true, name: true, code: true, type: true } },
    // Study: Load `warehouse` and return its selected fields: id, name, code.
    warehouse: { select: { id: true, name: true, code: true } },
    // Study: Start the nested value for `request`.
    request: { include: { project: { select: { id: true, name: true, projectCode: true } } } },
    // Study: Load `requestLine` and return its selected fields: id, issuedQty, returnedQty.
    requestLine: { select: { id: true, issuedQty: true, returnedQty: true } },
    // Study: Load `reportedBy` and return its selected fields: id, fullName, email.
    reportedBy: { select: { id: true, fullName: true, email: true } },
    // Study: Load `reviewedBy` and return its selected fields: id, fullName, email.
    reviewedBy: { select: { id: true, fullName: true, email: true } },
// Study: Ask TypeScript to check this group of information while keeping its exact list of fields.
} satisfies Prisma.InventoryConditionReportInclude;

// Study: Set up a reusable step named `listInventoryRequests`.
export const listInventoryRequests = (organizationId: string, status?: Prisma.InventoryRequestWhereInput["status"]) =>
    // Study: Find all matching records using `prisma.inventoryRequest`.
    prisma.inventoryRequest.findMany({
        // Study: Set the conditions that records must meet using organizationId.
        where: { organizationId, ...(status ? { status } : {}) },
        // Study: Ask for linked information along with the main record using `requestInclude`.
        include: requestInclude,
        // Study: Set the sort order for the returned records.
        orderBy: { submittedAt: "desc" },
    // Study: End this group of values.
    });

// Study: Make `createInventoryRequest` available to other files. Its result arrives after its work finishes.
export const createInventoryRequest = async (organizationId: string, requestedById: string, input: InventoryRequestInput) => {
    // Study: Run the listed asynchronous operations together and collect their results in order and wait for it to finish and store its result in `[warehouse, project, assets, labourAssignment]`.
    const [warehouse, project, assets, labourAssignment] = await Promise.all([
        // Study: Find the first record that meets these checks using `prisma.inventoryWarehouse`.
        prisma.inventoryWarehouse.findFirst({ where: { id: input.warehouseId, organizationId, isActive: true }, select: { id: true } }),
        // Study: Find the first record that meets these checks using `prisma.project`.
        prisma.project.findFirst({ where: { id: input.projectId, organizationId }, select: { id: true } }),
        // Study: Find all matching records using `prisma.inventoryAsset`.
        prisma.inventoryAsset.findMany({ where: { id: { in: input.lines.map(line => line.assetId) }, organizationId, isActive: true }, select: { id: true } }),
        // Study: Choose a value based on `input.labourAssignmentId`.
        input.labourAssignmentId ? prisma.labourAssignment.findFirst({
            // Study: Set the conditions that records must meet using id, status, assignment.
            where: { id: input.labourAssignmentId, status: "ACTIVE", assignment: { projectId: input.projectId, project: { organizationId } } },
            // Study: Choose which details the database gives back.
            select: { id: true },
        // Study: Call `Promise.resolve`.
        }) : Promise.resolve(undefined),
    // Study: End this group of values.
    ]);
    // Study: Do the next step if there is no value for `warehouse` . If so, stop and report "Warehouse not found."
    if (!warehouse) throw new NotFoundError("Warehouse not found.");
    // Study: Do the next step if there is no value for `project` . If so, stop and report "Project not found."
    if (!project) throw new NotFoundError("Project not found.");
    // Study: Do the next step if this check passes: `input.labourAssignmentId && !labourAssignment` . If so, stop and report "The selected labourer is not actively assigned to this project."
    if (input.labourAssignmentId && !labourAssignment) throw new BadRequestError("The selected labourer is not actively assigned to this project.");
    // Study: Do the next step if this check passes: `assets.length !== input.lines.length` . If so, stop and report "One or more inventory items were not found."
    if (assets.length !== input.lines.length) throw new NotFoundError("One or more inventory items were not found.");

    // Study: Generate a random UUID and store the result as `id`.
    const id = randomUUID();
    // Study: Insert a new record through `prisma.inventoryRequest` and wait for it to finish and store its result in `request`.
    const request = await prisma.inventoryRequest.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
            // Study: Build the text for `referenceNumber` by inserting the embedded expression values.
            referenceNumber: `IR-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(0, 6).toUpperCase()}`,
            // Study: Set `warehouseId` to `input.warehouseId`.
            warehouseId: input.warehouseId,
            // Study: Set `projectId` to `input.projectId`.
            projectId: input.projectId,
            // Study: Set `requestedForLabourAssignmentId` to `input.labourAssignmentId || null`.
            requestedForLabourAssignmentId: input.labourAssignmentId || null,
            // Study: Carry the value of `requestedById` into the new group under the same name.
            requestedById,
            // Study: Set `purpose` to `input.purpose || null`.
            purpose: input.purpose || null,
            // Study: Start the nested value for `lines`.
            lines: { create: input.lines.map(line => ({ organizationId, assetId: line.assetId, requestedQty: new Prisma.Decimal(line.quantity) })) },
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record using `requestInclude`.
        include: requestInclude,
    // Study: End this group of values.
    });
    // Study: Give `request` back to the code that asked for it.
    return request;
// Study: End this group of steps.
};

// Study: Make `reviewInventoryRequest` available to other files. Its result arrives after its work finishes.
export const reviewInventoryRequest = async (organizationId: string, requestId: string, reviewerId: string, input: { decision: "APPROVE" | "REJECT"; note?: string | null }) =>
    // Study: Treat these database changes as one job. If a step fails, the database can undo the changes from that job.
    prisma.$transaction(async tx => {
        // Study: Find the first record that meets these checks using `tx.inventoryRequest` and wait for it to finish and store its result in `request`.
        const request = await tx.inventoryRequest.findFirst({ where: { id: requestId, organizationId }, include: { lines: true } });
        // Study: Do the next step if there is no value for `request` . If so, stop and report "Inventory request not found."
        if (!request) throw new NotFoundError("Inventory request not found.");
        // Study: Do the next step if this check passes: `request.status !== "SUBMITTED"` . If so, stop and report "Only submitted inventory requests can be reviewed."
        if (request.status !== "SUBMITTED") throw new BadRequestError("Only submitted inventory requests can be reviewed.");

        // Study: Do the next step if this check passes: `input.decision === "REJECT"`.
        if (input.decision === "REJECT") {
            // Study: Give `tx.inventoryRequest.update({ where: { id: request.id }, data: { status: "REJECTED",…` back to the code that asked for it.
            return tx.inventoryRequest.update({
                // Study: Set the conditions that records must meet using id.
                where: { id: request.id },
                // Study: Supply the values to write to the database.
                data: { status: "REJECTED", reviewedById: reviewerId, reviewedAt: new Date(), reviewNote: input.note || null },
                // Study: Ask for linked information along with the main record using `requestInclude`.
                include: requestInclude,
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }

        // Study: Iterate over each item from `request.lines` using `const line`.
        for (const line of request.lines) {
            // Study: Look up a single record using a unique key through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
            const stock = await tx.inventoryWarehouseStock.findUnique({
                // Study: Set the conditions that records must meet using organizationId_assetId_warehouseId.
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: line.assetId, warehouseId: request.warehouseId } },
            // Study: End this group of values.
            });
            // Study: Do the next step if there is no value for `stock` and throw `new BadRequestError("One or more requested items have no stock at the selected ware…`.
            if (!stock) throw new BadRequestError("One or more requested items have no stock at the selected warehouse.");
            // Study: Call `stock.onHandQty.minus(stock.reservedQty).minus` and store the result as `available`.
            const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
            // Study: Do the next step if this check passes: `available.lessThan(line.requestedQty)`.
            if (available.lessThan(line.requestedQty)) {
                // Study: Stop here and report this problem: "There is not enough available stock to approve this request."
                throw new BadRequestError("There is not enough available stock to approve this request.");
            // Study: End this group of steps.
            }
            // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
            await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { reservedQty: { increment: line.requestedQty } } });
            // Study: Update the uniquely identified record through `tx.inventoryRequestLine` and wait for it to finish.
            await tx.inventoryRequestLine.update({ where: { id: line.id }, data: { approvedQty: line.requestedQty } });
        // Study: End this group of steps.
        }

        // Study: Give `tx.inventoryRequest.update({ where: { id: request.id }, data: { status: "APPROVED",…` back to the code that asked for it.
        return tx.inventoryRequest.update({
            // Study: Set the conditions that records must meet using id.
            where: { id: request.id },
            // Study: Supply the values to write to the database.
            data: { status: "APPROVED", reviewedById: reviewerId, reviewedAt: new Date(), reviewNote: input.note || null },
            // Study: Ask for linked information along with the main record using `requestInclude`.
            include: requestInclude,
        // Study: End this group of values.
        });
    // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

// Study: Make `issueInventoryRequest` available to other files. Its result arrives after its work finishes.
export const issueInventoryRequest = async (organizationId: string, requestId: string, actorId: string) =>
    // Study: Treat these database changes as one job. If a step fails, the database can undo the changes from that job.
    prisma.$transaction(async tx => {
        // Study: Find the first record that meets these checks using `tx.inventoryRequest` and wait for it to finish and store its result in `request`.
        const request = await tx.inventoryRequest.findFirst({ where: { id: requestId, organizationId }, include: { lines: true } });
        // Study: Do the next step if there is no value for `request` . If so, stop and report "Inventory request not found."
        if (!request) throw new NotFoundError("Inventory request not found.");
        // Study: Do the next step if this check passes: `request.status !== "APPROVED"` . If so, stop and report "Only approved requests can be issued."
        if (request.status !== "APPROVED") throw new BadRequestError("Only approved requests can be issued.");

        // Study: Iterate over each item from `request.lines` using `const line`.
        for (const line of request.lines) {
            // Study: Set `quantity` to `line.approvedQty || new Prisma.Decimal(0)`.
            const quantity = line.approvedQty || new Prisma.Decimal(0);
            // Study: Look up a single record using a unique key through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
            const stock = await tx.inventoryWarehouseStock.findUnique({
                // Study: Set the conditions that records must meet using organizationId_assetId_warehouseId.
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: line.assetId, warehouseId: request.warehouseId } },
            // Study: End this group of values.
            });
            // Study: Do the next step if this check passes: `!stock || stock.onHandQty.lessThan(quantity) || stock.reservedQty.lessThan(quantity)`.
            if (!stock || stock.onHandQty.lessThan(quantity) || stock.reservedQty.lessThan(quantity)) {
                // Study: Stop here and pass the problem onward: `new BadRequestError("Reserved stock is no longer available to issue. Refresh the re…`.
                throw new BadRequestError("Reserved stock is no longer available to issue. Refresh the request and review stock.");
            // Study: End this group of steps.
            }
            // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
            await tx.inventoryWarehouseStock.update({
                // Study: Set the conditions that records must meet using id.
                where: { id: stock.id },
                // Study: Supply the values to write to the database.
                data: { onHandQty: { decrement: quantity }, reservedQty: { decrement: quantity } },
            // Study: End this group of values.
            });
            // Study: Update the uniquely identified record through `tx.inventoryAsset` and wait for it to finish.
            await tx.inventoryAsset.update({ where: { id: line.assetId }, data: { quantity: { decrement: quantity } } });
            // Study: Update the uniquely identified record through `tx.inventoryRequestLine` and wait for it to finish.
            await tx.inventoryRequestLine.update({ where: { id: line.id }, data: { issuedQty: quantity } });
            // Study: Insert a new record through `tx.inventoryStockMovement` and wait for it to finish.
            await tx.inventoryStockMovement.create({
                // Study: Supply the values to write to the database.
                data: {
                    // Study: Carry the value of `organizationId` into the new group under the same name.
                    organizationId, assetId: line.assetId, warehouseId: request.warehouseId,
                    // Study: Set `requestId` to `request.id`.
                    requestId: request.id, requestLineId: line.id, type: "ISSUE",
                    // Study: Set `quantityDelta` to `quantity.negated()`.
                    quantityDelta: quantity.negated(), reason: `Issued for ${request.referenceNumber}`, actorId,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }

        // Study: Give `tx.inventoryRequest.update({ where: { id: request.id }, data: { status: "ISSUED", i…` back to the code that asked for it.
        return tx.inventoryRequest.update({ where: { id: request.id }, data: { status: "ISSUED", issuedAt: new Date() }, include: requestInclude });
    // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

// Study: Set up a reusable step named `listInventoryConditionReports`.
export const listInventoryConditionReports = (organizationId: string) => prisma.inventoryConditionReport.findMany({
    // Study: Set the conditions that records must meet using organizationId.
    where: { organizationId }, include: conditionInclude, orderBy: { createdAt: "desc" },
// Study: End this group of values.
});

// Study: Make `createInventoryConditionReport` available to other files. Its result arrives after its work finishes.
export const createInventoryConditionReport = async (organizationId: string, reportedById: string, input: InventoryConditionReportInput) => {
    // Study: Find the first record that meets these checks using `prisma.inventoryRequestLine` and wait for it to finish and store its result in `line`.
    const line = await prisma.inventoryRequestLine.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId, request.
        where: { id: input.requestLineId, organizationId, request: { organizationId, status: { in: ["ISSUED", "PARTIALLY_RETURNED"] } } },
        // Study: Ask for linked information along with the main record.
        include: { asset: true, request: true },
    // Study: End this group of values.
    });
    // Study: Do the next step if there is no value for `line` . If so, stop and report "An active issued inventory item could not be found."
    if (!line) throw new NotFoundError("An active issued inventory item could not be found.");
    // Study: Do the next step if this check passes: `line.asset.type === "MATERIAL"` . If so, stop and report "Materials cannot be reported as returnable equipment."
    if (line.asset.type === "MATERIAL") throw new BadRequestError("Materials cannot be reported as returnable equipment.");
    // Study: Call `line.issuedQty.minus` and store the result as `outstanding`.
    const outstanding = line.issuedQty.minus(line.returnedQty);
    // Study: Calculate summary values across matching records through `prisma.inventoryConditionReport` and wait for it to finish and store its result in `openReports`.
    const openReports = await prisma.inventoryConditionReport.aggregate({
        // Study: Set the conditions that records must meet using organizationId, requestLineId, status.
        where: { organizationId, requestLineId: line.id, status: { in: ["SUBMITTED", "UNDER_REVIEW", "IN_REPAIR"] } },
        // Study: Start the nested value for `_sum`.
        _sum: { quantity: true },
    // Study: End this group of values.
    });
    // Study: Set `alreadyReported` to `openReports._sum.quantity || new Prisma.Decimal(0)`.
    const alreadyReported = openReports._sum.quantity || new Prisma.Decimal(0);
    // Study: Create an instance of `Prisma.Decimal` and store the result as `quantity`.
    const quantity = new Prisma.Decimal(input.quantity);
    // Study: Do the next step if this check passes: `quantity.greaterThan(outstanding.minus(alreadyReported))` and throw `new BadRequestError("Reported quantity exceeds the equipment quantity still issued …`.
    if (quantity.greaterThan(outstanding.minus(alreadyReported))) throw new BadRequestError("Reported quantity exceeds the equipment quantity still issued and not already reported.");
    // Study: Give `prisma.inventoryConditionReport.create({ data: { organizationId, assetId: line.asse…` back to the code that asked for it.
    return prisma.inventoryConditionReport.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId, assetId: line.assetId, warehouseId: line.request.warehouseId,
            // Study: Set `requestId` to `line.requestId`.
            requestId: line.requestId, requestLineId: line.id, reportedById,
            // Study: Carry the value of `quantity` into the new group under the same name.
            quantity, description: input.description,
        // Study: Ask for linked information along with the main record using `conditionInclude`.
        }, include: conditionInclude,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `reviewInventoryConditionReport` available to other files. Its result arrives after its work finishes.
export const reviewInventoryConditionReport = async (organizationId: string, reportId: string, reviewerId: string, input: { status: "UNDER_REVIEW" | "IN_REPAIR" | "RESOLVED" | "WRITTEN_OFF"; resolutionNote?: string | null }) =>
    // Study: Treat these database changes as one job. If a step fails, the database can undo the changes from that job.
    prisma.$transaction(async tx => {
        // Study: Find the first record that meets these checks using `tx.inventoryConditionReport` and wait for it to finish and store its result in `report`.
        const report = await tx.inventoryConditionReport.findFirst({ where: { id: reportId, organizationId }, include: { requestLine: true } });
        // Study: Do the next step if there is no value for `report` . If so, stop and report "Inventory condition report not found."
        if (!report) throw new NotFoundError("Inventory condition report not found.");
        // Study: Build the object `allowedTransitions` with the entries below.
        const allowedTransitions: Record<string, string[]> = {
            // Study: Start the nested value for `SUBMITTED`.
            SUBMITTED: ["UNDER_REVIEW", "IN_REPAIR", "WRITTEN_OFF"],
            // Study: Start the nested value for `UNDER_REVIEW`.
            UNDER_REVIEW: ["IN_REPAIR", "RESOLVED", "WRITTEN_OFF"],
            // Study: Start the nested value for `IN_REPAIR`.
            IN_REPAIR: ["RESOLVED", "WRITTEN_OFF"],
        // Study: End this group of values.
        };
        // Study: Do the next step if this check passes: `!allowedTransitions[report.status]?.includes(input.status)` and throw `new BadRequestError('Cannot move a ${report.status.toLowerCase().replaceAll("_", " …`.
        if (!allowedTransitions[report.status]?.includes(input.status)) throw new BadRequestError(`Cannot move a ${report.status.toLowerCase().replaceAll("_", " ")} report to ${input.status.toLowerCase().replaceAll("_", " ")}.`);

        // Study: Do the next step if this check passes: `input.status === "RESOLVED" || input.status === "WRITTEN_OFF"`.
        if (input.status === "RESOLVED" || input.status === "WRITTEN_OFF") {
            // Study: Look up a single record using a unique key through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
            const stock = await tx.inventoryWarehouseStock.findUnique({
                // Study: Set the conditions that records must meet using organizationId_assetId_warehouseId.
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: report.assetId, warehouseId: report.warehouseId } },
            // Study: End this group of values.
            });
            // Study: Set `physicallyReturned` to `report.requestLine && report.requestLine.returnedQty.greaterThan(0)`.
            const physicallyReturned = report.requestLine && report.requestLine.returnedQty.greaterThan(0);
            // Study: Set `heldQty` to `stock && physicallyReturned ? Prisma.Decimal.min(stock.maintenanceQty, report.quant…`.
            const heldQty = stock && physicallyReturned ? Prisma.Decimal.min(stock.maintenanceQty, report.quantity) : new Prisma.Decimal(0);
            // Study: Do the next step if this check passes: `stock && !heldQty.isZero()`.
            if (stock && !heldQty.isZero()) {
                // Study: Do the next step if this check passes: `input.status === "RESOLVED"`.
                if (input.status === "RESOLVED") {
                    // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
                    await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { maintenanceQty: { decrement: heldQty } } });
                // Study: Run this branch if the preceding conditions failed.
                } else {
                    // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
                    await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { maintenanceQty: { decrement: heldQty }, onHandQty: { decrement: heldQty } } });
                    // Study: Update the uniquely identified record through `tx.inventoryAsset` and wait for it to finish.
                    await tx.inventoryAsset.update({ where: { id: report.assetId }, data: { quantity: { decrement: heldQty } } });
                    // Study: Insert a new record through `tx.inventoryStockMovement` and wait for it to finish.
                    await tx.inventoryStockMovement.create({
                        // Study: Supply the values to write to the database.
                        data: {
                            // Study: Carry the value of `organizationId` into the new group under the same name.
                            organizationId, assetId: report.assetId, warehouseId: report.warehouseId,
                            // Study: Set `requestId` to `report.requestId`.
                            requestId: report.requestId, requestLineId: report.requestLineId,
                            // Study: Set `conditionReportId` to `report.id`.
                            conditionReportId: report.id, type: "DAMAGE_OUT", quantityDelta: heldQty.negated(),
                            // Study: Set `reason` to `input.resolutionNote || "Written off after inspection"`.
                            reason: input.resolutionNote || "Written off after inspection", actorId: reviewerId,
                        // Study: End this group of values.
                        },
                    // Study: End this group of values.
                    });
                // Study: End this group of steps.
                }
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }

        // Study: Give `tx.inventoryConditionReport.update({ where: { id: report.id }, data: { status: inpu…` back to the code that asked for it.
        return tx.inventoryConditionReport.update({
            // Study: Set the conditions that records must meet using id.
            where: { id: report.id },
            // Study: Supply the values to write to the database.
            data: {
                // Study: Set `status` to `input.status`.
                status: input.status, reviewedById: reviewerId, reviewedAt: new Date(),
                // Study: Expand the values from `(input.resolutionNote !== undefined ? { resolutionNote: input.resolutionNote } : {})` into the surrounding collection.
                ...(input.resolutionNote !== undefined ? { resolutionNote: input.resolutionNote } : {}),
                // Study: Expand the values from `(["RESOLVED", "WRITTEN_OFF"].includes(input.status) ? { resolvedAt: new Date() } : {})` into the surrounding collection.
                ...(["RESOLVED", "WRITTEN_OFF"].includes(input.status) ? { resolvedAt: new Date() } : {}),
            // Study: Ask for linked information along with the main record using `conditionInclude`.
            }, include: conditionInclude,
        // Study: End this group of values.
        });
    // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

// Study: Set up a reusable step named `listInventoryReturns`.
export const listInventoryReturns = (organizationId: string) => prisma.inventoryReturnRequest.findMany({
    // Study: Set the conditions that records must meet using organizationId.
    where: { organizationId }, include: returnInclude, orderBy: { submittedAt: "desc" },
// Study: End this group of values.
});

// Study: Make `createInventoryReturn` available to other files. Its result arrives after its work finishes.
export const createInventoryReturn = async (organizationId: string, requestedById: string, input: InventoryReturnInput) =>
    // Study: Treat these database changes as one job. If a step fails, the database can undo the changes from that job.
    prisma.$transaction(async tx => {
        // Study: Find the first record that meets these checks using `tx.inventoryRequest` and wait for it to finish and store its result in `request`.
        const request = await tx.inventoryRequest.findFirst({
            // Study: Set the conditions that records must meet using id, organizationId, status.
            where: { id: input.requestId, organizationId, status: { in: ["ISSUED", "PARTIALLY_RETURNED"] } },
            // Study: Ask for linked information along with the main record.
            include: { lines: { include: { asset: true } }, returns: { where: { status: "SUBMITTED" }, include: { lines: true } } },
        // Study: End this group of values.
        });
        // Study: Do the next step if there is no value for `request` . If so, stop and report "An issued inventory request eligible for return was not found."
        if (!request) throw new NotFoundError("An issued inventory request eligible for return was not found.");
        // Study: Build the array `returnLines` with the entries below.
        const returnLines: Array<{ requestLineId: string; quantity: Prisma.Decimal; condition: string }> = [];
        // Study: Iterate over each item from `input.lines` using `const lineInput`.
        for (const lineInput of input.lines) {
            // Study: Find the first matching item in `request.lines` and store the result as `line`.
            const line = request.lines.find(item => item.id === lineInput.requestLineId);
            // Study: Do the next step if there is no value for `line` . If so, stop and report "A selected return item does not belong to this issue."
            if (!line) throw new BadRequestError("A selected return item does not belong to this issue.");
            // Study: Do the next step if this check passes: `line.asset.type === "MATERIAL"` . If so, stop and report "Materials are consumed by the project and cannot be returned."
            if (line.asset.type === "MATERIAL") throw new BadRequestError("Materials are consumed by the project and cannot be returned.");
            // Study: Combine the items in `request.returns.flatMap(returnRequest => returnRequest.lines) .filter(returnLine =>…` into one accumulated result and store the result as `pending`.
            const pending = request.returns.flatMap(returnRequest => returnRequest.lines)
                // Study: Continue the chain with `filter`.
                .filter(returnLine => returnLine.requestLineId === line.id)
                // Study: Continue the chain with `reduce`.
                .reduce((total, returnLine) => total.plus(returnLine.quantity), new Prisma.Decimal(0));
            // Study: Call `line.issuedQty.minus(line.returnedQty).minus` and store the result as `remaining`.
            const remaining = line.issuedQty.minus(line.returnedQty).minus(pending);
            // Study: Create an instance of `Prisma.Decimal` and store the result as `quantity`.
            const quantity = new Prisma.Decimal(lineInput.quantity);
            // Study: Do the next step if this check passes: `quantity.greaterThan(remaining)` and throw `new BadRequestError('Return quantity for ${line.asset.name} exceeds the quantity st…`.
            if (quantity.greaterThan(remaining)) throw new BadRequestError(`Return quantity for ${line.asset.name} exceeds the quantity still out.`);
            // Study: Call `returnLines.push`.
            returnLines.push({ requestLineId: line.id, quantity, condition: lineInput.condition });
        // Study: End this group of steps.
        }

        // Study: Generate a random UUID and store the result as `id`.
        const id = randomUUID();
        // Study: Give `tx.inventoryReturnRequest.create({ data: { id, organizationId, referenceNumber: 'IR…` back to the code that asked for it.
        return tx.inventoryReturnRequest.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `id` into the new group under the same name.
                id, organizationId,
                // Study: Build the text for `referenceNumber` by inserting the embedded expression values.
                referenceNumber: `IRTN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(0, 6).toUpperCase()}`,
                // Study: Set `requestId` to `request.id`.
                requestId: request.id, warehouseId: request.warehouseId, requestedById,
                // Study: Start the nested value for `lines`.
                lines: { create: returnLines.map(line => ({ organizationId, requestLineId: line.requestLineId, quantity: line.quantity, condition: line.condition })) },
            // Study: Ask for linked information along with the main record using `returnInclude`.
            }, include: returnInclude,
        // Study: End this group of values.
        });
    // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

// Study: Make `reviewInventoryReturn` available to other files. Its result arrives after its work finishes.
export const reviewInventoryReturn = async (organizationId: string, returnId: string, reviewerId: string, input: { decision: "APPROVE" | "REJECT"; note?: string | null }) =>
    // Study: Treat these database changes as one job. If a step fails, the database can undo the changes from that job.
    prisma.$transaction(async tx => {
        // Study: Find the first record that meets these checks using `tx.inventoryReturnRequest` and wait for it to finish and store its result in `returnRequest`.
        const returnRequest = await tx.inventoryReturnRequest.findFirst({ where: { id: returnId, organizationId }, include: { lines: { include: { requestLine: { include: { asset: true } } } } } });
        // Study: Do the next step if there is no value for `returnRequest` . If so, stop and report "Inventory return request not found."
        if (!returnRequest) throw new NotFoundError("Inventory return request not found.");
        // Study: Do the next step if this check passes: `returnRequest.status !== "SUBMITTED"` . If so, stop and report "Only submitted return requests can be reviewed."
        if (returnRequest.status !== "SUBMITTED") throw new BadRequestError("Only submitted return requests can be reviewed.");
        // Study: Do the next step if this check passes: `input.decision === "REJECT"`.
        if (input.decision === "REJECT") {
            // Study: Give `tx.inventoryReturnRequest.update({ where: { id: returnRequest.id }, data: { status:…` back to the code that asked for it.
            return tx.inventoryReturnRequest.update({
                // Study: Set the conditions that records must meet using id.
                where: { id: returnRequest.id },
                // Study: Supply the values to write to the database.
                data: { status: "REJECTED", reviewedById: reviewerId, reviewedAt: new Date(), reviewNote: input.note || null },
                // Study: Ask for linked information along with the main record using `returnInclude`.
                include: returnInclude,
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }

        // Study: Iterate over each item from `returnRequest.lines` using `const line`.
        for (const line of returnRequest.lines) {
            // Study: Set `issuedLine` to `line.requestLine`.
            const issuedLine = line.requestLine;
            // Study: Do the next step if this check passes: `issuedLine.asset.type === "MATERIAL"` . If so, stop and report "Materials are not returnable."
            if (issuedLine.asset.type === "MATERIAL") throw new BadRequestError("Materials are not returnable.");
            // Study: Call `issuedLine.issuedQty.minus` and store the result as `remaining`.
            const remaining = issuedLine.issuedQty.minus(issuedLine.returnedQty);
            // Study: Do the next step if this check passes: `line.quantity.greaterThan(remaining)` . If so, stop and report "The requested return quantity is no longer outstanding."
            if (line.quantity.greaterThan(remaining)) throw new BadRequestError("The requested return quantity is no longer outstanding.");
            // Study: Look up a single record using a unique key through `tx.inventoryWarehouseStock` and wait for it to finish and store its result in `stock`.
            const stock = await tx.inventoryWarehouseStock.findUnique({
                // Study: Set the conditions that records must meet using organizationId_assetId_warehouseId.
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: issuedLine.assetId, warehouseId: returnRequest.warehouseId } },
            // Study: End this group of values.
            });
            // Study: Do the next step if there is no value for `stock` . If so, stop and report "Warehouse stock record was not found for a returned item."
            if (!stock) throw new BadRequestError("Warehouse stock record was not found for a returned item.");
            // Study: Set `requiresMaintenance` to `line.condition !== "GOOD"`.
            const requiresMaintenance = line.condition !== "GOOD";
            // Study: Update the uniquely identified record through `tx.inventoryWarehouseStock` and wait for it to finish.
            await tx.inventoryWarehouseStock.update({
                // Study: Set the conditions that records must meet using id.
                where: { id: stock.id },
                // Study: Supply the values to write to the database.
                data: {
                    // Study: Start the nested value for `onHandQty`.
                    onHandQty: { increment: line.quantity },
                    // Study: Expand the values from `(requiresMaintenance ? { maintenanceQty: { increment: line.quantity } } : {})` into the surrounding collection.
                    ...(requiresMaintenance ? { maintenanceQty: { increment: line.quantity } } : {}),
                // Study: End this group of values.
                },
            // Study: End this group of values.
            });
            // Study: Update the uniquely identified record through `tx.inventoryAsset` and wait for it to finish.
            await tx.inventoryAsset.update({ where: { id: issuedLine.assetId }, data: { quantity: { increment: line.quantity } } });
            // Study: Update the uniquely identified record through `tx.inventoryRequestLine` and wait for it to finish.
            await tx.inventoryRequestLine.update({ where: { id: issuedLine.id }, data: { returnedQty: { increment: line.quantity } } });
            // Study: Insert a new record through `tx.inventoryStockMovement` and wait for it to finish.
            await tx.inventoryStockMovement.create({
                // Study: Supply the values to write to the database.
                data: {
                    // Study: Carry the value of `organizationId` into the new group under the same name.
                    organizationId, assetId: issuedLine.assetId, warehouseId: returnRequest.warehouseId,
                    // Study: Set `requestId` to `returnRequest.requestId`.
                    requestId: returnRequest.requestId, requestLineId: issuedLine.id, returnRequestId: returnRequest.id,
                    // Study: Set `type` to `"RETURN"`.
                    type: "RETURN", quantityDelta: line.quantity,
                    // Study: Build the text for `reason` by inserting the embedded expression values.
                    reason: `Return ${line.condition || "GOOD"}${requiresMaintenance ? " · held for maintenance" : ""}`,
                    // Study: Set `actorId` to `reviewerId`.
                    actorId: reviewerId,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            });
            // Study: Do the next step if this check passes: `requiresMaintenance`.
            if (requiresMaintenance) {
                // Study: Insert a new record through `tx.inventoryConditionReport` and wait for it to finish.
                await tx.inventoryConditionReport.create({
                    // Study: Supply the values to write to the database.
                    data: {
                        // Study: Carry the value of `organizationId` into the new group under the same name.
                        organizationId, assetId: issuedLine.assetId, warehouseId: returnRequest.warehouseId,
                        // Study: Set `requestId` to `returnRequest.requestId`.
                        requestId: returnRequest.requestId, requestLineId: issuedLine.id,
                        // Study: Set `reportedById` to `returnRequest.requestedById`.
                        reportedById: returnRequest.requestedById, reviewedById: reviewerId,
                        // Study: Set `quantity` to `line.quantity`.
                        quantity: line.quantity,
                        // Study: Set `description` to `'Returned with condition: ${line.condition || "DAMAGED"}. ${input.note || ""}'.trim()`.
                        description: `Returned with condition: ${line.condition || "DAMAGED"}. ${input.note || ""}`.trim(),
                        // Study: Set `status` to `"IN_REPAIR"`.
                        status: "IN_REPAIR", reviewedAt: new Date(),
                    // Study: End this group of values.
                    },
                // Study: End this group of values.
                });
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }

        // Study: Update the uniquely identified record through `tx.inventoryReturnRequest` and wait for it to finish and store its result in `updatedReturn`.
        const updatedReturn = await tx.inventoryReturnRequest.update({
            // Study: Set the conditions that records must meet using id.
            where: { id: returnRequest.id },
            // Study: Supply the values to write to the database.
            data: { status: "RECEIVED", reviewedById: reviewerId, reviewedAt: new Date(), receivedAt: new Date(), reviewNote: input.note || null },
            // Study: Ask for linked information along with the main record using `returnInclude`.
            include: returnInclude,
        // Study: End this group of values.
        });
        // Study: Find all matching records using `tx.inventoryRequestLine` and wait for it to finish and store its result in `parentLines`.
        const parentLines = await tx.inventoryRequestLine.findMany({ where: { requestId: returnRequest.requestId }, include: { asset: { select: { type: true } } } });
        // Study: Keep the items in `parentLines` that satisfy the predicate and store the result as `returnableLines`.
        const returnableLines = parentLines.filter(line => line.asset.type !== "MATERIAL");
        // Study: Do the next step if this check passes: `returnableLines.some(line => line.returnedQty.greaterThan(0))`.
        if (returnableLines.some(line => line.returnedQty.greaterThan(0))) {
            // Study: Set `allReturned` to `returnableLines.length > 0 && returnableLines.every(line => line.returnedQty.greate…`.
            const allReturned = returnableLines.length > 0 && returnableLines.every(line => line.returnedQty.greaterThanOrEqualTo(line.issuedQty));
            // Study: Update the uniquely identified record through `tx.inventoryRequest` and wait for it to finish.
            await tx.inventoryRequest.update({ where: { id: returnRequest.requestId }, data: { status: allReturned ? "RETURNED" : "PARTIALLY_RETURNED" } });
        // Study: End this group of steps.
        }
        // Study: Give `updatedReturn` back to the code that asked for it.
        return updatedReturn;
    // Study: Set `isolationLevel` to `Prisma.TransactionIsolationLevel.Serializable`.
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
