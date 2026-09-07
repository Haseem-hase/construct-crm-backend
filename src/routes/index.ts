import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organization/organization.routes";
import roleRoutes from "../modules/roles/role.routes";
import permissionRoutes from "../modules/permission/permission.routes";
import customerRoutes from "../modules/customers/customer.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes)
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/customers", customerRoutes);

export default router;