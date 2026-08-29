import { Router } from "express";
import * as authController from "./auth.controller"
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import { loginSchema, refreshTokenSchema, registerCustomerSchema } from "./auth.validation";

const router = Router();

router.post("/register/customer", validate(registerCustomerSchema), authController.registerCustomer);

router.post("/login", validate(loginSchema), authController.login)

router.get("/me", authenticate, authController.getMe)

router.post("/refresh", validate(refreshTokenSchema), authController.refreshAccessToken);

router.post("/logout", validate(refreshTokenSchema), authController.logout)

router.get(
    "/customer-only",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "You are allowed to access this route.",
        });
    }
);

export default router;