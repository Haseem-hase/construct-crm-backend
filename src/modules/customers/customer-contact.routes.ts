import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
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
    validate(customerIdOnlySchema, "params"),
    validate(createCustomerContactSchema, "body"),
    createCustomerContact
);

router.get(
    "/",
    validate(customerIdOnlySchema, "params"),
    getCustomerContacts
);

router.get(
    "/:contactId",
    validate(customerAndContactIdParamsSchema, "params"),
    getCustomerContactById
);

router.patch(
    "/:contactId",
    validate(customerAndContactIdParamsSchema, "params"),
    validate(updateCustomerContactSchema, "body"),
    updateCustomerContact
);

router.delete(
    "/:contactId",
    validate(customerAndContactIdParamsSchema, "params"),
    deleteCustomerContact
);

export default router;
