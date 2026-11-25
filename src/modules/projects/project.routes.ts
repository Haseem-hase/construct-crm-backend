// Study: Connect HTTP methods and paths to middleware and handlers for construction projects, their site details, and image galleries.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `* as projectController` from `"./project.controller"`.
import * as projectController from "./project.controller";
// Study: Import `projectCustomerRoutes` from `"../project-customer/project-customer.routes"`.
import projectCustomerRoutes from "../project-customer/project-customer.routes";
// Study: Import `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"`.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadProjectImages`.
const uploadProjectImages = createImageUploadMiddleware({
    // Study: Set `fieldName` to `"images"`.
    fieldName: "images",
    // Study: Set `maxFiles` to `10`.
    maxFiles: 10,
    // Study: Provide the callback used for `directory`.
    directory: (req) => {
        // Study: Set `organizationId` to `req.user?.organizationId`.
        const organizationId = req.user?.organizationId;
        // Study: Run the following branch when `!organizationId` is truthy and throw `new BadRequestError("Project organization context is missing.")`.
        if (!organizationId) throw new BadRequestError("Project organization context is missing.");
        // Study: Return `'projects/${organizationId}'` to the caller.
        return `projects/${organizationId}`;
    // Study: Close the code block.
    },
// Study: Close the object literal.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Register POST / with `projectController.createProject` after the listed middleware.
router.post("/", authenticate, authorize(Module.PROJECT, Action.CREATE), uploadProjectImages, projectController.createProject);
// Study: Register GET / with `projectController.getOrganizationProjects` after the listed middleware.
router.get("/", authenticate, authorize(Module.PROJECT, Action.VIEW), projectController.getOrganizationProjects);

// Mount ProjectCustomer sub-resource routes
// Study: Mount Express middleware or a child router with `projectCustomerRoutes`.
router.use("/", projectCustomerRoutes);

// Study: Register GET /:projectId with `projectController.getProjectById` after the listed middleware.
router.get("/:projectId", authenticate, authorize(Module.PROJECT, Action.VIEW), projectController.getProjectById);
// Study: Register PATCH /:projectId with `projectController.updateProject` after the listed middleware.
router.patch("/:projectId", authenticate, authorize(Module.PROJECT, Action.UPDATE), uploadProjectImages, projectController.updateProject);
// Study: Register DELETE /:projectId with `projectController.deleteProject` after the listed middleware.
router.delete("/:projectId", authenticate, authorize(Module.PROJECT, Action.DELETE), projectController.deleteProject);

// Study: Expose `router` as the default export.
export default router;
