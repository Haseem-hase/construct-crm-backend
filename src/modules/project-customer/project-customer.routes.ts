// Study: Connect HTTP methods and paths to middleware and handlers for relationships between projects and customers.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `* as projectCustomerController` from `"./project-customer.controller"`.
import * as projectCustomerController from "./project-customer.controller";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Register GET /:projectId/customers with `projectCustomerController.getProjectCustomers` after the listed middleware.
router.get("/:projectId/customers", authenticate, authorize(Module.PROJECT, Action.VIEW), projectCustomerController.getProjectCustomers);
// Study: Register POST /:projectId/customers with `projectCustomerController.createProjectCustomer` after the listed middleware.
router.post("/:projectId/customers", authenticate, authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.createProjectCustomer);
// Study: Register GET /:projectId/customers/:projectCustomerId with `projectCustomerController.getProjectCustomer` after the listed middleware.
router.get("/:projectId/customers/:projectCustomerId", authenticate, authorize(Module.PROJECT, Action.VIEW), projectCustomerController.getProjectCustomer);
// Study: Register PATCH /:projectId/customers/:projectCustomerId with `projectCustomerController.updateProjectCustomer` after the listed middleware.
router.patch("/:projectId/customers/:projectCustomerId", authenticate, authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.updateProjectCustomer);
// Study: Register DELETE /:projectId/customers/:projectCustomerId with `projectCustomerController.deleteProjectCustomer` after the listed middleware.
router.delete("/:projectId/customers/:projectCustomerId", authenticate, authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.deleteProjectCustomer);

// Study: Expose `router` as the default export.
export default router;
