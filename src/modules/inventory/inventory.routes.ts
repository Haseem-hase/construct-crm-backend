// Study: This file is about tools, equipment, and materials that warehouses store, issue, and take back. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ Action, Module }` from `"@prisma/client"` so this file can use it.
import { Action, Module } from "@prisma/client";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `* as controller` from `"./inventory.controller"` so this file can use it.
import * as controller from "./inventory.controller";
// Study: Bring in `{ requireInventoryOrganization }` from `"./inventory-context.middleware"` so this file can use it.
import { requireInventoryOrganization } from "./inventory-context.middleware";
// Study: Bring in `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"` so this file can use it.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadInventoryImage`.
const uploadInventoryImage = createImageUploadMiddleware({
    // Study: Give `directory` a step to run later when it needs a result.
    directory: (req) => {
        // Study: Set `organizationId` to `req.user?.systemRole === "SUPER_ADMIN" ? req.header("x-organization-id") : req.user…`.
        const organizationId = req.user?.systemRole === "SUPER_ADMIN"
            // Study: Use this value if the check above passes.
            ? req.header("x-organization-id")
            // Study: Use this value if the check above fails.
            : req.user?.organizationId;
        // Study: Do the next step if there is no value for `organizationId` . If so, stop and report "Inventory organization context is missing."
        if (!organizationId) throw new BadRequestError("Inventory organization context is missing.");
        // Study: Give `'inventory/${organizationId}'` back to the code that asked for it.
        return `inventory/${organizationId}`;
    // Study: End this group of steps.
    },
// Study: End this group of values.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();
// Study: Mount Express middleware or a child router with `requireInventoryOrganization`.
router.use(authenticate, requireInventoryOrganization);

// Study: When the screen asks to read information, use this GET address (`/request-options`). First check their permission.
router.get("/request-options", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryRequestOptions);
// Study: When the screen asks to read information, use this GET address (`/assets`). First check their permission.
router.get("/assets", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryAssets);
// Study: When the screen asks to read information, use this GET address (`/warehouses`). First check their permission.
router.get("/warehouses", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryWarehouses);
// Study: When the screen asks to submit information, use this POST address (`/warehouses`). First check their permission.
router.post("/warehouses", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryWarehouse);
// Study: When the screen asks to read information, use this GET address (`/stock`). First check their permission.
router.get("/stock", authorize(Module.INVENTORY, Action.VIEW), controller.listWarehouseStock);
// Study: When the screen asks to submit information, use this POST address (`/stock/adjustments`). First check their permission.
router.post("/stock/adjustments", authorize(Module.INVENTORY, Action.UPDATE), controller.adjustWarehouseStock);
// Study: When the screen asks to read information, use this GET address (`/requests`). First check their permission.
router.get("/requests", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryRequests);
// Study: When the screen asks to submit information, use this POST address (`/requests`). First check their permission.
router.post("/requests", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryRequest);
// Study: When the screen asks to submit information, use this POST address (`/requests/:id/review`). First check their permission.
router.post("/requests/:id/review", authorize(Module.INVENTORY, Action.APPROVE), controller.reviewInventoryRequest);
// Study: When the screen asks to submit information, use this POST address (`/requests/:id/issue`). First check their permission.
router.post("/requests/:id/issue", authorize(Module.INVENTORY, Action.UPDATE), controller.issueInventoryRequest);
// Study: When the screen asks to read information, use this GET address (`/returns`). First check their permission.
router.get("/returns", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryReturns);
// Study: When the screen asks to submit information, use this POST address (`/returns`). First check their permission.
router.post("/returns", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryReturn);
// Study: When the screen asks to submit information, use this POST address (`/returns/:id/review`). First check their permission.
router.post("/returns/:id/review", authorize(Module.INVENTORY, Action.APPROVE), controller.reviewInventoryReturn);
// Study: When the screen asks to read information, use this GET address (`/condition-reports`). First check their permission.
router.get("/condition-reports", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryConditionReports);
// Study: When the screen asks to submit information, use this POST address (`/condition-reports`). First check their permission.
router.post("/condition-reports", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryConditionReport);
// Study: When the screen asks to update part of a record, use this PATCH address (`/condition-reports/:id`). First check their permission.
router.patch("/condition-reports/:id", authorize(Module.INVENTORY, Action.UPDATE), controller.reviewInventoryConditionReport);
// Study: When the screen asks to submit information, use this POST address (`/assets`). First check their permission.
router.post("/assets", authorize(Module.INVENTORY, Action.CREATE), uploadInventoryImage, controller.createInventoryAsset);
// Study: When the screen asks to read information, use this GET address (`/assets/:id`). First check their permission.
router.get("/assets/:id", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryAsset);
// Study: When the screen asks to update part of a record, use this PATCH address (`/assets/:id`). First check their permission.
router.patch("/assets/:id", authorize(Module.INVENTORY, Action.UPDATE), uploadInventoryImage, controller.updateInventoryAsset);
// Study: When the screen asks to remove a record, use this DELETE address (`/assets/:id`). First check their permission.
router.delete("/assets/:id", authorize(Module.INVENTORY, Action.DELETE), controller.deleteInventoryAsset);

// Study: Make `router` the main thing other files can get from this file.
export default router;
