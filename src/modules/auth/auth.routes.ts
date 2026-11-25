// Study: This file is about signing in, signing out, creating an account, and staying signed in. Matches each request from the screen to the checks and work it needs.
// Study: Bring in `{ Router }` from `"express"` so this file can use it.
import { Router } from "express";
// Study: Bring in `* as authController` from `"./auth.controller"` so this file can use it.
import * as authController from "./auth.controller"
// Study: Bring in `{ authenticate }` from `"../../middlewares/authenticate"` so this file can use it.
import { authenticate } from "../../middlewares/authenticate";
// Study: Bring in `{ validate }` from `"../../middlewares/validate"` so this file can use it.
import { validate } from "../../middlewares/validate";
// Study: Bring in `{ loginSchema, refreshTokenSchema, registerCustomerSchema }` from `"./auth.validation"` so this file can use it.
import { loginSchema, refreshTokenSchema, registerCustomerSchema } from "./auth.validation";

// Study: Call `Router` and store the result as `router`.
const router = Router();

// Study: When the screen asks to submit information, use this POST address (`/register/customer`). Send the request to `authController.registerCustomer`.
router.post("/register/customer", validate(registerCustomerSchema), authController.registerCustomer);

// Study: When the screen asks to submit information, use this POST address (`/login`). Send the request to `authController.login`.
router.post("/login", validate(loginSchema), authController.login)

// Study: When the screen asks to read information, use this GET address (`/me`). First check who is signed in. Send the request to `authController.getMe`.
router.get("/me", authenticate, authController.getMe)

// Study: When the screen asks to submit information, use this POST address (`/refresh`). Send the request to `authController.refreshAccessToken`.
router.post("/refresh", validate(refreshTokenSchema), authController.refreshAccessToken);

// Study: When the screen asks to submit information, use this POST address (`/logout`). Send the request to `authController.logout`.
router.post("/logout", validate(refreshTokenSchema), authController.logout)
// Study: Make `router` the main thing other files can get from this file.
export default router;