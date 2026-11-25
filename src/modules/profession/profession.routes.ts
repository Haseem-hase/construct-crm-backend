// Study: This file is about the list of trades workers can be recorded under. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `* as professionController` from `"./profession.controller"` so this file can use it.
import * as professionController from "./profession.controller";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// Study: Register GET / with `professionController.getProfessions`.
router.get(
    // Study: Supply the literal string `"/"` here.
    "/",
    // Study: Supply `professionController` to the surrounding statement.
    professionController.getProfessions
// Study: End the list of information being sent to this step.
);

// Study: Make `router` the main thing other files can get from this file.
export default router;
