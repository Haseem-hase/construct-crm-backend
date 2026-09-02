import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organization/organization.routes";
import roleRoutes from "../modules/roles/role.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes)
router.use("/roles", roleRoutes);

export default router;