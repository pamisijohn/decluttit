import { Router } from "express";
import { authController } from "./controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

// Public routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

// Protected routes
router.get("/me", authenticate, authController.me.bind(authController));
router.put(
  "/profile",
  authenticate,
  authController.updateProfile.bind(authController)
);

export default router;
