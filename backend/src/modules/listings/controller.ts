import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { z } from "zod";

const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  price: z.number().positive("Price must be positive"),
  locationId: z.string().uuid("Invalid location ID"),
  isNegotiable: z.boolean().default(true),
});

export const listingsController = {
  async create(req: Request, res: Response) {
    const authReq = req as any;
    const data = listingSchema.parse(req.body);

    const listing = await prisma.listing.create({
      data: {
        ...data,
        sellerId: authReq.user.id,
        status: "ACTIVE",
      },
      include: {
        category: true,
        location: true,
        photos: { orderBy: { sortOrder: "asc" } },
        seller: {
          select: {
            id: true,
            fullName: true,
            trustScore: true,
            verificationLevel: true,
          },
        },
      },
    });

    res.status(201).json({ listing });
  },

  async getAll(req: Request, res: Response) {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      locationId,
      search,
      page = "1",
      limit = "20",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: "ACTIVE",
    };

    if (category) {
      where.categoryId = category;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (locationId) {
      where.locationId = locationId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: true,
          location: true,
          photos: { orderBy: { sortOrder: "asc" }, take: 1 },
          seller: {
            select: {
              id: true,
              fullName: true,
              trustScore: true,
              verificationLevel: true,
            },
          },
        },
        orderBy: { [sortBy as string]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        photos: { orderBy: { sortOrder: "asc" } },
        category: true,
        location: true,
        seller: {
          select: {
            id: true,
            fullName: true,
            trustScore: true,
            verificationLevel: true,
            profilePhotoUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    // Increment view count
    await prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ listing });
  },

  async update(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;
    const data = listingSchema.partial().parse(req.body);

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    if (listing.sellerId !== authReq.user.id) {
      throw new AppError("Not authorized to update this listing", 403);
    }

    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: {
        category: true,
        location: true,
        photos: { orderBy: { sortOrder: "asc" } },
      },
    });

    res.json({ listing: updated });
  },

  async delete(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    if (listing.sellerId !== authReq.user.id) {
      throw new AppError("Not authorized to delete this listing", 403);
    }

    await prisma.listing.delete({ where: { id } });

    res.json({ message: "Listing deleted successfully" });
  },

  async getUserListings(req: Request, res: Response) {
    const authReq = req as any;

    const listings = await prisma.listing.findMany({
      where: { sellerId: authReq.user.id },
      include: {
        category: true,
        photos: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ listings });
  },
};
