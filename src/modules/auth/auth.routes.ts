import { Router } from "express";
import * as authController from "./auth.controller"
import { authenticate } from "../../middlewares/authenticate";
import { validate } from "../../middlewares/validate";
import { loginSchema, refreshTokenSchema, registerCustomerSchema } from "./auth.validation";

const router = Router();

router.post("/register/customer", validate(registerCustomerSchema), authController.registerCustomer);

router.post("/login", validate(loginSchema), authController.login)

router.get("/me", authenticate, authController.getMe)

router.post("/refresh", validate(refreshTokenSchema), authController.refreshAccessToken);

router.post("/logout", validate(refreshTokenSchema), authController.logout)
export default router;