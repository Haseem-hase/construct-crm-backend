// Study: Connect HTTP methods and paths to middleware and handlers for contractor records.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";

// Study: Import `* as contractorController` from `"./contractor.controller"`.
import * as contractorController from "./contractor.controller";

// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";
// Study: Import `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"`.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadContractorImage`.
const uploadContractorImage = createImageUploadMiddleware({
    // Study: Provide the callback used for `directory`.
    directory: req => {
        // Study: Run the following branch when `!req.user?.organizationId` is truthy and throw `new BadRequestError("Contractor organization context is missing.")`.
        if (!req.user?.organizationId) throw new BadRequestError("Contractor organization context is missing.");
        // Study: Return `'contractors/${req.user.organizationId}'` to the caller.
        return `contractors/${req.user.organizationId}`;
    // Study: Close the code block.
    },
// Study: Close the object literal.
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
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.CREATE),
    // Study: Supply `uploadContractorImage` to the surrounding statement.
    uploadContractorImage,
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.createContractor
// Study: Close the call arguments.
);

// Get Organization Contractors
// Study: Register GET / with `contractorController.getOrganizationContractors` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.getOrganizationContractors
// Study: Close the call arguments.
);

// Get Contractor By ID
// Study: Register GET /:id with `contractorController.getContractorById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.getContractorById
// Study: Close the call arguments.
);

// Update Contractor
// Study: Register PATCH /:id with `contractorController.updateContractor` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.UPDATE),
    // Study: Supply `uploadContractorImage` to the surrounding statement.
    uploadContractorImage,
    // Study: Supply `contractorController` to the surrounding statement.
    contractorController.updateContractor
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
