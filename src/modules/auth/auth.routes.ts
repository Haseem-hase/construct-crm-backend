import { Router } from "express";
import * as authController from "./auth.controller"
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const router = Router();

router.post("/register/customer", authController.registerCustomer);

router.post("/login", authController.login)

router.get("/me", authenticate, authController.getMe)

router.post("/refresh", authController.refreshAccessToken);

router.post("/logout", authController.logout)

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