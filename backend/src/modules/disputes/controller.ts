import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { z } from "zod";

const disputeSchema = z.object({
  reason: z.string().min(1),
  description: z.string().min(10),
  evidence: z.array(z.string()).optional(),
});

export const disputesController = {
  async create(req: Request, res: Response) {
    const authReq = req as any;
    const { transactionId } = req.params;
    const data = disputeSchema.parse(req.body);

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

    const existingDispute = await prisma.dispute.findUnique({
      where: { transactionId },
    });

    if (existingDispute)
      throw new AppError("Dispute already exists for this transaction", 409);

    const dispute = await prisma.dispute.create({
      data: {
        transactionId,
        complainantId: authReq.user.id,
        respondentId:
          transaction.buyerId === authReq.user.id
            ? transaction.sellerId
            : transaction.buyerId,
        reason: data.reason,
        description: data.description,
        evidence: data.evidence || [],
        status: "OPEN",
      },
    });

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "DISPUTED" },
    });

    res.status(201).json({ dispute });
  },

  async getMyDisputes(req: Request, res: Response) {
    const authReq = req as any;

    const disputes = await prisma.dispute.findMany({
      where: {
        OR: [
          { complainantId: authReq.user.id },
          { respondentId: authReq.user.id },
        ],
      },
      include: {
        transaction: { include: { listing: true } },
        complainant: { select: { id: true, fullName: true } },
        respondent: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ disputes });
  },

  async getById(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        transaction: { include: { listing: true } },
        complainant: { select: { id: true, fullName: true } },
        respondent: { select: { id: true, fullName: true } },
      },
    });

    if (!dispute) throw new AppError("Dispute not found", 404);
    if (
      dispute.complainantId !== authReq.user.id &&
      dispute.respondentId !== authReq.user.id
    ) {
      throw new AppError("Not authorized", 403);
    }

    res.json({ dispute });
  },

  async addEvidence(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;
    const { evidence } = req.body;

    const dispute = await prisma.dispute.findUnique({ where: { id } });
    if (!dispute) throw new AppError("Dispute not found", 404);
    if (dispute.complainantId !== authReq.user.id)
      throw new AppError("Only complainant can add evidence", 403);

    const updated = await prisma.dispute.update({
      where: { id },
      data: { evidence: { push: evidence } },
    });

    res.json({ dispute: updated });
  },

  async resolve(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;
    const { resolution, refundBuyer } = req.body;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: { transaction: true },
    });

    if (!dispute) throw new AppError("Dispute not found", 404);

    // In production, add admin authorization check here

    await prisma.dispute.update({
      where: { id },
      data: {
        status: "RESOLVED",
        resolution,
        resolvedAt: new Date(),
      },
    });

    await prisma.transaction.update({
      where: { id: dispute.transactionId },
      data: {
        status: refundBuyer ? "REFUNDED" : "RELEASED",
        ...(refundBuyer
          ? { refundedAt: new Date() }
          : { releasedAt: new Date() }),
      },
    });

    res.json({ success: true });
  },
};
