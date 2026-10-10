import { Router } from "express";
import { Module, Action } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import {
    createCustomerSchema,
    updateCustomerSchema,
    customerIdSchema,
} from "./customer.validation";
import {
    createCustomer,
    getCustomers,
    getCustomerById,
    getCustomerChildren,
    updateCustomer,
    deleteCustomer,
} from "./customer.controller";
import customerContactRoutes from "../customer-contact/customer-contact.routes";

const router = Router();

router.use(authenticate);

router.use("/:customerId/contacts", customerContactRoutes);

router.post(
    "/",
    authorize(Module.CUSTOMER, Action.CREATE),
    validate(createCustomerSchema, "body"),
    createCustomer
);

router.get(
    "/",
    authorize(Module.CUSTOMER, Action.VIEW),
    getCustomers
);

router.get(
    "/:id",
    authorize(Module.CUSTOMER, Action.VIEW),
    validate(customerIdSchema, "params"),
    getCustomerById
);

router.get(
    "/:id/children",
    authorize(Module.CUSTOMER, Action.VIEW),
    validate(customerIdSchema, "params"),
    getCustomerChildren
);

router.patch(
    "/:id",
    authorize(Module.CUSTOMER, Action.UPDATE),
    validate(customerIdSchema, "params"),
    validate(updateCustomerSchema, "body"),
    updateCustomer
);

router.delete(
    "/:id",
    authorize(Module.CUSTOMER, Action.DELETE),
    validate(customerIdSchema, "params"),
    deleteCustomer
);

export default router;