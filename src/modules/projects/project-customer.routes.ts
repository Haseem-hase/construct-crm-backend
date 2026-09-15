import { Router } from "express";
import * as projectCustomerController from "./project-customer.controller";

const router = Router();

router.get("/:projectId/customers", projectCustomerController.getProjectCustomers);
router.post("/:projectId/customers", projectCustomerController.createProjectCustomer);
router.get("/:projectId/customers/:projectCustomerId", projectCustomerController.getProjectCustomer);
router.patch("/:projectId/customers/:projectCustomerId", projectCustomerController.updateProjectCustomer);
router.delete("/:projectId/customers/:projectCustomerId", projectCustomerController.deleteProjectCustomer);

export default router;
