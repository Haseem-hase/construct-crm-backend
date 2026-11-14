import { Router } from "express";
import { Action, Module } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import * as controller from "./inventory.controller";
import { requireInventoryOrganization } from "./inventory-context.middleware";
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
import { BadRequestError } from "../../errors/BadRequestError";

const uploadInventoryImage = createImageUploadMiddleware({
    directory: (req) => {
        const organizationId = req.user?.systemRole === "SUPER_ADMIN"
            ? req.header("x-organization-id")
            : req.user?.organizationId;
        if (!organizationId) throw new BadRequestError("Inventory organization context is missing.");
        return `inventory/${organizationId}`;
    },
});

const router = Router();
router.use(authenticate, requireInventoryOrganization);

router.get("/request-options", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryRequestOptions);
router.get("/assets", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryAssets);
router.get("/warehouses", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryWarehouses);
router.post("/warehouses", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryWarehouse);
router.get("/stock", authorize(Module.INVENTORY, Action.VIEW), controller.listWarehouseStock);
router.post("/stock/adjustments", authorize(Module.INVENTORY, Action.UPDATE), controller.adjustWarehouseStock);
router.get("/requests", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryRequests);
router.post("/requests", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryRequest);
router.post("/requests/:id/review", authorize(Module.INVENTORY, Action.APPROVE), controller.reviewInventoryRequest);
router.post("/requests/:id/issue", authorize(Module.INVENTORY, Action.UPDATE), controller.issueInventoryRequest);
router.get("/returns", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryReturns);
router.post("/returns", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryReturn);
router.post("/returns/:id/review", authorize(Module.INVENTORY, Action.APPROVE), controller.reviewInventoryReturn);
router.get("/condition-reports", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryConditionReports);
router.post("/condition-reports", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryConditionReport);
router.patch("/condition-reports/:id", authorize(Module.INVENTORY, Action.UPDATE), controller.reviewInventoryConditionReport);
router.post("/assets", authorize(Module.INVENTORY, Action.CREATE), uploadInventoryImage, controller.createInventoryAsset);
router.get("/assets/:id", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryAsset);
router.patch("/assets/:id", authorize(Module.INVENTORY, Action.UPDATE), uploadInventoryImage, controller.updateInventoryAsset);
router.delete("/assets/:id", authorize(Module.INVENTORY, Action.DELETE), controller.deleteInventoryAsset);

export default router;
