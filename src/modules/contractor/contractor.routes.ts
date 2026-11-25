// Study: This file is about the details the CRM keeps about contractors. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";

// Study: Bring in `* as contractorController` from `"./contractor.controller"` so this file can use it.
import * as contractorController from "./contractor.controller";

// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";
// Study: Bring in `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"` so this file can use it.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadContractorImage`.
const uploadContractorImage = createImageUploadMiddleware({
    // Study: Give `directory` a step to run later when it needs a result.
    directory: req => {
        // Study: Do the next step if this check passes: `!req.user?.organizationId` . If so, stop and report "Contractor organization context is missing."
        if (!req.user?.organizationId) throw new BadRequestError("Contractor organization context is missing.");
        // Study: Give `'contractors/${req.user.organizationId}'` back to the code that asked for it.
        return `contractors/${req.user.organizationId}`;
    // Study: End this group of steps.
    },
// Study: End this group of values.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Create Contractor
// Study: Register POST / with `contractorController.createContractor` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.CREATE),
    // Study: Supply `uploadContractorImage` to the surrounding statement.
    uploadContractorImage,
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.createContractor
// Study: End the list of information being sent to this step.
);

// Get Organization Contractors
// Study: Register GET / with `contractorController.getOrganizationContractors` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.getOrganizationContractors
// Study: End the list of information being sent to this step.
);

// Get Contractor By ID
// Study: Register GET /:id with `contractorController.getContractorById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.getContractorById
// Study: End the list of information being sent to this step.
);

// Update Contractor
// Study: Register PATCH /:id with `contractorController.updateContractor` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.UPDATE),
    // Study: Supply `uploadContractorImage` to the surrounding statement.
    uploadContractorImage,
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.updateContractor
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
