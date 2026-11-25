// Study: Connect HTTP methods and paths to middleware and handlers for worker records and their professions.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";

// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";

// Study: Import `* as labourController` from `"./labour.controller"`.
import * as labourController from "./labour.controller";
// Study: Import `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"`.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadLabourImage`.
const uploadLabourImage = createImageUploadMiddleware({
    // Study: Provide the callback used for `directory`.
    directory: req => {
        // Study: Run the following branch when `!req.user?.organizationId` is truthy and throw `new BadRequestError("Labour organization context is missing.")`.
        if (!req.user?.organizationId) throw new BadRequestError("Labour organization context is missing.");
        // Study: Return `'labour/${req.user.organizationId}'` to the caller.
        return `labour/${req.user.organizationId}`;
    // Study: Close the code block.
    },
// Study: Close the object literal.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// Study: Register POST / with `labourController.createLabour` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Call `authorize`.
    authorize(Module.LABOUR, Action.CREATE),
    // Study: Supply `uploadLabourImage` to the surrounding statement.
    uploadLabourImage,
    // Study: Supply `labourController` to the surrounding statement.
    labourController.createLabour
// Study: Close the call arguments.
);

// Study: Register GET / with `labourController.getOrganizationLabours` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Call `authorize`.
    authorize(Module.LABOUR, Action.VIEW),
    // Study: Supply `labourController` to the surrounding statement.
    labourController.getOrganizationLabours
// Study: Close the call arguments.
);

// Study: Register GET /:id with `labourController.getLabourById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Call `authorize`.
    authorize(Module.LABOUR, Action.VIEW),
    // Study: Supply `labourController` to the surrounding statement.
    labourController.getLabourById
// Study: Close the call arguments.
);

// Study: Register PATCH /:id with `labourController.updateLabour` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Call `authorize`.
    authorize(Module.LABOUR, Action.UPDATE),
    // Study: Supply `uploadLabourImage` to the surrounding statement.
    uploadLabourImage,
    // Study: Supply `labourController` to the surrounding statement.
    labourController.updateLabour
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
