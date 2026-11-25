// Study: This file is about which customers are connected to each job and in what role. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `* as projectCustomerController` from `"./project-customer.controller"` so this file can use it.
import * as projectCustomerController from "./project-customer.controller";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: When the screen asks to read information, use this GET address (`/:projectId/customers`). First check who is signed in, then check their permission. Send the request to `projectCustomerController.getProjectCustomers`.
router.get("/:projectId/customers", authenticate, authorize(Module.PROJECT, Action.VIEW), projectCustomerController.getProjectCustomers);
// Study: When the screen asks to submit information, use this POST address (`/:projectId/customers`). First check who is signed in, then check their permission. Send the request to `projectCustomerController.createProjectCustomer`.
router.post("/:projectId/customers", authenticate, authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.createProjectCustomer);
// Study: When the screen asks to read information, use this GET address (`/:projectId/customers/:projectCustomerId`). First check who is signed in, then check their permission. Send the request to `projectCustomerController.getProjectCustomer`.
router.get("/:projectId/customers/:projectCustomerId", authenticate, authorize(Module.PROJECT, Action.VIEW), projectCustomerController.getProjectCustomer);
// Study: When the screen asks to update part of a record, use this PATCH address (`/:projectId/customers/:projectCustomerId`). First check who is signed in, then check their permission. Send the request to `projectCustomerController.updateProjectCustomer`.
router.patch("/:projectId/customers/:projectCustomerId", authenticate, authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.updateProjectCustomer);
// Study: When the screen asks to remove a record, use this DELETE address (`/:projectId/customers/:projectCustomerId`). First check who is signed in, then check their permission. Send the request to `projectCustomerController.deleteProjectCustomer`.
router.delete("/:projectId/customers/:projectCustomerId", authenticate, authorize(Module.PROJECT, Action.UPDATE), projectCustomerController.deleteProjectCustomer);

// Study: Make `router` the main thing other files can get from this file.
export default router;
