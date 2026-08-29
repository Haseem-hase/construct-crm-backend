import { Router } from "express";

import * as organizationController from "./organization.controller";
import { validate } from "../../middlewares/validate";
import { registerOrganizationSchema } from "./organization.validation";

const router = Router();

router.post(
    "/register",
    validate(registerOrganizationSchema),
    organizationController.registerOrganization
);

export default router;