import { Router } from "express";
import { Action, Module } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import * as controller from "./inventory.controller";
import { requireInventoryOrganization } from "./inventory-context.middleware";
import { uploadSingleImage } from "../../middlewares/upload-image.middleware";
import { BadRequestError } from "../../errors/BadRequestError";

const uploadInventoryImage = uploadSingleImage({
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

router.get("/assets", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryAssets);
router.post("/assets", authorize(Module.INVENTORY, Action.CREATE), uploadInventoryImage, controller.createInventoryAsset);
router.get("/assets/:id", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryAsset);
router.patch("/assets/:id", authorize(Module.INVENTORY, Action.UPDATE), uploadInventoryImage, controller.updateInventoryAsset);
router.delete("/assets/:id", authorize(Module.INVENTORY, Action.DELETE), controller.deleteInventoryAsset);

export default router;
