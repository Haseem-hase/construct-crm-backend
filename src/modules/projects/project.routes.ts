import { Router } from "express";
import * as projectController from "./project.controller";
import projectCustomerRoutes from "./project-customer.routes";

const router = Router();

router.post("/", projectController.createProject);
router.get("/", projectController.getOrganizationProjects);

// Mount ProjectCustomer sub-resource routes
router.use("/", projectCustomerRoutes);

router.get("/:projectId", projectController.getProjectById);
router.patch("/:projectId", projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

export default router;
