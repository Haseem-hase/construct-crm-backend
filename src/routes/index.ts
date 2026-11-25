// Study: Directs requests to the right part of the CRM, such as projects, customers, or inventory.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";

// Study: Bring in `authRoutes` from `"../modules/auth/auth.routes"` so this file can use it.
import authRoutes from "../modules/auth/auth.routes";
// Study: Bring in `organizationRoutes` from `"../modules/organization/organization.routes"` so this file can use it.
import organizationRoutes from "../modules/organization/organization.routes";
// Study: Bring in `roleRoutes` from `"../modules/roles/role.routes"` so this file can use it.
import roleRoutes from "../modules/roles/role.routes";
// Study: Bring in `permissionRoutes` from `"../modules/permission/permission.routes"` so this file can use it.
import permissionRoutes from "../modules/permission/permission.routes";
// Study: Bring in `customerRoutes` from `"../modules/customers/customer.routes"` so this file can use it.
import customerRoutes from "../modules/customers/customer.routes";
// Study: Bring in `projectRoutes` from `"../modules/projects/project.routes"` so this file can use it.
import projectRoutes from "../modules/projects/project.routes";
// Study: Bring in `labourRoutes` from `"../modules/labour/labour.routes"` so this file can use it.
import labourRoutes from "../modules/labour/labour.routes";
// Study: Bring in `professionRoutes` from `"../modules/profession/profession.routes"` so this file can use it.
import professionRoutes from "../modules/profession/profession.routes";
// Study: Bring in `contractorRoutes` from `"../modules/contractor/contractor.routes"` so this file can use it.
import contractorRoutes from "../modules/contractor/contractor.routes";
// Study: Bring in `contractorProjectAssignmentRoutes` from `"../modules/contractor-project-assignment/contractor-project-assignment.routes"` so this file can use it.
import contractorProjectAssignmentRoutes from "../modules/contractor-project-assignment/contractor-project-assignment.routes";
// Study: Bring in `responsibilityRoutes` from `"../modules/responsibility/responsibility.routes"` so this file can use it.
import responsibilityRoutes from "../modules/responsibility/responsibility.routes";
// Study: Bring in `labourAssignmentRoutes` from `"../modules/labour-assignment/labour-assignment.routes"` so this file can use it.
import labourAssignmentRoutes from "../modules/labour-assignment/labour-assignment.routes";
// Study: Bring in `inventoryRoutes` from `"../modules/inventory/inventory.routes"` so this file can use it.
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

// Study: Make `router` the main thing other files can get from this file.
export default router;
