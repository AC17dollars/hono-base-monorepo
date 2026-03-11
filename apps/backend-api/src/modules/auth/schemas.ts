import { z } from "zod";
import type { SessionUser, Session } from "../../lib/app.js";

export const sessionResponseSchema: z.ZodType<{ user: SessionUser | null, session: Session | null }> = z.object({
  user: z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    email: z.string(),
    emailVerified: z.boolean(),
    name: z.string(),
    image: z.string().nullable(),
    twoFactorEnabled: z.boolean().nullable(),
  }).nullable(),
  session: z.object({
    id: z.string(),
    expiresAt: z.date(),
    token: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    userId: z.string(),
  }).nullable(),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
