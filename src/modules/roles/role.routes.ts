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

const router = Router();

//all role routes require authentication
router.use(authenticate);

// ==========================================
// GLOBAL ROLE ROUTES (SUPER_ADMIN)
// ==========================================

router.post(
    "/global",
    authorize(Module.ROLE, Action.CREATE),
    validate(createRoleSchema, "body"),
    createGlobalRoleController
);

router.get(
    "/global",
    authorize(Module.ROLE, Action.VIEW),
    getGlobalRolesController
);

router.get(
    "/global/:id",
    authorize(Module.ROLE, Action.VIEW),
    validate(roleIdSchema, "params"),
    getGlobalRoleController
);

router.patch(
    "/global/:id",
    authorize(Module.ROLE, Action.UPDATE),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema, "body"),
    updateGlobalRoleController
);

router.delete(
    "/global/:id",
    authorize(Module.ROLE, Action.DELETE),
    validate(roleIdSchema, "params"),
    deleteGlobalRoleController
);

// ==========================================
// ORGANIZATION ROLE ROUTES (ORGANIZATION_OWNER)
// ==========================================

router.post(
    "/",
    authorize(Module.ROLE, Action.CREATE),
    validate(createRoleSchema, "body"),
    createOrganizationRoleController
);

router.get(
    "/",
    authorize(Module.ROLE, Action.VIEW),
    getOrganizationRolesController
);

router.get(
    "/:id",
    authorize(Module.ROLE, Action.VIEW),
    validate(roleIdSchema, "params"),
    getOrganizationRoleController
);

router.patch(
    "/:id",
    authorize(Module.ROLE, Action.UPDATE),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema, "body"),
    updateOrganizationRoleController
);

router.delete(
    "/:id",
    authorize(Module.ROLE, Action.DELETE),
    validate(roleIdSchema, "params"),
    deleteOrganizationRoleController
);

export default router;