import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
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

const router = Router();

router.use(authenticate);

router.post(
    "/",
    validate(createCustomerSchema, "body"),
    createCustomer
);

router.get(
    "/",
    getCustomers
);

router.get(
    "/:id",
    validate(customerIdSchema, "params"),
    getCustomerById
);

router.get(
    "/:id/children",
    validate(customerIdSchema, "params"),
    getCustomerChildren
);

router.patch(
    "/:id",
    validate(customerIdSchema, "params"),
    validate(updateCustomerSchema, "body"),
    updateCustomer
);

router.delete(
    "/:id",
    validate(customerIdSchema, "params"),
    deleteCustomer
);

export default router;