// Study: Connect HTTP methods and paths to middleware and handlers for organizations and their owners.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";

// Study: Import `* as organizationController` from `"./organization.controller"`.
import * as organizationController from "./organization.controller";
// Study: Import `{ validate }` from `"../../middlewares/validate"`.
import { validate } from "../../middlewares/validate";
// Study: Import `{ createOrganizationSchema, listOrganizationsQuerySchema, registerOrganizationSchem…` from `"./organization.validation"`.
import {
    // Study: Bring `createOrganizationSchema` into scope from the imported module.
    createOrganizationSchema,
    // Study: Bring `listOrganizationsQuerySchema` into scope from the imported module.
    listOrganizationsQuerySchema,
    // Study: Bring `registerOrganizationSchema` into scope from the imported module.
    registerOrganizationSchema,
// Study: Close this group and continue the enclosing expression.
} from "./organization.validation";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ requireSuperAdmin }` from `"../../middlewares/require-super-admin"`.
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
// Study: Close the call arguments.
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
// Study: Close the call arguments.
);

// Study: Register POST /register with `organizationController.registerOrganization` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/register"` here.
    "/register",
    // Study: Call `validate`.
    validate(registerOrganizationSchema),
    // Study: Supply `organizationController` to the surrounding statement.
    organizationController.registerOrganization
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
