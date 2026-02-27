import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  APP_URL: z.url(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  // Database
  DATABASE_URL: z.string().min(1),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),

  // SMTP / Mail
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.email(),
});

export const env = schema.parse(process.env);
export type BackendApiEnv = typeof env;
