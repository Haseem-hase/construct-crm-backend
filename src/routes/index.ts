// Study: Mount the feature routers at their API prefixes.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";

// Study: Import `authRoutes` from `"../modules/auth/auth.routes"`.
import authRoutes from "../modules/auth/auth.routes";
// Study: Import `organizationRoutes` from `"../modules/organization/organization.routes"`.
import organizationRoutes from "../modules/organization/organization.routes";
// Study: Import `roleRoutes` from `"../modules/roles/role.routes"`.
import roleRoutes from "../modules/roles/role.routes";
// Study: Import `permissionRoutes` from `"../modules/permission/permission.routes"`.
import permissionRoutes from "../modules/permission/permission.routes";
// Study: Import `customerRoutes` from `"../modules/customers/customer.routes"`.
import customerRoutes from "../modules/customers/customer.routes";
// Study: Import `projectRoutes` from `"../modules/projects/project.routes"`.
import projectRoutes from "../modules/projects/project.routes";
// Study: Import `labourRoutes` from `"../modules/labour/labour.routes"`.
import labourRoutes from "../modules/labour/labour.routes";
// Study: Import `professionRoutes` from `"../modules/profession/profession.routes"`.
import professionRoutes from "../modules/profession/profession.routes";
// Study: Import `contractorRoutes` from `"../modules/contractor/contractor.routes"`.
import contractorRoutes from "../modules/contractor/contractor.routes";
// Study: Import `contractorProjectAssignmentRoutes` from `"../modules/contractor-project-assignment/contractor-project-assignment.routes"`.
import contractorProjectAssignmentRoutes from "../modules/contractor-project-assignment/contractor-project-assignment.routes";
// Study: Import `responsibilityRoutes` from `"../modules/responsibility/responsibility.routes"`.
import responsibilityRoutes from "../modules/responsibility/responsibility.routes";
// Study: Import `labourAssignmentRoutes` from `"../modules/labour-assignment/labour-assignment.routes"`.
import labourAssignmentRoutes from "../modules/labour-assignment/labour-assignment.routes";
// Study: Import `inventoryRoutes` from `"../modules/inventory/inventory.routes"`.
import inventoryRoutes from "../modules/inventory/inventory.routes";
// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Mount Express middleware or a child router with `authRoutes`.
router.use("/auth", authRoutes);
// Study: Mount Express middleware or a child router with `organizationRoutes`.
router.use("/organizations", organizationRoutes)
// Study: Mount Express middleware or a child router with `roleRoutes`.
router.use("/roles", roleRoutes);
// Study: Mount Express middleware or a child router with `permissionRoutes`.
router.use("/permissions", permissionRoutes);
// Study: Mount Express middleware or a child router with `customerRoutes`.
router.use("/customers", customerRoutes);
// Study: Mount Express middleware or a child router with `projectRoutes`.
router.use("/projects", projectRoutes);
// Study: Mount Express middleware or a child router with `labourRoutes`.
router.use("/labours", labourRoutes);
// Study: Mount Express middleware or a child router with `professionRoutes`.
router.use("/professions", professionRoutes);
// Study: Mount Express middleware or a child router with `contractorRoutes`.
router.use("/contractors", contractorRoutes);
// Study: Mount Express middleware or a child router with `contractorProjectAssignmentRoutes`.
router.use("/contractor-project-assignments", contractorProjectAssignmentRoutes);
// Study: Mount Express middleware or a child router with `responsibilityRoutes`.
router.use("/responsibilities", responsibilityRoutes);
// Study: Mount Express middleware or a child router with `labourAssignmentRoutes`.
router.use("/labour-assignments", labourAssignmentRoutes);
// Study: Mount Express middleware or a child router with `inventoryRoutes`.
router.use("/inventory", inventoryRoutes);

// Study: Expose `router` as the default export.
export default router;
