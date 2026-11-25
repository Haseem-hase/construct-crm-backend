// Study: This file is about the list of actions people can be allowed to take. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `{ getPermissionsController }` from `"./permission.controller"` so this file can use it.
import { getPermissionsController } from "./permission.controller";
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Mount Express middleware or a child router with `authenticate`.
router.use(authenticate);

// Study: When the screen asks to read information, use this GET address (`/`).
router.get("/", getPermissionsController);

// Study: Make `router` the main thing other files can get from this file.
export default router;
