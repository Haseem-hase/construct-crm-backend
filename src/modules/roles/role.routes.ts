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
    authorize("SUPER_ADMIN"),
    validate(createRoleSchema, "body"),
    createGlobalRoleController
);

router.get(
    "/global",
    authorize("SUPER_ADMIN"),
    getGlobalRolesController
);

router.get(
    "/global/:id",
    authorize("SUPER_ADMIN"),
    validate(roleIdSchema, "params"),
    getGlobalRoleController
);

router.patch(
    "/global/:id",
    authorize("SUPER_ADMIN"),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema, "body"),
    updateGlobalRoleController
);

router.delete(
    "/global/:id",
    authorize("SUPER_ADMIN"),
    validate(roleIdSchema, "params"),
    deleteGlobalRoleController
);

// ==========================================
// ORGANIZATION ROLE ROUTES (ORGANIZATION_OWNER)
// ==========================================

router.post(
    "/",
    authorize("ORGANIZATION_OWNER"),
    validate(createRoleSchema, "body"),
    createOrganizationRoleController
);

router.get(
    "/",
    authorize("ORGANIZATION_OWNER"),
    getOrganizationRolesController
);

router.get(
    "/:id",
    authorize("ORGANIZATION_OWNER"),
    validate(roleIdSchema, "params"),
    getOrganizationRoleController
);

router.patch(
    "/:id",
    authorize("ORGANIZATION_OWNER"),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema, "body"),
    updateOrganizationRoleController
);

router.delete(
    "/:id",
    authorize("ORGANIZATION_OWNER"),
    validate(roleIdSchema, "params"),
    deleteOrganizationRoleController
);

export default router;