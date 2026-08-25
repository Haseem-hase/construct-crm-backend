import { Router } from "express";
import * as authController from "./auth.controller"
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.post("/register/customer", authController.registerCustomer);

router.post("/login", authController.login)

router.get("/me", authenticate, authController.getMe)

router.post("/refresh", authController.refreshAccessToken);

router.post("/logout", authController.logout)

export default router;