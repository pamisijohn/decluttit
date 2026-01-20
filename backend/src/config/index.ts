import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET || "default-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || "",
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || "",
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "us-east-1",
    s3Bucket: process.env.AWS_S3_BUCKET || "decluttit-uploads",
  },

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Platform fee percentage by price range
  platformFees: {
    tier1: { maxAmount: 10000, feePercent: 10 },
    tier2: { maxAmount: 50000, feePercent: 8 },
    tier3: { maxAmount: 100000, feePercent: 6 },
    tier4: { maxAmount: Infinity, feePercent: 5 },
  },
};
