// Study: This file is about construction jobs, their site details, and their photos. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `* as projectController` from `"./project.controller"` so this file can use it.
import * as projectController from "./project.controller";
// Study: Bring in `projectCustomerRoutes` from `"../project-customer/project-customer.routes"` so this file can use it.
import projectCustomerRoutes from "../project-customer/project-customer.routes";
// Study: Bring in `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"` so this file can use it.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadProjectImages`.
const uploadProjectImages = createImageUploadMiddleware({
    // Study: Look for the uploaded project photos under the field named images.
    fieldName: "images",
    // Study: Accept up to 10 photos in this upload.
    maxFiles: 10,
    // Study: Give `directory` a step to run later when it needs a result.
    directory: (req) => {
        // Study: Get the company ID from the signed-in account if the account is available.
        const organizationId = req.user?.organizationId;
        // Study: Do the next step if there is no value for `organizationId` . If so, stop and report "Project organization context is missing."
        if (!organizationId) throw new BadRequestError("Project organization context is missing.");
        // Study: Choose the project photo folder for this company.
        return `projects/${organizationId}`;
    // Study: End this group of steps.
    },
// Study: End this group of values.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: When the screen asks to submit information, use this POST address (`/`). First check who is signed in, then check their permission, then receive the photos. Send the request to `projectController.createProject`.
router.post("/", authenticate, authorize(Module.PROJECT, Action.CREATE), uploadProjectImages, projectController.createProject);
// Study: When the screen asks to read information, use this GET address (`/`). First check who is signed in, then check their permission. Send the request to `projectController.getOrganizationProjects`.
router.get("/", authenticate, authorize(Module.PROJECT, Action.VIEW), projectController.getOrganizationProjects);

// Mount ProjectCustomer sub-resource routes
// Study: Mount Express middleware or a child router with `projectCustomerRoutes`.
router.use("/", projectCustomerRoutes);

// Study: When the screen asks to read information, use this GET address (`/:projectId`). First check who is signed in, then check their permission. Send the request to `projectController.getProjectById`.
router.get("/:projectId", authenticate, authorize(Module.PROJECT, Action.VIEW), projectController.getProjectById);
// Study: When the screen asks to update part of a record, use this PATCH address (`/:projectId`). First check who is signed in, then check their permission, then receive the photos. Send the request to `projectController.updateProject`.
router.patch("/:projectId", authenticate, authorize(Module.PROJECT, Action.UPDATE), uploadProjectImages, projectController.updateProject);
// Study: When the screen asks to remove a record, use this DELETE address (`/:projectId`). First check who is signed in, then check their permission. Send the request to `projectController.deleteProject`.
router.delete("/:projectId", authenticate, authorize(Module.PROJECT, Action.DELETE), projectController.deleteProject);

// Study: Make `router` the main thing other files can get from this file.
export default router;
