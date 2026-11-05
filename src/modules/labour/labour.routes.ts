import { Router } from "express";
import { Module, Action } from "@prisma/client";

import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

import * as labourController from "./labour.controller";
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
import { BadRequestError } from "../../errors/BadRequestError";

const uploadLabourImage = createImageUploadMiddleware({
    directory: req => {
        if (!req.user?.organizationId) throw new BadRequestError("Labour organization context is missing.");
        return `labour/${req.user.organizationId}`;
    },
});

const router = Router();

router.use(authenticate);

router.post(
    "/",
    authorize(Module.LABOUR, Action.CREATE),
    uploadLabourImage,
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
    uploadLabourImage,
    labourController.updateLabour
);

export default router;
