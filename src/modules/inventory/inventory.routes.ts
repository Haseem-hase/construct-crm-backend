// Study: Connect HTTP methods and paths to middleware and handlers for inventory assets, warehouse stock, requests, returns, and condition reports.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ Action, Module }` from `"@prisma/client"`.
import { Action, Module } from "@prisma/client";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `* as controller` from `"./inventory.controller"`.
import * as controller from "./inventory.controller";
// Study: Import `{ requireInventoryOrganization }` from `"./inventory-context.middleware"`.
import { requireInventoryOrganization } from "./inventory-context.middleware";
// Study: Import `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"`.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadInventoryImage`.
const uploadInventoryImage = createImageUploadMiddleware({
    // Study: Provide the callback used for `directory`.
    directory: (req) => {
        // Study: Set `organizationId` to `req.user?.systemRole === "SUPER_ADMIN" ? req.header("x-organization-id") : req.user…`.
        const organizationId = req.user?.systemRole === "SUPER_ADMIN"
            // Study: Use this value when the preceding condition is truthy.
            ? req.header("x-organization-id")
            // Study: Use this value when the preceding condition is falsy.
            : req.user?.organizationId;
        // Study: Run the following branch when `!organizationId` is truthy and throw `new BadRequestError("Inventory organization context is missing.")`.
        if (!organizationId) throw new BadRequestError("Inventory organization context is missing.");
        // Study: Return `'inventory/${organizationId}'` to the caller.
        return `inventory/${organizationId}`;
    // Study: Close the code block.
    },
// Study: Close the object literal.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();
// Study: Mount Express middleware or a child router with `requireInventoryOrganization`.
router.use(authenticate, requireInventoryOrganization);

// Study: Register GET /request-options with `controller.getInventoryRequestOptions` after the listed middleware.
router.get("/request-options", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryRequestOptions);
// Study: Register GET /assets with `controller.listInventoryAssets` after the listed middleware.
router.get("/assets", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryAssets);
// Study: Register GET /warehouses with `controller.listInventoryWarehouses` after the listed middleware.
router.get("/warehouses", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryWarehouses);
// Study: Register POST /warehouses with `controller.createInventoryWarehouse` after the listed middleware.
router.post("/warehouses", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryWarehouse);
// Study: Register GET /stock with `controller.listWarehouseStock` after the listed middleware.
router.get("/stock", authorize(Module.INVENTORY, Action.VIEW), controller.listWarehouseStock);
// Study: Register POST /stock/adjustments with `controller.adjustWarehouseStock` after the listed middleware.
router.post("/stock/adjustments", authorize(Module.INVENTORY, Action.UPDATE), controller.adjustWarehouseStock);
// Study: Register GET /requests with `controller.listInventoryRequests` after the listed middleware.
router.get("/requests", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryRequests);
// Study: Register POST /requests with `controller.createInventoryRequest` after the listed middleware.
router.post("/requests", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryRequest);
// Study: Register POST /requests/:id/review with `controller.reviewInventoryRequest` after the listed middleware.
router.post("/requests/:id/review", authorize(Module.INVENTORY, Action.APPROVE), controller.reviewInventoryRequest);
// Study: Register POST /requests/:id/issue with `controller.issueInventoryRequest` after the listed middleware.
router.post("/requests/:id/issue", authorize(Module.INVENTORY, Action.UPDATE), controller.issueInventoryRequest);
// Study: Register GET /returns with `controller.listInventoryReturns` after the listed middleware.
router.get("/returns", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryReturns);
// Study: Register POST /returns with `controller.createInventoryReturn` after the listed middleware.
router.post("/returns", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryReturn);
// Study: Register POST /returns/:id/review with `controller.reviewInventoryReturn` after the listed middleware.
router.post("/returns/:id/review", authorize(Module.INVENTORY, Action.APPROVE), controller.reviewInventoryReturn);
// Study: Register GET /condition-reports with `controller.listInventoryConditionReports` after the listed middleware.
router.get("/condition-reports", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryConditionReports);
// Study: Register POST /condition-reports with `controller.createInventoryConditionReport` after the listed middleware.
router.post("/condition-reports", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryConditionReport);
// Study: Register PATCH /condition-reports/:id with `controller.reviewInventoryConditionReport` after the listed middleware.
router.patch("/condition-reports/:id", authorize(Module.INVENTORY, Action.UPDATE), controller.reviewInventoryConditionReport);
// Study: Register POST /assets with `controller.createInventoryAsset` after the listed middleware.
router.post("/assets", authorize(Module.INVENTORY, Action.CREATE), uploadInventoryImage, controller.createInventoryAsset);
// Study: Register GET /assets/:id with `controller.getInventoryAsset` after the listed middleware.
router.get("/assets/:id", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryAsset);
// Study: Register PATCH /assets/:id with `controller.updateInventoryAsset` after the listed middleware.
router.patch("/assets/:id", authorize(Module.INVENTORY, Action.UPDATE), uploadInventoryImage, controller.updateInventoryAsset);
// Study: Register DELETE /assets/:id with `controller.deleteInventoryAsset` after the listed middleware.
router.delete("/assets/:id", authorize(Module.INVENTORY, Action.DELETE), controller.deleteInventoryAsset);

// Study: Expose `router` as the default export.
export default router;
