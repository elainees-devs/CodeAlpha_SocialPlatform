import { Router } from "express";
import asyncHandler from "express-async-handler";
import { authController } from "../controllers";
import { validate } from "../middlewares/validate.middleware";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import { registerSchema , loginSchema} from "../schemas";


const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(authController.register));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.get("/me", authenticateMiddleware, asyncHandler(authController.me));

export default router;