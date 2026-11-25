// Study: This file is about the list of duties that can be assigned to a contractor. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";

// Study: Bring in `* as responsibilityController` from `"./responsibility.controller"` so this file can use it.
import * as responsibilityController from "./responsibility.controller";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
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
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
