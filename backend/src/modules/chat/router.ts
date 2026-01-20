import { Router } from "express";
import { chatController } from "./controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  chatController.getConversations.bind(chatController)
);
router.get(
  "/:id",
  authenticate,
  chatController.getConversation.bind(chatController)
);
router.post(
  "/:conversationId/messages",
  authenticate,
  chatController.sendMessage.bind(chatController)
);
router.post(
  "/start",
  authenticate,
  chatController.startConversation.bind(chatController)
);
router.put(
  "/:id/read",
  authenticate,
  chatController.markAsRead.bind(chatController)
);

export default router;
