import { Router } from "express";
import { requestsController } from "./controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get("/", requestsController.getAll.bind(requestsController));
router.get(
  "/my",
  authenticate,
  requestsController.getMyRequests.bind(requestsController)
);
router.get("/:id", requestsController.getById.bind(requestsController));
router.post(
  "/",
  authenticate,
  requestsController.create.bind(requestsController)
);
router.put(
  "/:id",
  authenticate,
  requestsController.update.bind(requestsController)
);
router.delete(
  "/:id",
  authenticate,
  requestsController.delete.bind(requestsController)
);

export default router;
