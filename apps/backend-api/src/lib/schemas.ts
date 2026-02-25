import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string().describe("ISO 8601 timestamp"),
});

export const liveResponseSchema = z.object({
  status: z.literal("alive"),
});

export const sessionResponseSchema = z.object({
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.email(),
      image: z.string().nullable(),
      emailVerified: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .nullable(),
  session: z
    .object({
      id: z.string(),
      expiresAt: z.string(),
      token: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .nullable(),
});
