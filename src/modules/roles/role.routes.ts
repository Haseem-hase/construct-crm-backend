// Study: Connect HTTP methods and paths to middleware and handlers for role templates, organization roles, and permission assignments.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";

// Study: Import `{ createGlobalRoleController, getGlobalRolesController, getGlobalRoleController, up…` from `"./role.controller"`.
import {
    // Study: Bring `createGlobalRoleController` into scope from the imported module.
    createGlobalRoleController,
    // Study: Bring `getGlobalRolesController` into scope from the imported module.
    getGlobalRolesController,
    // Study: Bring `getGlobalRoleController` into scope from the imported module.
    getGlobalRoleController,
    // Study: Bring `updateGlobalRoleController` into scope from the imported module.
    updateGlobalRoleController,
    // Study: Bring `deleteGlobalRoleController` into scope from the imported module.
    deleteGlobalRoleController,
    // Study: Bring `createOrganizationRoleController` into scope from the imported module.
    createOrganizationRoleController,
    // Study: Bring `getOrganizationRolesController` into scope from the imported module.
    getOrganizationRolesController,
    // Study: Bring `getOrganizationRoleController` into scope from the imported module.
    getOrganizationRoleController,
    // Study: Bring `updateOrganizationRoleController` into scope from the imported module.
    updateOrganizationRoleController,
    // Study: Bring `deleteOrganizationRoleController` into scope from the imported module.
    deleteOrganizationRoleController,
// Study: Close this group and continue the enclosing expression.
} from "./role.controller";

// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ authorize }` from `"../../middlewares/authorize"`.
import { authorize } from "../../middlewares/authorize";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";
// Study: Import `{ validate }` from `"../../middlewares/validate"`.
import { validate } from "../../middlewares/validate";
// Study: Import `{ createRoleSchema, roleIdSchema, updateRoleSchema }` from `"./role.validation"`.
import { createRoleSchema, roleIdSchema, updateRoleSchema } from "./role.validation";
// Study: Import `{ requireSuperAdmin }` from `"../../middlewares/require-super-admin"`.
import { requireSuperAdmin } from "../../middlewares/require-super-admin";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Define `requireOrganizationContext` as a reusable function.
const requireOrganizationContext = (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => {
    // Study: Run the following branch when `req.user?.systemRole === "SUPER_ADMIN" || !req.user?.organizationId` is truthy.
    if (req.user?.systemRole === "SUPER_ADMIN" || !req.user?.organizationId) {
        // Study: Return `next(new ForbiddenError("Organization role APIs require organization membership."))` to the caller.
        return next(new ForbiddenError("Organization role APIs require organization membership."));
    // Study: Close the code block.
    }
    // Study: Continue to the next Express middleware or handler.
    next();
// Study: Close the code block.
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
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.CREATE),
    // Study: Call `validate`.
    validate(createRoleSchema, "body"),
    // Study: Supply `createGlobalRoleController` to the surrounding statement.
    createGlobalRoleController
// Study: Close the call arguments.
);

// Study: Register GET /global with `getGlobalRolesController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/global"` here.
    "/global",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Supply `getGlobalRolesController` to the surrounding statement.
    getGlobalRolesController
// Study: Close the call arguments.
);

// Study: Register GET /global/:id with `getGlobalRoleController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/global/:id"` here.
    "/global/:id",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `getGlobalRoleController` to the surrounding statement.
    getGlobalRoleController
// Study: Close the call arguments.
);

// Study: Register PATCH /global/:id with `updateGlobalRoleController` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/global/:id"` here.
    "/global/:id",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.UPDATE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Call `validate`.
    validate(updateRoleSchema, "body"),
    // Study: Supply `updateGlobalRoleController` to the surrounding statement.
    updateGlobalRoleController
// Study: Close the call arguments.
);

// Study: Register DELETE /global/:id with `deleteGlobalRoleController` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/global/:id"` here.
    "/global/:id",
    // Study: Supply `requireSuperAdmin` to the surrounding statement.
    requireSuperAdmin,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.DELETE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `deleteGlobalRoleController` to the surrounding statement.
    deleteGlobalRoleController
// Study: Close the call arguments.
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
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.CREATE),
    // Study: Call `validate`.
    validate(createRoleSchema, "body"),
    // Study: Supply `createOrganizationRoleController` to the surrounding statement.
    createOrganizationRoleController
// Study: Close the call arguments.
);

// Study: Register GET / with `getOrganizationRolesController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Supply `getOrganizationRolesController` to the surrounding statement.
    getOrganizationRolesController
// Study: Close the call arguments.
);

// Study: Register GET /:id with `getOrganizationRoleController` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.VIEW),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `getOrganizationRoleController` to the surrounding statement.
    getOrganizationRoleController
// Study: Close the call arguments.
);

// Study: Register PATCH /:id with `updateOrganizationRoleController` after the listed middleware.
router.patch(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.UPDATE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Call `validate`.
    validate(updateRoleSchema, "body"),
    // Study: Supply `updateOrganizationRoleController` to the surrounding statement.
    updateOrganizationRoleController
// Study: Close the call arguments.
);

// Study: Register DELETE /:id with `deleteOrganizationRoleController` after the listed middleware.
router.delete(
    // Study: Supply the literal string `"/:id"` here.
    "/:id",
    // Study: Supply `requireOrganizationContext` to the surrounding statement.
    requireOrganizationContext,
    // Study: Call `authorize`.
    authorize(Module.ROLE, Action.DELETE),
    // Study: Call `validate`.
    validate(roleIdSchema, "params"),
    // Study: Supply `deleteOrganizationRoleController` to the surrounding statement.
    deleteOrganizationRoleController
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
