import { Router } from "express";

import * as organizationController from "./organization.controller";
import { validate } from "../../middlewares/validate";
import {
    createOrganizationSchema,
    listOrganizationsQuerySchema,
    registerOrganizationSchema,
} from "./organization.validation";
import { authenticate } from "../../middlewares/authenticate";
import { requireSuperAdmin } from "../../middlewares/require-super-admin";

const router = Router();

router.get(
    "/",
    authenticate,
    requireSuperAdmin,
    validate(listOrganizationsQuerySchema, "query"),
    organizationController.listOrganizations
);

router.post(
    "/",
    authenticate,
    requireSuperAdmin,
    validate(createOrganizationSchema),
    organizationController.createOrganization
);

router.post(
    "/register",
    validate(registerOrganizationSchema),
    organizationController.registerOrganization
);

export default router;
