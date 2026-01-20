import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../../config/database";
import { config } from "../../config";
import { AppError } from "../../middleware/errorHandler";

export const paymentsController = {
  async initialize(req: Request, res: Response) {
    const authReq = req as any;
    const { transactionId } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        buyer: true,
        listing: true,
      },
    });

    if (!transaction) throw new AppError("Transaction not found", 404);
    if (transaction.buyerId !== authReq.user.id)
      throw new AppError("Not authorized", 403);
    if (transaction.status !== "PENDING")
      throw new AppError("Transaction already processed", 400);

    const amount =
      Number(transaction.amount) + Number(transaction.platformFee || 0);

    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: transaction.buyer.email,
          amount: Math.round(amount * 100), // Convert to kobo
          reference: `decluttit_${transaction.id}`,
          callback_url: `${config.frontendUrl}/transactions/${transactionId}/payment/callback`,
          metadata: { transactionId },
        },
        {
          headers: {
            Authorization: `Bearer ${config.paystack.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      await prisma.transaction.update({
        where: { id: transactionId },
        data: { paymentIntentId: response.data.data.reference },
      });

      res.json({ authorizationUrl: response.data.data.authorization_url });
    } catch (error: any) {
      throw new AppError(
        error.response?.data?.message || "Payment initialization failed",
        500
      );
    }
  },

  async verify(req: Request, res: Response) {
    const { reference } = req.query;

    if (!reference) throw new AppError("Reference required", 400);

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${config.paystack.secretKey}` },
        }
      );

      const { status, amount, data } = response.data;

      if (status === "success") {
        const transactionId = data.metadata?.transactionId;
        if (transactionId) {
          await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: "ESCROWED", paidAt: new Date() },
          });
        }
      }

      res.json({ verified: true, status });
    } catch (error: any) {
      throw new AppError("Payment verification failed", 500);
    }
  },

  async webhook(req: Request, res: Response) {
    const hash = require("crypto")
      .createHmac("sha512", config.paystack.webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (req.headers["x-paystack-signature"] !== hash) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const transactionId = event.data.metadata?.transactionId;
      if (transactionId) {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: "ESCROWED", paidAt: new Date() },
        });
      }
    }

    res.json({ received: true });
  },

  async getPaymentHistory(req: Request, res: Response) {
    const authReq = req as any;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: authReq.user.id }, { sellerId: authReq.user.id }],
        status: { in: ["ESCROWED", "RELEASED", "REFUNDED"] },
      },
      orderBy: { paidAt: "desc" },
    });

    res.json({ transactions });
  },
};
