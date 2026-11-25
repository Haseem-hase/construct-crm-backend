// Study: This file is about customer accounts and which customers belong under a parent customer. Matches each request from the screen to the checks and work it needs.
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
// Study: Bring in `{ createCustomerSchema, updateCustomerSchema, customerIdSchema, }` from `"./customer.validation"` so this file can use it.
import {
    // Study: Make `createCustomerSchema` from the other file available here.
    createCustomerSchema,
    // Study: Make `updateCustomerSchema` from the other file available here.
    updateCustomerSchema,
    // Study: Make `customerIdSchema` from the other file available here.
    customerIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./customer.validation";
// Study: Bring in `{ createCustomer, getCustomers, getCustomerById, getCustomerChildren, updateCustome…` from `"./customer.controller"` so this file can use it.
import {
    // Study: Make `createCustomer` from the other file available here.
    createCustomer,
    // Study: Make `getCustomers` from the other file available here.
    getCustomers,
    // Study: Make `getCustomerById` from the other file available here.
    getCustomerById,
    // Study: Make `getCustomerChildren` from the other file available here.
    getCustomerChildren,
    // Study: Make `updateCustomer` from the other file available here.
    updateCustomer,
    // Study: Make `deleteCustomer` from the other file available here.
    deleteCustomer,
// Study: Finish this group and continue the surrounding step.
} from "./customer.controller";
// Study: Bring in `customerContactRoutes` from `"../customer-contact/customer-contact.routes"` so this file can use it.
import customerContactRoutes from "../customer-contact/customer-contact.routes";
// Study: Bring in `{ createImageUploadMiddleware }` from `"../../middlewares/upload-image.middleware"` so this file can use it.
import { createImageUploadMiddleware } from "../../middlewares/upload-image.middleware";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Call `createImageUploadMiddleware` and store the result as `uploadCustomerImage`.
const uploadCustomerImage = createImageUploadMiddleware({
    // Study: Give `directory` a step to run later when it needs a result.
    directory: req => {
        // Study: Do the next step if this check passes: `!req.user?.organizationId` . If so, stop and report "Customer organization context is missing."
        if (!req.user?.organizationId) throw new BadRequestError("Customer organization context is missing.");
        // Study: Give `'customers/${req.user.organizationId}'` back to the code that asked for it.
        return `customers/${req.user.organizationId}`;
    // Study: End this group of steps.
    },
// Study: End this group of values.
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
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.CREATE),
    // Study: Supply `uploadCustomerImage` to the surrounding statement.
    uploadCustomerImage,
    // Study: Call `validate`.
    validate(createCustomerSchema, "body"),
    // Study: Supply `createCustomer` to the surrounding statement.
    createCustomer
// Study: End the list of information being sent to this step.
);

// Study: Register GET / with `getCustomers` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Supply `getCustomers` to the surrounding statement.
    getCustomers
// Study: End the list of information being sent to this step.
);

// Study: Register GET /:id with `getCustomerById` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `getCustomerById` to the surrounding statement.
    getCustomerById
// Study: End the list of information being sent to this step.
);

// Study: Register GET /:id/children with `getCustomerChildren` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id/children"` here.
    "/:id/children",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.VIEW),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `getCustomerChildren` to the surrounding statement.
    getCustomerChildren
// Study: End the list of information being sent to this step.
);

// Study: Register PATCH /:id with `updateCustomer` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.UPDATE),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `uploadCustomerImage` to the surrounding statement.
    uploadCustomerImage,
    // Study: Call `validate`.
    validate(updateCustomerSchema, "body"),
    // Study: Supply `updateCustomer` to the surrounding statement.
    updateCustomer
// Study: End the list of information being sent to this step.
);

// Study: Register DELETE /:id with `deleteCustomer` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.CUSTOMER, Action.DELETE),
    // Study: Call `validate`.
    validate(customerIdSchema, "params"),
    // Study: Supply `deleteCustomer` to the surrounding statement.
    deleteCustomer
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
