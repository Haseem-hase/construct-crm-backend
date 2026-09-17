import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organization/organization.routes";
import roleRoutes from "../modules/roles/role.routes";
import permissionRoutes from "../modules/permission/permission.routes";
import customerRoutes from "../modules/customers/customer.routes";
import projectRoutes from "../modules/projects/project.routes";
import labourRoutes from "../modules/labour/labour.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes)
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/customers", customerRoutes);
router.use("/projects", projectRoutes);
router.use("/labours", labourRoutes);

export default router;