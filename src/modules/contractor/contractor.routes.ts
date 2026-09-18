import { Router } from "express";

import * as contractorController from "./contractor.controller";

import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { Module, Action } from "@prisma/client";

const router = Router();

// Create Contractor
router.post(
    "/",
    authenticate,
    authorize(Module.CONTRACTOR, Action.CREATE),
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
    contractorController.updateContractor
);

export default router;
