import { Router } from "express";
import { Module, Action } from "@prisma/client";
import { authorize } from "../../middlewares/authorize";
import * as projectController from "./project.controller";
import projectCustomerRoutes from "./project-customer.routes";

const router = Router();

router.post("/", authorize(Module.PROJECT, Action.CREATE), projectController.createProject);
router.get("/", authorize(Module.PROJECT, Action.VIEW), projectController.getOrganizationProjects);

// Mount ProjectCustomer sub-resource routes
router.use("/", projectCustomerRoutes);

router.get("/:projectId", authorize(Module.PROJECT, Action.VIEW), projectController.getProjectById);
router.patch("/:projectId", authorize(Module.PROJECT, Action.UPDATE), projectController.updateProject);
router.delete("/:projectId", authorize(Module.PROJECT, Action.DELETE), projectController.deleteProject);

export default router;
