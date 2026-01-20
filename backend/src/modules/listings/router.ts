import { Router } from "express";
import { listingsController } from "./controller";
import { authenticate, optionalAuth } from "../../middleware/auth";

const router = Router();

// Public routes
router.get(
  "/",
  optionalAuth,
  listingsController.getAll.bind(listingsController)
);
router.get(
  "/user",
  authenticate,
  listingsController.getUserListings.bind(listingsController)
);
router.get(
  "/:id",
  optionalAuth,
  listingsController.getById.bind(listingsController)
);

// Protected routes
router.post(
  "/",
  authenticate,
  listingsController.create.bind(listingsController)
);
router.put(
  "/:id",
  authenticate,
  listingsController.update.bind(listingsController)
);
router.delete(
  "/:id",
  authenticate,
  listingsController.delete.bind(listingsController)
);

export default router;
