import { Router } from "express";
import { getPermissionsController } from "./permission.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", getPermissionsController);

export default router;
