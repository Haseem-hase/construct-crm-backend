// Study: Connect HTTP methods and paths to middleware and handlers for the contractor responsibility catalog.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";

// Study: Import `* as responsibilityController` from `"./responsibility.controller"`.
import * as responsibilityController from "./responsibility.controller";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Get all active responsibilities
// Study: Register GET / with `responsibilityController.getResponsibilities` after the listed middleware.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `authenticate` to the surrounding statement.
    authenticate,
    // Study: Supply `responsibilityController` to the surrounding statement.
    responsibilityController.getResponsibilities
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
