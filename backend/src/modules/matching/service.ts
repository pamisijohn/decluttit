import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { Decimal } from "@prisma/client/runtime/library";

interface MatchResult {
  listingId: string;
  requestId: string;
  score: number;
  matchedCriteria: string[];
  listing: any;
}

export const matchingService = {
  async findMatchesForRequest(requestId: string): Promise<MatchResult[]> {
    const request = await prisma.buyerRequest.findUnique({
      where: { id: requestId },
      include: { location: true },
    });

    if (!request) throw new AppError("Request not found", 404);

    const where: any = {
      status: "ACTIVE",
      NOT: { sellerId: request.buyerId },
    };

    if (request.categoryId) where.categoryId = request.categoryId;
    if (request.preferredCondition)
      where.condition = request.preferredCondition;
    if (request.minPrice || request.maxPrice) {
      where.price = {};
      if (request.minPrice) where.price.gte = request.minPrice;
      if (request.maxPrice) where.price.lte = request.maxPrice;
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            trustScore: true,
            verificationLevel: true,
          },
        },
        location: true,
        photos: { take: 1 },
      },
    });

    return listings
      .map((listing) => this.calculateMatchScore(listing, request))
      .filter((match) => match.score >= 50)
      .sort((a, b) => b.score - a.score);
  },

  calculateMatchScore(listing: any, request: any): MatchResult {
    let score = 0;
    const matchedCriteria: string[] = [];

    // Category match (30 points)
    if (listing.categoryId === request.categoryId) {
      score += 30;
      matchedCriteria.push("category");
    }

    // Condition match (20 points)
    if (listing.condition === request.preferredCondition) {
      score += 20;
      matchedCriteria.push("condition");
    }

    // Price match (25 points)
    if (request.minPrice && request.maxPrice) {
      if (
        listing.price >= request.minPrice &&
        listing.price <= request.maxPrice
      ) {
        score += 25;
        matchedCriteria.push("price");
      }
    } else if (request.minPrice && listing.price >= request.minPrice) {
      score += 25;
      matchedCriteria.push("price");
    } else if (request.maxPrice && listing.price <= request.maxPrice) {
      score += 25;
      matchedCriteria.push("price");
    }

    // Location match (25 points) - simplified, in production use proper geolocation
    if (request.locationId && listing.locationId === request.locationId) {
      score += 25;
      matchedCriteria.push("location");
    }

    return {
      listingId: listing.id,
      requestId: request.id,
      score,
      matchedCriteria,
      listing,
    };
  },

  async getMatchesForListing(listingId: string) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { location: true },
    });

    if (!listing) throw new AppError("Listing not found", 404);

    const requests = await prisma.buyerRequest.findMany({
      where: {
        status: "ACTIVE",
        NOT: { buyerId: listing.sellerId },
        ...(listing.categoryId && { categoryId: listing.categoryId }),
        ...(listing.condition && { preferredCondition: listing.condition }),
      },
      include: {
        buyer: { select: { id: true, fullName: true, trustScore: true } },
        location: true,
      },
    });

    return requests.map((request) => ({
      requestId: request.id,
      listingId: listing.id,
      score: this.calculateMatchScore(listing, request).score,
      request,
    }));
  },
};

export const matchingController = {
  async getMatchesForRequest(req: Request, res: Response) {
    const { requestId } = req.params;
    const matches = await matchingService.findMatchesForRequest(requestId);
    res.json({ matches });
  },

  async getMatchesForListing(req: Request, res: Response) {
    const { listingId } = req.params;
    const matches = await matchingService.getMatchesForListing(listingId);
    res.json({ matches });
  },

  async initiateTransaction(req: Request, res: Response) {
    const authReq = req as any;
    const { listingId, requestId } = req.body;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) throw new AppError("Listing not found", 404);
    if (listing.sellerId === authReq.user.id)
      throw new AppError("Cannot buy your own listing", 400);

    // Calculate platform fee
    const amount = Number(listing.price);
    let feePercent = 10;
    if (amount > 100000) feePercent = 5;
    else if (amount > 50000) feePercent = 6;
    else if (amount > 10000) feePercent = 8;

    const platformFee = (amount * feePercent) / 100;

    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        buyerId: authReq.user.id,
        sellerId: listing.sellerId,
        buyerRequestId: requestId || null,
        amount: listing.price,
        platformFee,
        status: "PENDING",
      },
      include: {
        listing: true,
        buyer: { select: { id: true, fullName: true } },
        seller: { select: { id: true, fullName: true } },
      },
    });

    res.status(201).json({ transaction });
  },
};
