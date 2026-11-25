// Study: Connect HTTP methods and paths to middleware and handlers for the worker profession catalog.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `* as professionController` from `"./profession.controller"`.
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
// Study: Close the call arguments.
);

// Study: Expose `router` as the default export.
export default router;
