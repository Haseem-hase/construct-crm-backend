import { Router } from "express";
import * as authController from "./auth.controller"

const router = Router();

router.post("/register/customer", authController.registerCustomer);

export default router;