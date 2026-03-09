import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Redis
  REDIS_URL: z.string().url(),

  // SMTP / Mail (for sending emails)
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.email(),
});

export const env = schema.parse(process.env);
export type QueueWorkerEnv = typeof env;
