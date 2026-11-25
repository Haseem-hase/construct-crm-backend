// Study: Connect HTTP methods and paths to middleware and handlers for the module/action permission catalog.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ getPermissionsController }` from `"./permission.controller"`.
import { getPermissionsController } from "./permission.controller";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// Study: Register GET / with `getPermissionsController`.
router.get("/", getPermissionsController);

// Study: Expose `router` as the default export.
export default router;
