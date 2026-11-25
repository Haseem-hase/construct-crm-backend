// Study: Connect HTTP methods and paths to middleware and handlers for worker placements on construction projects.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";
// Study: Import `* as controller` from `"./labour-assignment.controller"`.
import * as controller from "./labour-assignment.controller";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Register POST / with `controller.createLabourAssignment` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.ASSIGN),
    // Study: Supply `controller` to the surrounding statement.
    controller.createLabourAssignment
// Study: Close the call arguments.
);

// Study: Register GET / with `controller.getLabourAssignments` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `controller` to the surrounding statement.
    controller.getLabourAssignments
// Study: Close the call arguments.
);

// Study: Register GET /:id with `controller.getLabourAssignmentById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `controller` to the surrounding statement.
    controller.getLabourAssignmentById
// Study: Close the call arguments.
);

// Study: Register PATCH /:id with `controller.updateLabourAssignment` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.UPDATE),
    // Study: Supply `controller` to the surrounding statement.
    controller.updateLabourAssignment
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
