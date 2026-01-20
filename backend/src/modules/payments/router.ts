import { Router } from "express";
import { paymentsController } from "./controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post(
  "/initialize",
  authenticate,
  paymentsController.initialize.bind(paymentsController)
);
router.get("/verify", paymentsController.verify.bind(paymentsController));
router.post("/webhook", paymentsController.webhook.bind(paymentsController));
router.get(
  "/history",
  authenticate,
  paymentsController.getPaymentHistory.bind(paymentsController)
);

export default router;
