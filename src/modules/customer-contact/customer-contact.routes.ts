// Study: Connect HTTP methods and paths to middleware and handlers for contacts attached to customer accounts.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `{ validate }` from `"../../middlewares/validate"`.
import { validate } from "../../middlewares/validate";
// Study: Import `{ createCustomerContactSchema, updateCustomerContactSchema, customerAndContactIdPar…` from `"./customer-contact.validation"`.
import {
    // Study: Bring `createCustomerContactSchema` into scope from the imported module.
    createCustomerContactSchema,
    // Study: Bring `updateCustomerContactSchema` into scope from the imported module.
    updateCustomerContactSchema,
    // Study: Bring `customerAndContactIdParamsSchema` into scope from the imported module.
    customerAndContactIdParamsSchema,
// Study: Close this group and continue the enclosing expression.
} from "./customer-contact.validation";
// Study: Import `{ createCustomerContact, getCustomerContacts, getCustomerContactById, updateCustome…` from `"./customer-contact.controller"`.
import {
    // Study: Bring `createCustomerContact` into scope from the imported module.
    createCustomerContact,
    // Study: Bring `getCustomerContacts` into scope from the imported module.
    getCustomerContacts,
    // Study: Bring `getCustomerContactById` into scope from the imported module.
    getCustomerContactById,
    // Study: Bring `updateCustomerContact` into scope from the imported module.
    updateCustomerContact,
    // Study: Bring `deleteCustomerContact` into scope from the imported module.
    deleteCustomerContact,
// Study: Close this group and continue the enclosing expression.
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
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.CREATE),
    // Study: Call `validate`.
    validate(customerIdOnlySchema, "params"),
    // Study: Call `validate`.
    validate(createCustomerContactSchema, "body"),
    // Study: Supply `createCustomerContact` to the surrounding statement.
    createCustomerContact
// Study: Close the call arguments.
);

// Study: Register GET / with `getCustomerContacts` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerIdOnlySchema, "params"),
    // Study: Supply `getCustomerContacts` to the surrounding statement.
    getCustomerContacts
// Study: Close the call arguments.
);

// Study: Register GET /:contactId with `getCustomerContactById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:contactId"` here.
    "/:contactId",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerAndContactIdParamsSchema, "params"),
    // Study: Supply `getCustomerContactById` to the surrounding statement.
    getCustomerContactById
// Study: Close the call arguments.
);

// Study: Register PATCH /:contactId with `updateCustomerContact` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:contactId"` here.
    "/:contactId",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.UPDATE),
    // Study: Call `validate`.
    validate(customerAndContactIdParamsSchema, "params"),
    // Study: Call `validate`.
    validate(updateCustomerContactSchema, "body"),
    // Study: Supply `updateCustomerContact` to the surrounding statement.
    updateCustomerContact
// Study: Close the call arguments.
);

// Study: Register DELETE /:contactId with `deleteCustomerContact` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/:contactId"` here.
    "/:contactId",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.DELETE),
    // Study: Call `validate`.
    validate(customerAndContactIdParamsSchema, "params"),
    // Study: Supply `deleteCustomerContact` to the surrounding statement.
    deleteCustomerContact
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
