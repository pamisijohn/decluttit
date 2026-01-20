import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";
import { config } from "../../config";
import { z } from "zod";
import { AppError } from "../../middleware/errorHandler";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const authController = {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.phone ? [{ phone: data.phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new AppError("Email or phone already registered", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        fullName: data.fullName,
        verificationLevel: "BASIC",
        trustScore: 0,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        verificationLevel: true,
        trustScore: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        verificationLevel: user.verificationLevel,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as any
    );

    res.status(201).json({
      message: "Registration successful",
      user,
      token,
    });
  },

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is deactivated", 401);
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        verificationLevel: user.verificationLevel,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as any
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        verificationLevel: user.verificationLevel,
        trustScore: user.trustScore,
        profilePhotoUrl: user.profilePhotoUrl,
      },
      token,
    });
  },

  async me(req: Request, res: Response) {
    const authReq = req as any;
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        profilePhotoUrl: true,
        verificationLevel: true,
        trustScore: true,
        createdAt: true,
        location: {
          select: {
            id: true,
            state: true,
            lga: true,
            city: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({ user });
  },

  async updateProfile(req: Request, res: Response) {
    const authReq = req as any;
    const { fullName, phone, locationId } = req.body;

    const user = await prisma.user.update({
      where: { id: authReq.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(locationId && { locationId }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        verificationLevel: true,
        trustScore: true,
        profilePhotoUrl: true,
        location: true,
      },
    });

    res.json({ user });
  },
};
