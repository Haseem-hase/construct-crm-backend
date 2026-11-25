// Study: This file is about which workers are assigned to each job. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";
// Study: Bring in `* as controller` from `"./labour-assignment.controller"` so this file can use it.
import * as controller from "./labour-assignment.controller";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Register POST / with `controller.createLabourAssignment` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.ASSIGN),
    // Study: Supply `controller` to the surrounding statement.
    controller.createLabourAssignment
// Study: End the list of information being sent to this step.
);

// Study: Register GET / with `controller.getLabourAssignments` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `controller` to the surrounding statement.
    controller.getLabourAssignments
// Study: End the list of information being sent to this step.
);

// Study: Register GET /:id with `controller.getLabourAssignmentById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `controller` to the surrounding statement.
    controller.getLabourAssignmentById
// Study: End the list of information being sent to this step.
);

// Study: Register PATCH /:id with `controller.updateLabourAssignment` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.UPDATE),
    // Study: Supply `controller` to the surrounding statement.
    controller.updateLabourAssignment
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
