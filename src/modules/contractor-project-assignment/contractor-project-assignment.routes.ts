import { Router } from "express";

import * as assignmentController from "./contractor-project-assignment.controller";

import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { Module, Action } from "@prisma/client";

const router = Router();

// Create Assignment
router.post(
    "/",
    authenticate,
    authorize(Module.CONTRACTOR, Action.ASSIGN),
    assignmentController.createAssignment
);

// Get Assignments
router.get(
    "/",
    authenticate,
    authorize(Module.CONTRACTOR, Action.VIEW),
    assignmentController.getAssignments
);

// Get Assignment By ID
router.get(
    "/:id",
    authenticate,
    authorize(Module.CONTRACTOR, Action.VIEW),
    assignmentController.getAssignmentById
);

// Update Assignment
router.patch(
    "/:id",
    authenticate,
    authorize(Module.CONTRACTOR, Action.UPDATE),
    assignmentController.updateAssignment
);

export default router;
