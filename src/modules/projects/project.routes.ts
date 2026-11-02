import { Router } from "express";
import { Module, Action } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import * as projectController from "./project.controller";
import projectCustomerRoutes from "../project-customer/project-customer.routes";
import { uploadSingleImage } from "../../middlewares/upload-image.middleware";
import { BadRequestError } from "../../errors/BadRequestError";

const uploadProjectImage = uploadSingleImage({
    directory: (req) => {
        const organizationId = req.user?.organizationId;
        if (!organizationId) throw new BadRequestError("Project organization context is missing.");
        return `projects/${organizationId}`;
    },
});

const router = Router();

router.post("/", authenticate, authorize(Module.PROJECT, Action.CREATE), uploadProjectImage, projectController.createProject);
router.get("/", authenticate, authorize(Module.PROJECT, Action.VIEW), projectController.getOrganizationProjects);

// Mount ProjectCustomer sub-resource routes
router.use("/", projectCustomerRoutes);

router.get("/:projectId", authenticate, authorize(Module.PROJECT, Action.VIEW), projectController.getProjectById);
router.patch("/:projectId", authenticate, authorize(Module.PROJECT, Action.UPDATE), uploadProjectImage, projectController.updateProject);
router.delete("/:projectId", authenticate, authorize(Module.PROJECT, Action.DELETE), projectController.deleteProject);

export default router;
