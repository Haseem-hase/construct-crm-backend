import { NextFunction, Request, Response } from "express";
import { inventoryOrganizationId } from "./inventory-context.middleware";
import * as service from "./inventory.service";
import * as workflowService from "./inventory-workflow.service";
import { idParamsSchema, inventoryAssetListSchema, inventoryAssetSchema, inventoryAssetUpdateSchema, inventoryWarehouseSchema, stockAdjustmentSchema, warehouseStockListSchema, inventoryRequestSchema, inventoryRequestListSchema, inventoryRequestReviewSchema, inventoryReturnSchema, inventoryReturnReviewSchema, inventoryConditionReportSchema, inventoryConditionReviewSchema } from "./inventory.validation";

type Handler = (req: Request, res: Response) => Promise<unknown>;
const handle = (message: string, statusCode: number, key: string, action: Handler) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await action(req, res);
            res.status(statusCode).json({ success: true, message, data: { [key]: result } });
        } catch (error) { next(error); }
    };

const organization = (_req: Request, res: Response) => inventoryOrganizationId(res);
const id = (req: Request) => idParamsSchema.parse(req.params).id;

export const listInventoryAssets = handle("Inventory records retrieved.", 200, "result", (req, res) => service.listInventoryAssets(organization(req, res), inventoryAssetListSchema.parse(req.query)));
export const getInventoryAsset = handle("Inventory record retrieved.", 200, "asset", (req, res) => service.getInventoryAsset(organization(req, res), id(req)));
const inventoryInput = (req: Request, res: Response) => ({
    ...req.body,
    ...(req.file ? { imageUrl: `/uploads/inventory/${inventoryOrganizationId(res)}/${req.file.filename}` } : {}),
});

export const createInventoryAsset = handle("Inventory record created.", 201, "asset", (req, res) => service.createInventoryAsset(organization(req, res), inventoryAssetSchema.parse(inventoryInput(req, res)), req.user!.id));
export const updateInventoryAsset = handle("Inventory record updated.", 200, "asset", (req, res) => service.updateInventoryAsset(organization(req, res), id(req), inventoryAssetUpdateSchema.parse(inventoryInput(req, res)), req.user!.id));
export const deleteInventoryAsset = handle("Inventory record deactivated.", 200, "asset", (req, res) => service.deactivateInventoryAsset(organization(req, res), id(req)));
export const listInventoryWarehouses = handle("Inventory warehouses retrieved.", 200, "warehouses", (req, res) => service.listInventoryWarehouses(organization(req, res)));
export const createInventoryWarehouse = handle("Inventory warehouse created.", 201, "warehouse", (req, res) => service.createInventoryWarehouse(organization(req, res), inventoryWarehouseSchema.parse(req.body)));
export const listWarehouseStock = handle("Warehouse stock retrieved.", 200, "stock", (req, res) => {
    const query = warehouseStockListSchema.parse(req.query);
    return service.listWarehouseStock(organization(req, res), query.warehouseId, query.search);
});
export const adjustWarehouseStock = handle("Warehouse stock adjusted.", 201, "movement", (req, res) => {
    const user = req.user!;
    return service.adjustWarehouseStock(organization(req, res), user.id, stockAdjustmentSchema.parse(req.body));
});
export const listInventoryRequests = handle("Inventory requests retrieved.", 200, "requests", (req, res) => {
    const query = inventoryRequestListSchema.parse(req.query);
    return workflowService.listInventoryRequests(organization(req, res), query.status);
});
export const createInventoryRequest = handle("Inventory request submitted.", 201, "request", (req, res) =>
    workflowService.createInventoryRequest(organization(req, res), req.user!.id, inventoryRequestSchema.parse(req.body)));
export const reviewInventoryRequest = handle("Inventory request reviewed.", 200, "request", (req, res) =>
    workflowService.reviewInventoryRequest(organization(req, res), id(req), req.user!.id, inventoryRequestReviewSchema.parse(req.body)));
export const issueInventoryRequest = handle("Inventory request issued.", 200, "request", (req, res) =>
    workflowService.issueInventoryRequest(organization(req, res), id(req), req.user!.id));
export const listInventoryReturns = handle("Inventory return requests retrieved.", 200, "returns", (req, res) =>
    workflowService.listInventoryReturns(organization(req, res)));
export const createInventoryReturn = handle("Inventory return submitted.", 201, "return", (req, res) =>
    workflowService.createInventoryReturn(organization(req, res), req.user!.id, inventoryReturnSchema.parse(req.body)));
export const reviewInventoryReturn = handle("Inventory return reviewed.", 200, "return", (req, res) =>
    workflowService.reviewInventoryReturn(organization(req, res), id(req), req.user!.id, inventoryReturnReviewSchema.parse(req.body)));
export const listInventoryConditionReports = handle("Inventory condition reports retrieved.", 200, "reports", (req, res) =>
    workflowService.listInventoryConditionReports(organization(req, res)));
export const createInventoryConditionReport = handle("Inventory condition report submitted.", 201, "report", (req, res) =>
    workflowService.createInventoryConditionReport(organization(req, res), req.user!.id, inventoryConditionReportSchema.parse(req.body)));
export const reviewInventoryConditionReport = handle("Inventory condition report updated.", 200, "report", (req, res) =>
    workflowService.reviewInventoryConditionReport(organization(req, res), id(req), req.user!.id, inventoryConditionReviewSchema.parse(req.body)));

export const getInventoryRequestOptions = handle("Inventory request options retrieved.", 200, "options", (req, res) => service.getInventoryRequestOptions(organization(req, res)));
