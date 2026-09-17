import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import * as professionController from "./profession.controller";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    professionController.getProfessions
);

export default router;
