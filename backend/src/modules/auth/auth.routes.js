import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validator.js";
import { getCurrentUser, login, register } from "./auth.controllers.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/me", authenticate, getCurrentUser);
export default router;
