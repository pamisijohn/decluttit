import { prisma } from "../../config/database";

export const trustService = {
  async calculateTrustScore(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        receivedReviews: true,
        transactionsAsBuyer: { where: { status: "RELEASED" } },
        transactionsAsSeller: { where: { status: "RELEASED" } },
      },
    });

    if (!user) return 0;

    let score = 0;

    // Base score from verification level
    switch (user.verificationLevel) {
      case "ID_VERIFIED":
        score += 50;
        break;
      case "PREMIUM":
        score += 100;
        break;
      default:
        score += 0;
    }

    // Points for successful transactions (max 100)
    const successfulTransactions =
      user.transactionsAsBuyer.length + user.transactionsAsSeller.length;
    score += Math.min(successfulTransactions * 10, 100);

    // Points from reviews (max 50)
    if (user.receivedReviews.length > 0) {
      const avgRating =
        user.receivedReviews.reduce((sum, r) => sum + r.rating, 0) /
        user.receivedReviews.length;
      score += Math.min(Math.round(avgRating * 10), 50);
    }

    // Penalties for disputes
    const disputes = await prisma.dispute.count({
      where: {
        OR: [{ complainantId: userId }, { respondentId: userId }],
        status: "RESOLVED",
      },
    });
    score -= disputes * 20;

    // Penalty for cancelled transactions
    const cancelled = await prisma.transaction.count({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
        status: "CANCELLED",
      },
    });
    score -= cancelled * 10;

    return Math.max(0, Math.min(score, 300)); // Cap at 300
  },

  async updateTrustScore(userId: string): Promise<void> {
    const newScore = await this.calculateTrustScore(userId);
    await prisma.user.update({
      where: { id: userId },
      data: { trustScore: newScore },
    });
  },

  async handleIdVerification(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { verificationLevel: "ID_VERIFIED" },
    });
    await this.updateTrustScore(userId);
  },

  async handleTransactionComplete(transactionId: string): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (transaction) {
      await Promise.all([
        this.updateTrustScore(transaction.buyerId),
        this.updateTrustScore(transaction.sellerId),
      ]);
    }
  },

  async handleDispute(distanceId: string, respondentId: string): Promise<void> {
    // Penalty for user found at fault in dispute
    await this.updateTrustScore(respondentId);
  },
};
