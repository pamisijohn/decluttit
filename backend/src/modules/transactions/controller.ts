import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export const transactionsController = {
  async getAll(req: Request, res: Response) {
    const authReq = req as any;
    const { status, page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      OR: [{ buyerId: authReq.user.id }, { sellerId: authReq.user.id }],
    };
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          listing: { select: { id: true, title: true, photos: { take: 1 } } },
          buyer: { select: { id: true, fullName: true } },
          seller: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  },

  async getById(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        listing: { include: { photos: true, seller: true } },
        buyer: { select: { id: true, fullName: true, phone: true } },
        seller: { select: { id: true, fullName: true, phone: true } },
        conversation: {
          include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } },
        },
        reviews: true,
      },
    });

    if (!transaction) throw new AppError("Transaction not found", 404);
    if (
      transaction.buyerId !== authReq.user.id &&
      transaction.sellerId !== authReq.user.id
    ) {
      throw new AppError("Not authorized", 403);
    }

    res.json({ transaction });
  },

  async markAsShipped(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new AppError("Transaction not found", 404);
    if (transaction.sellerId !== authReq.user.id)
      throw new AppError("Not authorized", 403);
    if (transaction.status !== "ESCROWED")
      throw new AppError("Payment not yet escrowed", 400);

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: "SHIPPED" },
    });

    res.json({ transaction: updated });
  },

  async confirmReceipt(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new AppError("Transaction not found", 404);
    if (transaction.buyerId !== authReq.user.id)
      throw new AppError("Not authorized", 403);
    if (transaction.status !== "SHIPPED")
      throw new AppError("Item not yet shipped", 400);

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: "RECEIVED" },
    });

    res.json({ transaction: updated });
  },

  async releaseFunds(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new AppError("Transaction not found", 404);
    if (transaction.buyerId !== authReq.user.id)
      throw new AppError("Only buyer can release funds", 403);
    if (transaction.status !== "RECEIVED")
      throw new AppError("Receipt not confirmed", 400);

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        status: "RELEASED",
        releasedAt: new Date(),
        completedAt: new Date(),
      },
    });

    // Update listing status
    if (transaction.listingId) {
      await prisma.listing.update({
        where: { id: transaction.listingId },
        data: { status: "SOLD" },
      });
    }

    res.json({ transaction: updated });
  },
};
