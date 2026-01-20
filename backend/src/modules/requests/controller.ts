import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { z } from "zod";

const requestSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  preferredCondition: z
    .enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"])
    .optional(),
  locationId: z.string().uuid().optional(),
  radiusKm: z.number().min(1).max(500).default(50),
  expiresAt: z.string().datetime().optional(),
});

export const requestsController = {
  async create(req: Request, res: Response) {
    const authReq = req as any;
    const data = requestSchema.parse(req.body);

    const request = await prisma.buyerRequest.create({
      data: {
        ...data,
        buyerId: authReq.user.id,
        status: "ACTIVE",
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        category: true,
        location: true,
      },
    });

    res.status(201).json({ request });
  },

  async getAll(req: Request, res: Response) {
    const { category, status = "ACTIVE", page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { status };
    if (category) where.categoryId = category;

    const [requests, total] = await Promise.all([
      prisma.buyerRequest.findMany({
        where,
        include: {
          category: true,
          location: true,
          buyer: {
            select: {
              id: true,
              fullName: true,
              trustScore: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.buyerRequest.count({ where }),
    ]);

    res.json({
      requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  },

  async getById(req: Request, res: Response) {
    const request = await prisma.buyerRequest.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        location: true,
        buyer: {
          select: {
            id: true,
            fullName: true,
            trustScore: true,
            verificationLevel: true,
          },
        },
      },
    });

    if (!request) throw new AppError("Request not found", 404);
    res.json({ request });
  },

  async getMyRequests(req: Request, res: Response) {
    const authReq = req as any;
    const requests = await prisma.buyerRequest.findMany({
      where: { buyerId: authReq.user.id },
      include: { category: true, location: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ requests });
  },

  async update(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;
    const data = requestSchema.partial().parse(req.body);

    const request = await prisma.buyerRequest.findUnique({ where: { id } });
    if (!request) throw new AppError("Request not found", 404);
    if (request.buyerId !== authReq.user.id)
      throw new AppError("Not authorized", 403);

    const updated = await prisma.buyerRequest.update({
      where: { id },
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
    res.json({ request: updated });
  },

  async delete(req: Request, res: Response) {
    const authReq = req as any;
    const { id } = req.params;

    const request = await prisma.buyerRequest.findUnique({ where: { id } });
    if (!request) throw new AppError("Request not found", 404);
    if (request.buyerId !== authReq.user.id)
      throw new AppError("Not authorized", 403);

    await prisma.buyerRequest.delete({ where: { id } });
    res.json({ message: "Request deleted" });
  },
};
