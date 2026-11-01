import { Router } from "express";
import { Action, Module } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import * as controller from "./inventory.controller";
import { requireInventoryOrganization } from "./inventory-context.middleware";

const router = Router();
router.use(authenticate, requireInventoryOrganization);

router.get("/assets", authorize(Module.INVENTORY, Action.VIEW), controller.listInventoryAssets);
router.post("/assets", authorize(Module.INVENTORY, Action.CREATE), controller.createInventoryAsset);
router.get("/assets/:id", authorize(Module.INVENTORY, Action.VIEW), controller.getInventoryAsset);
router.patch("/assets/:id", authorize(Module.INVENTORY, Action.UPDATE), controller.updateInventoryAsset);
router.delete("/assets/:id", authorize(Module.INVENTORY, Action.DELETE), controller.deleteInventoryAsset);

export default router;
