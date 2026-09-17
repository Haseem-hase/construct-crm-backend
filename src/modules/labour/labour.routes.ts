import { Router } from "express";
import { Module, Action } from "@prisma/client";

import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

import * as labourController from "./labour.controller";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    authorize(Module.LABOUR, Action.CREATE),
    labourController.createLabour
);

router.get(
    "/",
    authorize(Module.LABOUR, Action.VIEW),
    labourController.getOrganizationLabours
);

router.get(
    "/:id",
    authorize(Module.LABOUR, Action.VIEW),
    labourController.getLabourById
);

router.patch(
    "/:id",
    authorize(Module.LABOUR, Action.UPDATE),
    labourController.updateLabour
);

export default router;
