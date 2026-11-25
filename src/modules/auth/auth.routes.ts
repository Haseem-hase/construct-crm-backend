// Study: Connect HTTP methods and paths to middleware and handlers for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `{ Router }` from `"express"`.
import { Router } from "express";
// Study: Import `* as authController` from `"./auth.controller"`.
import * as authController from "./auth.controller"
// Study: Import `{ authenticate }` from `"../../middlewares/authenticate"`.
import { authenticate } from "../../middlewares/authenticate";
// Study: Import `{ validate }` from `"../../middlewares/validate"`.
import { validate } from "../../middlewares/validate";
// Study: Import `{ loginSchema, refreshTokenSchema, registerCustomerSchema }` from `"./auth.validation"`.
import { loginSchema, refreshTokenSchema, registerCustomerSchema } from "./auth.validation";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: Register POST /register/customer with `authController.registerCustomer` after the listed middleware.
router.post("/register/customer", validate(registerCustomerSchema), authController.registerCustomer);

// Study: Register POST /login with `authController.login` after the listed middleware.
router.post("/login", validate(loginSchema), authController.login)

// Study: Register GET /me with `authController.getMe` after the listed middleware.
router.get("/me", authenticate, authController.getMe)

// Study: Register POST /refresh with `authController.refreshAccessToken` after the listed middleware.
router.post("/refresh", validate(refreshTokenSchema), authController.refreshAccessToken);

// Study: Register POST /logout with `authController.logout` after the listed middleware.
router.post("/logout", validate(refreshTokenSchema), authController.logout)
// Study: Expose `router` as the default export.
export default router;