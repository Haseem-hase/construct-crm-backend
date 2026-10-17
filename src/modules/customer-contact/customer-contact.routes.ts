import { Router } from "express";
import { Module, Action } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import {
    createCustomerContactSchema,
    updateCustomerContactSchema,
    customerAndContactIdParamsSchema,
} from "./customer-contact.validation";
import {
    createCustomerContact,
    getCustomerContacts,
    getCustomerContactById,
    updateCustomerContact,
    deleteCustomerContact,
} from "./customer-contact.controller";

// Enable mergeParams to access :customerId from the parent router
const router = Router({ mergeParams: true });

router.use(authenticate);

const customerIdOnlySchema = customerAndContactIdParamsSchema.pick({ customerId: true });

router.post(
    "/",
    authorize(Module.CUSTOMER, Action.CREATE),
    validate(customerIdOnlySchema, "params"),
    validate(createCustomerContactSchema, "body"),
    createCustomerContact
);

router.get(
    "/",
    authorize(Module.CUSTOMER, Action.VIEW),
    validate(customerIdOnlySchema, "params"),
    getCustomerContacts
);

router.get(
    "/:contactId",
    authorize(Module.CUSTOMER, Action.VIEW),
    validate(customerAndContactIdParamsSchema, "params"),
    getCustomerContactById
);

router.patch(
    "/:contactId",
    authorize(Module.CUSTOMER, Action.UPDATE),
    validate(customerAndContactIdParamsSchema, "params"),
    validate(updateCustomerContactSchema, "body"),
    updateCustomerContact
);

router.delete(
    "/:contactId",
    authorize(Module.CUSTOMER, Action.DELETE),
    validate(customerAndContactIdParamsSchema, "params"),
    deleteCustomerContact
);

export default router;
