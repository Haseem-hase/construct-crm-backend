// Study: Connect HTTP methods and paths to middleware and handlers for customer accounts and parent-child customer relationships.
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
// Study: Import `{ createCustomerSchema, updateCustomerSchema, customerIdSchema, }` from `"./customer.validation"`.
import {
    // Study: Bring `createCustomerSchema` into scope from the imported module.
    createCustomerSchema,
    // Study: Bring `updateCustomerSchema` into scope from the imported module.
    updateCustomerSchema,
    // Study: Bring `customerIdSchema` into scope from the imported module.
    customerIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./customer.validation";
// Study: Import `{ createCustomer, getCustomers, getCustomerById, getCustomerChildren, updateCustome…` from `"./customer.controller"`.
import {
    // Study: Bring `createCustomer` into scope from the imported module.
    createCustomer,
    // Study: Bring `getCustomers` into scope from the imported module.
    getCustomers,
    // Study: Bring `getCustomerById` into scope from the imported module.
    getCustomerById,
    // Study: Bring `getCustomerChildren` into scope from the imported module.
    getCustomerChildren,
    // Study: Bring `updateCustomer` into scope from the imported module.
    updateCustomer,
    // Study: Bring `deleteCustomer` into scope from the imported module.
    deleteCustomer,
// Study: Close this group and continue the enclosing expression.
} from "./customer.controller";
// Study: Import `customerContactRoutes` from `"../customer-contact/customer-contact.routes"`.
import customerContactRoutes from "../customer-contact/customer-contact.routes";
// Study: Import `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"`.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadCustomerImage`.
const uploadCustomerImage = createImageUploadMiddleware({
    // Study: Provide the callback used for `directory`.
    directory: req => {
        // Study: Run the following branch when `!req.user?.organizationId` is truthy and throw `new BadRequestError("Customer organization context is missing.")`.
        if (!req.user?.organizationId) throw new BadRequestError("Customer organization context is missing.");
        // Study: Return `'customers/${req.user.organizationId}'` to the caller.
        return `customers/${req.user.organizationId}`;
    // Study: Close the code block.
    },
// Study: Close the object literal.
});

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// Study: Mount Express middleware or a child router with `customerContactRoutes`.
router.use("/:customerId/contacts", customerContactRoutes);

// Study: Register POST / with `createCustomer` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.CREATE),
    // Study: Supply `uploadCustomerImage` to the surrounding statement.
    uploadCustomerImage,
    // Study: Call `validate`.
    validate(createCustomerSchema, "body"),
    // Study: Supply `createCustomer` to the surrounding statement.
    createCustomer
// Study: Close the call arguments.
);

// Study: Register GET / with `getCustomers` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Supply `getCustomers` to the surrounding statement.
    getCustomers
// Study: Close the call arguments.
);

// Study: Register GET /:id with `getCustomerById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `getCustomerById` to the surrounding statement.
    getCustomerById
// Study: Close the call arguments.
);

// Study: Register GET /:id/children with `getCustomerChildren` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id/children"` here.
    "/:id/children",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `getCustomerChildren` to the surrounding statement.
    getCustomerChildren
// Study: Close the call arguments.
);

// Study: Register PATCH /:id with `updateCustomer` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.UPDATE),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `uploadCustomerImage` to the surrounding statement.
    uploadCustomerImage,
    // Study: Call `validate`.
    validate(updateCustomerSchema, "body"),
    // Study: Supply `updateCustomer` to the surrounding statement.
    updateCustomer
// Study: Close the call arguments.
);

// Study: Register DELETE /:id with `deleteCustomer` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Call `authorize`.
    authorize(Module.CUSTOMER, Action.DELETE),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `deleteCustomer` to the surrounding statement.
    deleteCustomer
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
