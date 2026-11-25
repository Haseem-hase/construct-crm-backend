// Study: This file is about tools, equipment, and materials that warehouses store, issue, and take back. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ NextFunction, Request, Response }` from `"express"` so this file can use it.
import { NextFunction, Request, Response } from "express";
// Study: Bring in `{ inventoryOrganizationId }` from `"./inventory-context.middleware"` so this file can use it.
import { inventoryOrganizationId } from "./inventory-context.middleware";
// Study: Bring in `* as service` from `"./inventory.service"` so this file can use it.
import * as service from "./inventory.service";
// Study: Bring in `* as workflowService` from `"./inventory-workflow.service"` so this file can use it.
import * as workflowService from "./inventory-workflow.service";
// Study: Bring in `{ idParamsSchema, inventoryAssetListSchema, inventoryAssetSchema, inventoryAssetUpd…` from `"./inventory.validation"` so this file can use it.
import { idParamsSchema, inventoryAssetListSchema, inventoryAssetSchema, inventoryAssetUpdateSchema, inventoryWarehouseSchema, stockAdjustmentSchema, warehouseStockListSchema, inventoryRequestSchema, inventoryRequestListSchema, inventoryRequestReviewSchema, inventoryReturnSchema, inventoryReturnReviewSchema, inventoryConditionReportSchema, inventoryConditionReviewSchema } from "./inventory.validation";

// Study: Describe which information `Handler` can contain so TypeScript can catch mistakes while checking the code.
type Handler = (req: Request, res: Response) => Promise<unknown>;
// Study: Set up a reusable step named `handle`.
const handle = (message: string, statusCode: number, key: string, action: Handler) =>
    // Study: Supply `req` to the surrounding statement.
    async (req: Request, res: Response, next: NextFunction) => {
        // Study: Try these steps. If one fails, go to the error-handling steps below.
        try {
            // Study: Call `action` and wait for it to finish and store its result in `result`.
            const result = await action(req, res);
            // Study: Send named information back to the screen as JSON.
            res.status(statusCode).json({ success: true, message, data: { [key]: result } });
        // Study: Handle a problem raised during the steps above.
        } catch (error) { next(error); }
    // Study: End this group of steps.
    };

// Study: Set up a reusable step named `organization`.
const organization = (_req: Request, res: Response) => inventoryOrganizationId(res);
// Study: Set up a reusable step named `id`.
const id = (req: Request) => idParamsSchema.parse(req.params).id;

// Study: Wrap the action in an HTTP handler that returns status `200` and the `"result"` payload and store the result as `listInventoryAssets`.
export const listInventoryAssets = handle("Inventory records retrieved.", 200, "result", (req, res) => service.listInventoryAssets(organization(req, res), inventoryAssetListSchema.parse(req.query)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"asset"` payload and store the result as `getInventoryAsset`.
export const getInventoryAsset = handle("Inventory record retrieved.", 200, "asset", (req, res) => service.getInventoryAsset(organization(req, res), id(req)));
// Study: Set up a reusable step named `inventoryInput`.
const inventoryInput = (req: Request, res: Response) => ({
    // Study: Expand the values from `req.body` into the surrounding collection.
    ...req.body,
    // Study: Expand the values from `(req.file ? { imageUrl: '/uploads/inventory/${inventoryOrganizationId(res)}/${req.f…` into the surrounding collection.
    ...(req.file ? { imageUrl: `/uploads/inventory/${inventoryOrganizationId(res)}/${req.file.filename}` } : {}),
// Study: End this group of values.
});

// Study: Wrap the action in an HTTP handler that returns status `201` and the `"asset"` payload and store the result as `createInventoryAsset`.
export const createInventoryAsset = handle("Inventory record created.", 201, "asset", (req, res) => service.createInventoryAsset(organization(req, res), inventoryAssetSchema.parse(inventoryInput(req, res)), req.user!.id));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"asset"` payload and store the result as `updateInventoryAsset`.
export const updateInventoryAsset = handle("Inventory record updated.", 200, "asset", (req, res) => service.updateInventoryAsset(organization(req, res), id(req), inventoryAssetUpdateSchema.parse(inventoryInput(req, res)), req.user!.id));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"asset"` payload and store the result as `deleteInventoryAsset`.
export const deleteInventoryAsset = handle("Inventory record deactivated.", 200, "asset", (req, res) => service.deactivateInventoryAsset(organization(req, res), id(req)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"warehouses"` payload and store the result as `listInventoryWarehouses`.
export const listInventoryWarehouses = handle("Inventory warehouses retrieved.", 200, "warehouses", (req, res) => service.listInventoryWarehouses(organization(req, res)));
// Study: Wrap the action in an HTTP handler that returns status `201` and the `"warehouse"` payload and store the result as `createInventoryWarehouse`.
export const createInventoryWarehouse = handle("Inventory warehouse created.", 201, "warehouse", (req, res) => service.createInventoryWarehouse(organization(req, res), inventoryWarehouseSchema.parse(req.body)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"stock"` payload and store the result as `listWarehouseStock`.
export const listWarehouseStock = handle("Warehouse stock retrieved.", 200, "stock", (req, res) => {
    // Study: Check `req.query` using the rule `warehouseStockListSchema` and obtain the parsed value and store the result as `query`.
    const query = warehouseStockListSchema.parse(req.query);
    // Study: Give `service.listWarehouseStock(organization(req, res), query.warehouseId, query.search)` back to the code that asked for it.
    return service.listWarehouseStock(organization(req, res), query.warehouseId, query.search);
// Study: End this group of steps.
});
// Study: Wrap the action in an HTTP handler that returns status `201` and the `"movement"` payload and store the result as `adjustWarehouseStock`.
export const adjustWarehouseStock = handle("Warehouse stock adjusted.", 201, "movement", (req, res) => {
    // Study: Set `user` to `req.user!`.
    const user = req.user!;
    // Study: Give `service.adjustWarehouseStock(organization(req, res), user.id, stockAdjustmentSchema…` back to the code that asked for it.
    return service.adjustWarehouseStock(organization(req, res), user.id, stockAdjustmentSchema.parse(req.body));
// Study: End this group of steps.
});
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"requests"` payload and store the result as `listInventoryRequests`.
export const listInventoryRequests = handle("Inventory requests retrieved.", 200, "requests", (req, res) => {
    // Study: Check `req.query` using the rule `inventoryRequestListSchema` and obtain the parsed value and store the result as `query`.
    const query = inventoryRequestListSchema.parse(req.query);
    // Study: Give `workflowService.listInventoryRequests(organization(req, res), query.status)` back to the code that asked for it.
    return workflowService.listInventoryRequests(organization(req, res), query.status);
// Study: End this group of steps.
});
// Study: Wrap the action in an HTTP handler that returns status `201` and the `"request"` payload and store the result as `createInventoryRequest`.
export const createInventoryRequest = handle("Inventory request submitted.", 201, "request", (req, res) =>
    // Study: Call `workflowService.createInventoryRequest`.
    workflowService.createInventoryRequest(organization(req, res), req.user!.id, inventoryRequestSchema.parse(req.body)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"request"` payload and store the result as `reviewInventoryRequest`.
export const reviewInventoryRequest = handle("Inventory request reviewed.", 200, "request", (req, res) =>
    // Study: Call `workflowService.reviewInventoryRequest`.
    workflowService.reviewInventoryRequest(organization(req, res), id(req), req.user!.id, inventoryRequestReviewSchema.parse(req.body)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"request"` payload and store the result as `issueInventoryRequest`.
export const issueInventoryRequest = handle("Inventory request issued.", 200, "request", (req, res) =>
    // Study: Call `workflowService.issueInventoryRequest`.
    workflowService.issueInventoryRequest(organization(req, res), id(req), req.user!.id));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"returns"` payload and store the result as `listInventoryReturns`.
export const listInventoryReturns = handle("Inventory return requests retrieved.", 200, "returns", (req, res) =>
    // Study: Call `workflowService.listInventoryReturns`.
    workflowService.listInventoryReturns(organization(req, res)));
// Study: Wrap the action in an HTTP handler that returns status `201` and the `"return"` payload and store the result as `createInventoryReturn`.
export const createInventoryReturn = handle("Inventory return submitted.", 201, "return", (req, res) =>
    // Study: Call `workflowService.createInventoryReturn`.
    workflowService.createInventoryReturn(organization(req, res), req.user!.id, inventoryReturnSchema.parse(req.body)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"return"` payload and store the result as `reviewInventoryReturn`.
export const reviewInventoryReturn = handle("Inventory return reviewed.", 200, "return", (req, res) =>
    // Study: Call `workflowService.reviewInventoryReturn`.
    workflowService.reviewInventoryReturn(organization(req, res), id(req), req.user!.id, inventoryReturnReviewSchema.parse(req.body)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"reports"` payload and store the result as `listInventoryConditionReports`.
export const listInventoryConditionReports = handle("Inventory condition reports retrieved.", 200, "reports", (req, res) =>
    // Study: Call `workflowService.listInventoryConditionReports`.
    workflowService.listInventoryConditionReports(organization(req, res)));
// Study: Wrap the action in an HTTP handler that returns status `201` and the `"report"` payload and store the result as `createInventoryConditionReport`.
export const createInventoryConditionReport = handle("Inventory condition report submitted.", 201, "report", (req, res) =>
    // Study: Call `workflowService.createInventoryConditionReport`.
    workflowService.createInventoryConditionReport(organization(req, res), req.user!.id, inventoryConditionReportSchema.parse(req.body)));
// Study: Wrap the action in an HTTP handler that returns status `200` and the `"report"` payload and store the result as `reviewInventoryConditionReport`.
export const reviewInventoryConditionReport = handle("Inventory condition report updated.", 200, "report", (req, res) =>
    // Study: Call `workflowService.reviewInventoryConditionReport`.
    workflowService.reviewInventoryConditionReport(organization(req, res), id(req), req.user!.id, inventoryConditionReviewSchema.parse(req.body)));

// Study: Wrap the action in an HTTP handler that returns status `200` and the `"options"` payload and store the result as `getInventoryRequestOptions`.
export const getInventoryRequestOptions = handle("Inventory request options retrieved.", 200, "options", (req, res) => service.getInventoryRequestOptions(organization(req, res)));
