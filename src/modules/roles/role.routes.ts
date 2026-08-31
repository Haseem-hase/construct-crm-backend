import { Router } from "express";

import {
    createRoleController,
    getRolesController,
    getRoleController,
    updateRoleController,
    deleteRoleController,
} from "./role.controller";

import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import { createRoleSchema, roleIdSchema, updateRoleSchema } from "./role.validation";

const router = Router();

//all role routes require authentication
router.use(authenticate);

/**
 * Create Role
 *
 * Only Organization Owners can create
 * organization-specific roles.
 */
router.post(
    "/",
    authorize("ORGANIZATION_OWNER"),
    validate(createRoleSchema, "body"),
    createRoleController
);

/**
 * Get all Roles
 */
router.get(
    "/",
    authorize("ORGANIZATION_OWNER"),
    getRolesController
);

/**
 * Get Role by ID
 */
router.get(
    "/:id",
    authorize("ORGANIZATION_OWNER"),
    validate(roleIdSchema, "params"),
    getRoleController
);

/**
 * Update Role
 */
router.patch(
    "/:id",
    authorize("ORGANIZATION_OWNER"),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema),
    updateRoleController
);

/**
 * Delete Role
 */
router.delete(
    "/:id",
    authorize("ORGANIZATION_OWNER"),
    validate(roleIdSchema, "params"),
    deleteRoleController
);

export default router;