// Study: This file is about job roles in each company and the actions people in those roles may take. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";

// Study: Bring in `{ createGlobalRoleController, getGlobalRolesController, getGlobalRoleController, up…` from `"./role.controller"` so this file can use it.
import {
    // Study: Make `createGlobalRoleController` from the other file available here.
    createGlobalRoleController,
    // Study: Make `getGlobalRolesController` from the other file available here.
    getGlobalRolesController,
    // Study: Make `getGlobalRoleController` from the other file available here.
    getGlobalRoleController,
    // Study: Make `updateGlobalRoleController` from the other file available here.
    updateGlobalRoleController,
    // Study: Make `deleteGlobalRoleController` from the other file available here.
    deleteGlobalRoleController,
    // Study: Make `createOrganizationRoleController` from the other file available here.
    createOrganizationRoleController,
    // Study: Make `getOrganizationRolesController` from the other file available here.
    getOrganizationRolesController,
    // Study: Make `getOrganizationRoleController` from the other file available here.
    getOrganizationRoleController,
    // Study: Make `updateOrganizationRoleController` from the other file available here.
    updateOrganizationRoleController,
    // Study: Make `deleteOrganizationRoleController` from the other file available here.
    deleteOrganizationRoleController,
// Study: Finish this group and continue the surrounding step.
} from "./role.controller";

// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ authorize }` from `"../../middlewares/authorize"` so this file can use it.
import { authorize } from "../../middlewares/authorize";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";
// Study: Bring in `{ validate }` from `"../../middlewares/validate"` so this file can use it.
import { validate } from "../../middlewares/validate";
// Study: Bring in `{ createRoleSchema, roleIdSchema, updateRoleSchema }` from `"./role.validation"` so this file can use it.
import { createRoleSchema, roleIdSchema, updateRoleSchema } from "./role.validation";
// Study: Bring in `{ requireSuperAdmin }` from `"../../middlewares/require-super-admin"` so this file can use it.
import { requireSuperAdmin } from "../../middlewares/require-super-admin";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Set up a reusable step named `requireOrganizationContext`.
const requireOrganizationContext = (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => {
    // Study: Do the next step if this check passes: `req.user?.systemRole === "SUPER_ADMIN" || !req.user?.organizationId`.
    if (req.user?.systemRole === "SUPER_ADMIN" || !req.user?.organizationId) {
        // Study: Give `next(new ForbiddenError("Organization role APIs require organization membership."))` back to the code that asked for it.
        return next(new ForbiddenError("Organization role APIs require organization membership."));
    // Study: End this group of steps.
    }
    // Study: Allow the request to move to its next check or action.
    next();
// Study: End this group of steps.
};

//all role routes require authentication
// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// ==========================================
// GLOBAL ROLE ROUTES (SUPER_ADMIN)
// ==========================================

// Study: Register POST /global with `createGlobalRoleController` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/global"` here.
    "/global",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.CREATE),
    // Study: Call `validate`.
    validate(createRoleSchema, "body"),
    // Study: Supply `createGlobalRoleController` to the surrounding statement.
    createGlobalRoleController
// Study: End the list of information being sent to this step.
);

// Study: Register GET /global with `getGlobalRolesController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/global"` here.
    "/global",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Supply `getGlobalRolesController` to the surrounding statement.
    getGlobalRolesController
// Study: End the list of information being sent to this step.
);

// Study: Register GET /global/:id with `getGlobalRoleController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/global/:id"` here.
    "/global/:id",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `getGlobalRoleController` to the surrounding statement.
    getGlobalRoleController
// Study: End the list of information being sent to this step.
);

// Study: Register PATCH /global/:id with `updateGlobalRoleController` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/global/:id"` here.
    "/global/:id",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.UPDATE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Call `validate`.
    validate(updateRoleSchema, "body"),
    // Study: Supply `updateGlobalRoleController` to the surrounding statement.
    updateGlobalRoleController
// Study: End the list of information being sent to this step.
);

// Study: Register DELETE /global/:id with `deleteGlobalRoleController` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/global/:id"` here.
    "/global/:id",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.DELETE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `deleteGlobalRoleController` to the surrounding statement.
    deleteGlobalRoleController
// Study: End the list of information being sent to this step.
);

// ==========================================
// ORGANIZATION ROLE ROUTES (ORGANIZATION_OWNER)
// ==========================================

// Study: Register POST / with `createOrganizationRoleController` after the listed middleware.
router.post(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.CREATE),
    // Study: Call `validate`.
    validate(createRoleSchema, "body"),
    // Study: Supply `createOrganizationRoleController` to the surrounding statement.
    createOrganizationRoleController
// Study: End the list of information being sent to this step.
);

// Study: Register GET / with `getOrganizationRolesController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Supply `getOrganizationRolesController` to the surrounding statement.
    getOrganizationRolesController
// Study: End the list of information being sent to this step.
);

// Study: Register GET /:id with `getOrganizationRoleController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `getOrganizationRoleController` to the surrounding statement.
    getOrganizationRoleController
// Study: End the list of information being sent to this step.
);

// Study: Register PATCH /:id with `updateOrganizationRoleController` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.UPDATE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Call `validate`.
    validate(updateRoleSchema, "body"),
    // Study: Supply `updateOrganizationRoleController` to the surrounding statement.
    updateOrganizationRoleController
// Study: End the list of information being sent to this step.
);

// Study: Register DELETE /:id with `deleteOrganizationRoleController` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Check that the signed-in person has permission for the action listed here.
    authorize(Module.ROLE, Action.DELETE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `deleteOrganizationRoleController` to the surrounding statement.
    deleteOrganizationRoleController
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
