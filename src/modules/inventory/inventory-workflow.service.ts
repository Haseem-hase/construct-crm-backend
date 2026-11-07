import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import prisma from "../../lib/prisma";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { InventoryConditionReportInput, InventoryRequestInput, InventoryReturnInput } from "./inventory.validation";

const requestInclude = {
    project: { select: { id: true, name: true, projectCode: true } },
    requestedForLabourAssignment: { select: { id: true, labour: { select: { id: true, fullName: true, phone: true } }, assignment: { select: { contractor: { select: { id: true, fullName: true } } } } } },
    warehouse: { select: { id: true, name: true, code: true } },
    requestedBy: { select: { id: true, fullName: true, email: true } },
    reviewedBy: { select: { id: true, fullName: true, email: true } },
    lines: { include: { asset: { select: { id: true, code: true, name: true, type: true, quantity: true, price: true } } } },
} satisfies Prisma.InventoryRequestInclude;

const returnInclude = {
    request: { include: { project: { select: { id: true, name: true, projectCode: true } } } },
    warehouse: { select: { id: true, name: true, code: true } },
    requestedBy: { select: { id: true, fullName: true, email: true } },
    reviewedBy: { select: { id: true, fullName: true, email: true } },
    lines: { include: { requestLine: { include: { asset: { select: { id: true, name: true, code: true, type: true } } } } } },
} satisfies Prisma.InventoryReturnRequestInclude;

const conditionInclude = {
    asset: { select: { id: true, name: true, code: true, type: true } },
    warehouse: { select: { id: true, name: true, code: true } },
    request: { include: { project: { select: { id: true, name: true, projectCode: true } } } },
    requestLine: { select: { id: true, issuedQty: true, returnedQty: true } },
    reportedBy: { select: { id: true, fullName: true, email: true } },
    reviewedBy: { select: { id: true, fullName: true, email: true } },
} satisfies Prisma.InventoryConditionReportInclude;

export const listInventoryRequests = (organizationId: string, status?: Prisma.InventoryRequestWhereInput["status"]) =>
    prisma.inventoryRequest.findMany({
        where: { organizationId, ...(status ? { status } : {}) },
        include: requestInclude,
        orderBy: { submittedAt: "desc" },
    });

export const createInventoryRequest = async (organizationId: string, requestedById: string, input: InventoryRequestInput) => {
    const [warehouse, project, assets, labourAssignment] = await Promise.all([
        prisma.inventoryWarehouse.findFirst({ where: { id: input.warehouseId, organizationId, isActive: true }, select: { id: true } }),
        prisma.project.findFirst({ where: { id: input.projectId, organizationId }, select: { id: true } }),
        prisma.inventoryAsset.findMany({ where: { id: { in: input.lines.map(line => line.assetId) }, organizationId, isActive: true }, select: { id: true } }),
        input.labourAssignmentId ? prisma.labourAssignment.findFirst({
            where: { id: input.labourAssignmentId, status: "ACTIVE", assignment: { projectId: input.projectId, project: { organizationId } } },
            select: { id: true },
        }) : Promise.resolve(undefined),
    ]);
    if (!warehouse) throw new NotFoundError("Warehouse not found.");
    if (!project) throw new NotFoundError("Project not found.");
    if (input.labourAssignmentId && !labourAssignment) throw new BadRequestError("The selected labourer is not actively assigned to this project.");
    if (assets.length !== input.lines.length) throw new NotFoundError("One or more inventory items were not found.");

    const id = randomUUID();
    const request = await prisma.inventoryRequest.create({
        data: {
            id,
            organizationId,
            referenceNumber: `IR-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(0, 6).toUpperCase()}`,
            warehouseId: input.warehouseId,
            projectId: input.projectId,
            requestedForLabourAssignmentId: input.labourAssignmentId || null,
            requestedById,
            purpose: input.purpose || null,
            lines: { create: input.lines.map(line => ({ organizationId, assetId: line.assetId, requestedQty: new Prisma.Decimal(line.quantity) })) },
        },
        include: requestInclude,
    });
    return request;
};

export const reviewInventoryRequest = async (organizationId: string, requestId: string, reviewerId: string, input: { decision: "APPROVE" | "REJECT"; note?: string | null }) =>
    prisma.$transaction(async tx => {
        const request = await tx.inventoryRequest.findFirst({ where: { id: requestId, organizationId }, include: { lines: true } });
        if (!request) throw new NotFoundError("Inventory request not found.");
        if (request.status !== "SUBMITTED") throw new BadRequestError("Only submitted inventory requests can be reviewed.");

        if (input.decision === "REJECT") {
            return tx.inventoryRequest.update({
                where: { id: request.id },
                data: { status: "REJECTED", reviewedById: reviewerId, reviewedAt: new Date(), reviewNote: input.note || null },
                include: requestInclude,
            });
        }

        for (const line of request.lines) {
            const stock = await tx.inventoryWarehouseStock.findUnique({
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: line.assetId, warehouseId: request.warehouseId } },
            });
            if (!stock) throw new BadRequestError("One or more requested items have no stock at the selected warehouse.");
            const available = stock.onHandQty.minus(stock.reservedQty).minus(stock.maintenanceQty);
            if (available.lessThan(line.requestedQty)) {
                throw new BadRequestError("There is not enough available stock to approve this request.");
            }
            await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { reservedQty: { increment: line.requestedQty } } });
            await tx.inventoryRequestLine.update({ where: { id: line.id }, data: { approvedQty: line.requestedQty } });
        }

        return tx.inventoryRequest.update({
            where: { id: request.id },
            data: { status: "APPROVED", reviewedById: reviewerId, reviewedAt: new Date(), reviewNote: input.note || null },
            include: requestInclude,
        });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

export const issueInventoryRequest = async (organizationId: string, requestId: string, actorId: string) =>
    prisma.$transaction(async tx => {
        const request = await tx.inventoryRequest.findFirst({ where: { id: requestId, organizationId }, include: { lines: true } });
        if (!request) throw new NotFoundError("Inventory request not found.");
        if (request.status !== "APPROVED") throw new BadRequestError("Only approved requests can be issued.");

        for (const line of request.lines) {
            const quantity = line.approvedQty || new Prisma.Decimal(0);
            const stock = await tx.inventoryWarehouseStock.findUnique({
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: line.assetId, warehouseId: request.warehouseId } },
            });
            if (!stock || stock.onHandQty.lessThan(quantity) || stock.reservedQty.lessThan(quantity)) {
                throw new BadRequestError("Reserved stock is no longer available to issue. Refresh the request and review stock.");
            }
            await tx.inventoryWarehouseStock.update({
                where: { id: stock.id },
                data: { onHandQty: { decrement: quantity }, reservedQty: { decrement: quantity } },
            });
            await tx.inventoryAsset.update({ where: { id: line.assetId }, data: { quantity: { decrement: quantity } } });
            await tx.inventoryRequestLine.update({ where: { id: line.id }, data: { issuedQty: quantity } });
            await tx.inventoryStockMovement.create({
                data: {
                    organizationId, assetId: line.assetId, warehouseId: request.warehouseId,
                    requestId: request.id, requestLineId: line.id, type: "ISSUE",
                    quantityDelta: quantity.negated(), reason: `Issued for ${request.referenceNumber}`, actorId,
                },
            });
        }

        return tx.inventoryRequest.update({ where: { id: request.id }, data: { status: "ISSUED", issuedAt: new Date() }, include: requestInclude });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

export const listInventoryConditionReports = (organizationId: string) => prisma.inventoryConditionReport.findMany({
    where: { organizationId }, include: conditionInclude, orderBy: { createdAt: "desc" },
});

export const createInventoryConditionReport = async (organizationId: string, reportedById: string, input: InventoryConditionReportInput) => {
    const line = await prisma.inventoryRequestLine.findFirst({
        where: { id: input.requestLineId, organizationId, request: { organizationId, status: { in: ["ISSUED", "PARTIALLY_RETURNED"] } } },
        include: { asset: true, request: true },
    });
    if (!line) throw new NotFoundError("An active issued inventory item could not be found.");
    if (line.asset.type === "MATERIAL") throw new BadRequestError("Materials cannot be reported as returnable equipment.");
    const outstanding = line.issuedQty.minus(line.returnedQty);
    const openReports = await prisma.inventoryConditionReport.aggregate({
        where: { organizationId, requestLineId: line.id, status: { in: ["SUBMITTED", "UNDER_REVIEW", "IN_REPAIR"] } },
        _sum: { quantity: true },
    });
    const alreadyReported = openReports._sum.quantity || new Prisma.Decimal(0);
    const quantity = new Prisma.Decimal(input.quantity);
    if (quantity.greaterThan(outstanding.minus(alreadyReported))) throw new BadRequestError("Reported quantity exceeds the equipment quantity still issued and not already reported.");
    return prisma.inventoryConditionReport.create({
        data: {
            organizationId, assetId: line.assetId, warehouseId: line.request.warehouseId,
            requestId: line.requestId, requestLineId: line.id, reportedById,
            quantity, description: input.description,
        }, include: conditionInclude,
    });
};

export const reviewInventoryConditionReport = async (organizationId: string, reportId: string, reviewerId: string, input: { status: "UNDER_REVIEW" | "IN_REPAIR" | "RESOLVED" | "WRITTEN_OFF"; resolutionNote?: string | null }) =>
    prisma.$transaction(async tx => {
        const report = await tx.inventoryConditionReport.findFirst({ where: { id: reportId, organizationId }, include: { requestLine: true } });
        if (!report) throw new NotFoundError("Inventory condition report not found.");
        const allowedTransitions: Record<string, string[]> = {
            SUBMITTED: ["UNDER_REVIEW", "IN_REPAIR", "WRITTEN_OFF"],
            UNDER_REVIEW: ["IN_REPAIR", "RESOLVED", "WRITTEN_OFF"],
            IN_REPAIR: ["RESOLVED", "WRITTEN_OFF"],
        };
        if (!allowedTransitions[report.status]?.includes(input.status)) throw new BadRequestError(`Cannot move a ${report.status.toLowerCase().replaceAll("_", " ")} report to ${input.status.toLowerCase().replaceAll("_", " ")}.`);

        if (input.status === "RESOLVED" || input.status === "WRITTEN_OFF") {
            const stock = await tx.inventoryWarehouseStock.findUnique({
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: report.assetId, warehouseId: report.warehouseId } },
            });
            const physicallyReturned = report.requestLine && report.requestLine.returnedQty.greaterThan(0);
            const heldQty = stock && physicallyReturned ? Prisma.Decimal.min(stock.maintenanceQty, report.quantity) : new Prisma.Decimal(0);
            if (stock && !heldQty.isZero()) {
                if (input.status === "RESOLVED") {
                    await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { maintenanceQty: { decrement: heldQty } } });
                } else {
                    await tx.inventoryWarehouseStock.update({ where: { id: stock.id }, data: { maintenanceQty: { decrement: heldQty }, onHandQty: { decrement: heldQty } } });
                    await tx.inventoryAsset.update({ where: { id: report.assetId }, data: { quantity: { decrement: heldQty } } });
                    await tx.inventoryStockMovement.create({
                        data: {
                            organizationId, assetId: report.assetId, warehouseId: report.warehouseId,
                            requestId: report.requestId, requestLineId: report.requestLineId,
                            conditionReportId: report.id, type: "DAMAGE_OUT", quantityDelta: heldQty.negated(),
                            reason: input.resolutionNote || "Written off after inspection", actorId: reviewerId,
                        },
                    });
                }
            }
        }

        return tx.inventoryConditionReport.update({
            where: { id: report.id },
            data: {
                status: input.status, reviewedById: reviewerId, reviewedAt: new Date(),
                ...(input.resolutionNote !== undefined ? { resolutionNote: input.resolutionNote } : {}),
                ...(["RESOLVED", "WRITTEN_OFF"].includes(input.status) ? { resolvedAt: new Date() } : {}),
            }, include: conditionInclude,
        });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

export const listInventoryReturns = (organizationId: string) => prisma.inventoryReturnRequest.findMany({
    where: { organizationId }, include: returnInclude, orderBy: { submittedAt: "desc" },
});

export const createInventoryReturn = async (organizationId: string, requestedById: string, input: InventoryReturnInput) =>
    prisma.$transaction(async tx => {
        const request = await tx.inventoryRequest.findFirst({
            where: { id: input.requestId, organizationId, status: { in: ["ISSUED", "PARTIALLY_RETURNED"] } },
            include: { lines: { include: { asset: true } }, returns: { where: { status: "SUBMITTED" }, include: { lines: true } } },
        });
        if (!request) throw new NotFoundError("An issued inventory request eligible for return was not found.");
        const returnLines: Array<{ requestLineId: string; quantity: Prisma.Decimal; condition: string }> = [];
        for (const lineInput of input.lines) {
            const line = request.lines.find(item => item.id === lineInput.requestLineId);
            if (!line) throw new BadRequestError("A selected return item does not belong to this issue.");
            if (line.asset.type === "MATERIAL") throw new BadRequestError("Materials are consumed by the project and cannot be returned.");
            const pending = request.returns.flatMap(returnRequest => returnRequest.lines)
                .filter(returnLine => returnLine.requestLineId === line.id)
                .reduce((total, returnLine) => total.plus(returnLine.quantity), new Prisma.Decimal(0));
            const remaining = line.issuedQty.minus(line.returnedQty).minus(pending);
            const quantity = new Prisma.Decimal(lineInput.quantity);
            if (quantity.greaterThan(remaining)) throw new BadRequestError(`Return quantity for ${line.asset.name} exceeds the quantity still out.`);
            returnLines.push({ requestLineId: line.id, quantity, condition: lineInput.condition });
        }

        const id = randomUUID();
        return tx.inventoryReturnRequest.create({
            data: {
                id, organizationId,
                referenceNumber: `IRTN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(0, 6).toUpperCase()}`,
                requestId: request.id, warehouseId: request.warehouseId, requestedById,
                lines: { create: returnLines.map(line => ({ organizationId, requestLineId: line.requestLineId, quantity: line.quantity, condition: line.condition })) },
            }, include: returnInclude,
        });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

export const reviewInventoryReturn = async (organizationId: string, returnId: string, reviewerId: string, input: { decision: "APPROVE" | "REJECT"; note?: string | null }) =>
    prisma.$transaction(async tx => {
        const returnRequest = await tx.inventoryReturnRequest.findFirst({ where: { id: returnId, organizationId }, include: { lines: { include: { requestLine: { include: { asset: true } } } } } });
        if (!returnRequest) throw new NotFoundError("Inventory return request not found.");
        if (returnRequest.status !== "SUBMITTED") throw new BadRequestError("Only submitted return requests can be reviewed.");
        if (input.decision === "REJECT") {
            return tx.inventoryReturnRequest.update({
                where: { id: returnRequest.id },
                data: { status: "REJECTED", reviewedById: reviewerId, reviewedAt: new Date(), reviewNote: input.note || null },
                include: returnInclude,
            });
        }

        for (const line of returnRequest.lines) {
            const issuedLine = line.requestLine;
            if (issuedLine.asset.type === "MATERIAL") throw new BadRequestError("Materials are not returnable.");
            const remaining = issuedLine.issuedQty.minus(issuedLine.returnedQty);
            if (line.quantity.greaterThan(remaining)) throw new BadRequestError("The requested return quantity is no longer outstanding.");
            const stock = await tx.inventoryWarehouseStock.findUnique({
                where: { organizationId_assetId_warehouseId: { organizationId, assetId: issuedLine.assetId, warehouseId: returnRequest.warehouseId } },
            });
            if (!stock) throw new BadRequestError("Warehouse stock record was not found for a returned item.");
            const requiresMaintenance = line.condition !== "GOOD";
            await tx.inventoryWarehouseStock.update({
                where: { id: stock.id },
                data: {
                    onHandQty: { increment: line.quantity },
                    ...(requiresMaintenance ? { maintenanceQty: { increment: line.quantity } } : {}),
                },
            });
            await tx.inventoryAsset.update({ where: { id: issuedLine.assetId }, data: { quantity: { increment: line.quantity } } });
            await tx.inventoryRequestLine.update({ where: { id: issuedLine.id }, data: { returnedQty: { increment: line.quantity } } });
            await tx.inventoryStockMovement.create({
                data: {
                    organizationId, assetId: issuedLine.assetId, warehouseId: returnRequest.warehouseId,
                    requestId: returnRequest.requestId, requestLineId: issuedLine.id, returnRequestId: returnRequest.id,
                    type: "RETURN", quantityDelta: line.quantity,
                    reason: `Return ${line.condition || "GOOD"}${requiresMaintenance ? " · held for maintenance" : ""}`,
                    actorId: reviewerId,
                },
            });
            if (requiresMaintenance) {
                await tx.inventoryConditionReport.create({
                    data: {
                        organizationId, assetId: issuedLine.assetId, warehouseId: returnRequest.warehouseId,
                        requestId: returnRequest.requestId, requestLineId: issuedLine.id,
                        reportedById: returnRequest.requestedById, reviewedById: reviewerId,
                        quantity: line.quantity,
                        description: `Returned with condition: ${line.condition || "DAMAGED"}. ${input.note || ""}`.trim(),
                        status: "IN_REPAIR", reviewedAt: new Date(),
                    },
                });
            }
        }

        const updatedReturn = await tx.inventoryReturnRequest.update({
            where: { id: returnRequest.id },
            data: { status: "RECEIVED", reviewedById: reviewerId, reviewedAt: new Date(), receivedAt: new Date(), reviewNote: input.note || null },
            include: returnInclude,
        });
        const parentLines = await tx.inventoryRequestLine.findMany({ where: { requestId: returnRequest.requestId }, include: { asset: { select: { type: true } } } });
        const returnableLines = parentLines.filter(line => line.asset.type !== "MATERIAL");
        if (returnableLines.some(line => line.returnedQty.greaterThan(0))) {
            const allReturned = returnableLines.length > 0 && returnableLines.every(line => line.returnedQty.greaterThanOrEqualTo(line.issuedQty));
            await tx.inventoryRequest.update({ where: { id: returnRequest.requestId }, data: { status: allReturned ? "RETURNED" : "PARTIALLY_RETURNED" } });
        }
        return updatedReturn;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
