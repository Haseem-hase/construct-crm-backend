import { Router } from "express";
import { Module, Action } from "@prisma/client";
import { authorize } from "../../middlewares/authorize";
import * as projectCustomerController from "./project-customer.controller";

const router = Router();

router.get("/:projectId/customers", authorize(Module.PROJECT, Action.VIEW), projectCustomerController.getProjectCustomers);
router.post("/:projectId/customers", authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.createProjectCustomer);
router.get("/:projectId/customers/:projectCustomerId", authorize(Module.PROJECT, Action.VIEW), projectCustomerController.getProjectCustomer);
router.patch("/:projectId/customers/:projectCustomerId", authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.updateProjectCustomer);
router.delete("/:projectId/customers/:projectCustomerId", authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.deleteProjectCustomer);

export default router;
