import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { Module, Action } from "@prisma/client";
import * as controller from "./labour-assignment.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(Module.CONTRACTOR, Action.ASSIGN),
    controller.createLabourAssignment
);

router.get(
    "/",
    authenticate,
    authorize(Module.CONTRACTOR, Action.VIEW),
    controller.getLabourAssignments
);

router.get(
    "/:id",
    authenticate,
    authorize(Module.CONTRACTOR, Action.VIEW),
    controller.getLabourAssignmentById
);

router.patch(
    "/:id",
    authenticate,
    authorize(Module.CONTRACTOR, Action.UPDATE),
    controller.updateLabourAssignment
);

export default router;
