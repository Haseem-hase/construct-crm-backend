// Study: This file is about workers and the kinds of work they do. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";

// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";

// Study: Bring in `* as labourController` from `"./labour.controller"` so this file can use it.
import * as labourController from "./labour.controller";
// Study: Bring in `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"` so this file can use it.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadLabourImage`.
const uploadLabourImage = createImageUploadMiddleware({
    // Study: Give `directory` a step to run later when it needs a result.
    directory: req => {
        // Study: Do the next step if this check passes: `!req.user?.organizationId` . If so, stop and report "Labour organization context is missing."
        if (!req.user?.organizationId) throw new BadRequestError("Labour organization context is missing.");
        // Study: Give `'labour/${req.user.organizationId}'` back to the code that asked for it.
        return `labour/${req.user.organizationId}`;
    // Study: End this group of steps.
    },
// Study: End this group of values.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// Study: Register POST / with `labourController.createLabour` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.LABOUR, Action.CREATE),
    // Study: Supply `uploadLabourImage` to the surrounding statement.
    uploadLabourImage,
    // Study: Supply `labourController` to the surrounding statement.
    labourController.createLabour
// Study: End the list of information being sent to this step.
);

// Study: Register GET / with `labourController.getOrganizationLabours` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.LABOUR, Action.VIEW),
    // Study: Supply `labourController` to the surrounding statement.
    labourController.getOrganizationLabours
// Study: End the list of information being sent to this step.
);

// Study: Register GET /:id with `labourController.getLabourById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.LABOUR, Action.VIEW),
    // Study: Supply `labourController` to the surrounding statement.
    labourController.getLabourById
// Study: End the list of information being sent to this step.
);

// Study: Register PATCH /:id with `labourController.updateLabour` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.LABOUR, Action.UPDATE),
    // Study: Supply `uploadLabourImage` to the surrounding statement.
    uploadLabourImage,
    // Study: Supply `labourController` to the surrounding statement.
    labourController.updateLabour
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
