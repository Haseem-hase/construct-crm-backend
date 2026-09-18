import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organization/organization.routes";
import roleRoutes from "../modules/roles/role.routes";
import permissionRoutes from "../modules/permission/permission.routes";
import customerRoutes from "../modules/customers/customer.routes";
import projectRoutes from "../modules/projects/project.routes";
import labourRoutes from "../modules/labour/labour.routes";
import professionRoutes from "../modules/profession/profession.routes";
import contractorRoutes from "../modules/contractor/contractor.routes";
import responsibilityRoutes from "../modules/responsibility/responsibility.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes)
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/customers", customerRoutes);
router.use("/projects", projectRoutes);
router.use("/labours", labourRoutes);
router.use("/professions", professionRoutes);
router.use("/contractors", contractorRoutes);
router.use("/responsibilities", responsibilityRoutes);

export default router;