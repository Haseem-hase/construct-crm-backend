// Study: This file is about the companies using the CRM and the people who own their accounts. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";

// Study: Bring in `* as organizationController` from `"./organization.controller"` so this file can use it.
import * as organizationController from "./organization.controller";
// Study: Bring in `{ validate }` from `"../../middlewares/validate"` so this file can use it.
import { validate } from "../../middlewares/validate";
// Study: Bring in `{ createOrganizationSchema, listOrganizationsQuerySchema, registerOrganizationSchem…` from `"./organization.validation"` so this file can use it.
import {
    // Study: Make `createOrganizationSchema` from the other file available here.
    createOrganizationSchema,
    // Study: Make `listOrganizationsQuerySchema` from the other file available here.
    listOrganizationsQuerySchema,
    // Study: Make `registerOrganizationSchema` from the other file available here.
    registerOrganizationSchema,
// Study: Finish this group and continue the surrounding step.
} from "./organization.validation";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ requireSuperAdmin }` from `"../../middlewares/require-super-admin"` so this file can use it.
import { requireSuperAdmin } from "../../middlewares/require-super-admin";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Register GET / with `organizationController.listOrganizations` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Call `validate`.
    validate(listOrganizationsQuerySchema, "query"),
    // Study: Supply `organizationController` to the surrounding statement.
    organizationController.listOrganizations
// Study: End the list of information being sent to this step.
);

// Study: Register POST / with `organizationController.createOrganization` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Call `validate`.
    validate(createOrganizationSchema),
    // Study: Supply `organizationController` to the surrounding statement.
    organizationController.createOrganization
// Study: End the list of information being sent to this step.
);

// Study: Register POST /register with `organizationController.registerOrganization` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/register"` here.
    "/register",
    // Study: Call `validate`.
    validate(registerOrganizationSchema),
    // Study: Supply `organizationController` to the surrounding statement.
    organizationController.registerOrganization
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
