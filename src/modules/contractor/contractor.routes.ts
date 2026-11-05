import { Router } from "express";

import * as contractorController from "./contractor.controller";

import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { Module, Action } from "@prisma/client";
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
import { BadRequestError } from "../../errors/BadRequestError";

const uploadContractorImage = createImageUploadMiddleware({
    directory: req => {
        if (!req.user?.organizationId) throw new BadRequestError("Contractor organization context is missing.");
        return `contractors/${req.user.organizationId}`;
    },
});

const router = Router();

// Create Contractor
router.post(
    "/",
    authenticate,
    authorize(Module.CONTRACTOR, Action.CREATE),
    uploadContractorImage,
    contractorController.createContractor
);

// Get Organization Contractors
router.get(
    "/",
    authenticate,
    authorize(Module.CONTRACTOR, Action.VIEW),
    contractorController.getOrganizationContractors
);

// Get Contractor By ID
router.get(
    "/:id",
    authenticate,
    authorize(Module.CONTRACTOR, Action.VIEW),
    contractorController.getContractorById
);

// Update Contractor
router.patch(
    "/:id",
    authenticate,
    authorize(Module.CONTRACTOR, Action.UPDATE),
    uploadContractorImage,
    contractorController.updateContractor
);

export default router;
