import { Router } from "express";
import { disputesController } from "./controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  disputesController.getMyDisputes.bind(disputesController)
);
router.get(
  "/:id",
  authenticate,
  disputesController.getById.bind(disputesController)
);
router.post(
  "/:transactionId",
  authenticate,
  disputesController.create.bind(disputesController)
);
router.post(
  "/:id/evidence",
  authenticate,
  disputesController.addEvidence.bind(disputesController)
);
router.put(
  "/:id/resolve",
  authenticate,
  disputesController.resolve.bind(disputesController)
);

export default router;
