import { Router } from "express";
import { transactionsController } from "./controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  transactionsController.getAll.bind(transactionsController)
);
router.get(
  "/:id",
  authenticate,
  transactionsController.getById.bind(transactionsController)
);
router.post(
  "/:id/ship",
  authenticate,
  transactionsController.markAsShipped.bind(transactionsController)
);
router.post(
  "/:id/confirm",
  authenticate,
  transactionsController.confirmReceipt.bind(transactionsController)
);
router.post(
  "/:id/release",
  authenticate,
  transactionsController.releaseFunds.bind(transactionsController)
);

export default router;
