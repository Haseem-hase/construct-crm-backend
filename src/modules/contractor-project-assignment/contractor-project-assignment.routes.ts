// Study: Connect HTTP methods and paths to middleware and handlers for contractor placements on projects and their responsibilities.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";

// Study: Import `* as assignmentController` from `"./contractor-project-assignment.controller"`.
import * as assignmentController from "./contractor-project-assignment.controller";

// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Create Assignment
// Study: Register POST / with `assignmentController.createAssignment` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.ASSIGN),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.createAssignment
// Study: Close the call arguments.
);

// Get Assignments
// Study: Register GET / with `assignmentController.getAssignments` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.getAssignments
// Study: Close the call arguments.
);

// Get Assignment By ID
// Study: Register GET /:id with `assignmentController.getAssignmentById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.getAssignmentById
// Study: Close the call arguments.
);

// Update Assignment
// Study: Register PATCH /:id with `assignmentController.updateAssignment` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Call `authorize`.
    authorize(Module.CONTRACTOR, Action.UPDATE),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.updateAssignment
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
