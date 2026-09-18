import { Router } from "express";

import * as responsibilityController from "./responsibility.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

// Get all active responsibilities
router.get(
    "/",
    authenticate,
    responsibilityController.getResponsibilities
);

export default router;
