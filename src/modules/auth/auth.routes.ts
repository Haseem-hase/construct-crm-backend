import { Router } from "express";
import * as authController from "./auth.controller"

const router = Router();

router.post("/register/customer", authController.registerCustomer);

router.post("/login", authController.login)

export default router;