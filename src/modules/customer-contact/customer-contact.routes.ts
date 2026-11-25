// Study: This file is about the people you can contact at a customer account. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `{ validate }` from `"../../middlewares/validate"` so this file can use it.
import { validate } from "../../middlewares/validate";
// Study: Bring in `{ createCustomerContactSchema, updateCustomerContactSchema, customerAndContactIdPar…` from `"./customer-contact.validation"` so this file can use it.
import {
    // Study: Make `createCustomerContactSchema` from the other file available here.
    createCustomerContactSchema,
    // Study: Make `updateCustomerContactSchema` from the other file available here.
    updateCustomerContactSchema,
    // Study: Make `customerAndContactIdParamsSchema` from the other file available here.
    customerAndContactIdParamsSchema,
// Study: Finish this group and continue the surrounding step.
} from "./customer-contact.validation";
// Study: Bring in `{ createCustomerContact, getCustomerContacts, getCustomerContactById, updateCustome…` from `"./customer-contact.controller"` so this file can use it.
import {
    // Study: Make `createCustomerContact` from the other file available here.
    createCustomerContact,
    // Study: Make `getCustomerContacts` from the other file available here.
    getCustomerContacts,
    // Study: Make `getCustomerContactById` from the other file available here.
    getCustomerContactById,
    // Study: Make `updateCustomerContact` from the other file available here.
    updateCustomerContact,
    // Study: Make `deleteCustomerContact` from the other file available here.
    deleteCustomerContact,
// Study: Finish this group and continue the surrounding step.
} from "./customer-contact.controller";

// Enable mergeParams to access :customerId from the parent router
// Study: Call `Router` and store the result as `router`.
const router = Router({ mergeParams: true });

// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// Study: Call `customerAndContactIdParamsSchema.pick` and store the result as `customerIdOnlySchema`.
const customerIdOnlySchema = customerAndContactIdParamsSchema.pick({ customerId: true });

// Study: Register POST / with `createCustomerContact` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.CREATE),
    // Study: Call `validate`.
    validate(customerIdOnlySchema, "params"),
    // Study: Call `validate`.
    validate(createCustomerContactSchema, "body"),
    // Study: Supply `createCustomerContact` to the surrounding statement.
    createCustomerContact
// Study: End the list of information being sent to this step.
);

// Study: Register GET / with `getCustomerContacts` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerIdOnlySchema, "params"),
    // Study: Supply `getCustomerContacts` to the surrounding statement.
    getCustomerContacts
// Study: End the list of information being sent to this step.
);

// Study: Register GET /:contactId with `getCustomerContactById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:contactId"` here.
    "/:contactId",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerAndContactIdParamsSchema, "params"),
    // Study: Supply `getCustomerContactById` to the surrounding statement.
    getCustomerContactById
// Study: End the list of information being sent to this step.
);

// Study: Register PATCH /:contactId with `updateCustomerContact` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:contactId"` here.
    "/:contactId",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.UPDATE),
    // Study: Call `validate`.
    validate(customerAndContactIdParamsSchema, "params"),
    // Study: Call `validate`.
    validate(updateCustomerContactSchema, "body"),
    // Study: Supply `updateCustomerContact` to the surrounding statement.
    updateCustomerContact
// Study: End the list of information being sent to this step.
);

// Study: Register DELETE /:contactId with `deleteCustomerContact` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/:contactId"` here.
    "/:contactId",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.DELETE),
    // Study: Call `validate`.
    validate(customerAndContactIdParamsSchema, "params"),
    // Study: Supply `deleteCustomerContact` to the surrounding statement.
    deleteCustomerContact
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
