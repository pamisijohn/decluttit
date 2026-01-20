import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1),
  messageType: z.enum(["TEXT", "IMAGE", "OFFER", "SYSTEM"]).default("TEXT"),
});

export const chatController = {
  async getConversations(req: Request, res: Response) {
    const authReq = req as any;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: authReq.user.id }, { sellerId: authReq.user.id }],
      },
      include: {
        buyer: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        seller: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    res.json({ conversations });
  },

  async getConversation(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        buyer: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        seller: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        transaction: { include: { listing: true } },
      },
    });

    if (!conversation) throw new AppError("Conversation not found", 404);
    if (
      conversation.buyerId !== authReq.user.id &&
      conversation.sellerId !== authReq.user.id
    ) {
      throw new AppError("Not authorized", 403);
    }

    res.json({ conversation });
  },

  async sendMessage(req: Request, res: Response) {
    const authReq = req as any;
    const { conversationId } = req.params;
    const data = messageSchema.parse(req.body);

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw new AppError("Conversation not found", 404);
    if (
      conversation.buyerId !== authReq.user.id &&
      conversation.sellerId !== authReq.user.id
    ) {
      throw new AppError("Not authorized", 403);
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: authReq.user.id,
        content: data.content,
        messageType: data.messageType,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    res.status(201).json({ message });
  },

  async startConversation(req: Request, res: Response) {
    const authReq = req as any;
    const { transactionId } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new AppError("Transaction not found", 404);
    if (
      transaction.buyerId !== authReq.user.id &&
      transaction.sellerId !== authReq.user.id
    ) {
      throw new AppError("Not authorized", 403);
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        transactionId,
        OR: [{ buyerId: authReq.user.id }, { sellerId: authReq.user.id }],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          transactionId,
          buyerId: transaction.buyerId,
          sellerId: transaction.sellerId,
        },
      });
    }

    res.status(201).json({ conversation });
  },

  async markAsRead(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: authReq.user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ success: true });
  },
};
