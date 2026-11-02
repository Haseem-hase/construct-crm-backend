import { Router } from "express";

import {
    createGlobalRoleController,
    getGlobalRolesController,
    getGlobalRoleController,
    updateGlobalRoleController,
    deleteGlobalRoleController,
    createOrganizationRoleController,
    getOrganizationRolesController,
    getOrganizationRoleController,
    updateOrganizationRoleController,
    deleteOrganizationRoleController,
} from "./role.controller";

import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { Module, Action } from "@prisma/client";
import { validate } from "../../middlewares/validate";
import { createRoleSchema, roleIdSchema, updateRoleSchema } from "./role.validation";
import { requireSuperAdmin } from "../../middlewares/require-super-admin";
import { ForbiddenError } from "../../errors/ForbiddenError";

const router = Router();

const requireOrganizationContext = (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => {
    if (req.user?.systemRole === "SUPER_ADMIN" || !req.user?.organizationId) {
        return next(new ForbiddenError("Organization role APIs require organization membership."));
    }
    next();
};

//all role routes require authentication
router.use(authenticate);

// ==========================================
// GLOBAL ROLE ROUTES (SUPER_ADMIN)
// ==========================================

router.post(
    "/global",
    requireSuperAdmin,
    authorize(Module.ROLE, Action.CREATE),
    validate(createRoleSchema, "body"),
    createGlobalRoleController
);

router.get(
    "/global",
    requireSuperAdmin,
    authorize(Module.ROLE, Action.VIEW),
    getGlobalRolesController
);

router.get(
    "/global/:id",
    requireSuperAdmin,
    authorize(Module.ROLE, Action.VIEW),
    validate(roleIdSchema, "params"),
    getGlobalRoleController
);

router.patch(
    "/global/:id",
    requireSuperAdmin,
    authorize(Module.ROLE, Action.UPDATE),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema, "body"),
    updateGlobalRoleController
);

router.delete(
    "/global/:id",
    requireSuperAdmin,
    authorize(Module.ROLE, Action.DELETE),
    validate(roleIdSchema, "params"),
    deleteGlobalRoleController
);

// ==========================================
// ORGANIZATION ROLE ROUTES (ORGANIZATION_OWNER)
// ==========================================

router.post(
    "/",
    requireOrganizationContext,
    authorize(Module.ROLE, Action.CREATE),
    validate(createRoleSchema, "body"),
    createOrganizationRoleController
);

router.get(
    "/",
    requireOrganizationContext,
    authorize(Module.ROLE, Action.VIEW),
    getOrganizationRolesController
);

router.get(
    "/:id",
    requireOrganizationContext,
    authorize(Module.ROLE, Action.VIEW),
    validate(roleIdSchema, "params"),
    getOrganizationRoleController
);

router.patch(
    "/:id",
    requireOrganizationContext,
    authorize(Module.ROLE, Action.UPDATE),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema, "body"),
    updateOrganizationRoleController
);

router.delete(
    "/:id",
    requireOrganizationContext,
    authorize(Module.ROLE, Action.DELETE),
    validate(roleIdSchema, "params"),
    deleteOrganizationRoleController
);

export default router;
