import { Router } from "express";

import * as customerController from "./customer.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import { createCustomerSchema, updateCustomerSchema } from "./customer.validation";

const router = Router();


router.post(
    "/",
    authenticate,
    authorize("ORGANIZATION_OWNER", "CONTRACTOR"),
    validate(createCustomerSchema),
    customerController.createCustomer
);


router.get(
    "/",
    authenticate,
    authorize("ORGANIZATION_OWNER", "CONTRACTOR"),
    customerController.getCustomers
);


router.get(
    "/:id",
    authenticate,
    authorize("ORGANIZATION_OWNER", "CONTRACTOR"),
    customerController.getCustomerById
);


router.patch(
    "/:id",
    authenticate,
    authorize("ORGANIZATION_OWNER", "CONTRACTOR"),
    validate(updateCustomerSchema),
    customerController.updateCustomer
);


router.delete(
    "/:id",
    authenticate,
    authorize("ORGANIZATION_OWNER"),
    customerController.deleteCustomer
);


export default router;