// Study: This file is about which contractors work on which jobs and what they are responsible for. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";

// Study: Bring in `* as assignmentController` from `"./contractor-project-assignment.controller"` so this file can use it.
import * as assignmentController from "./contractor-project-assignment.controller";

// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
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
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.ASSIGN),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.createAssignment
// Study: End the list of information being sent to this step.
);

// Get Assignments
// Study: Register GET / with `assignmentController.getAssignments` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.getAssignments
// Study: End the list of information being sent to this step.
);

// Get Assignment By ID
// Study: Register GET /:id with `assignmentController.getAssignmentById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.VIEW),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.getAssignmentById
// Study: End the list of information being sent to this step.
);

// Update Assignment
// Study: Register PATCH /:id with `assignmentController.updateAssignment` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CONTRACTOR, Action.UPDATE),
    // Study: Supply `assignmentController` to the surrounding statement.
    assignmentController.updateAssignment
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
