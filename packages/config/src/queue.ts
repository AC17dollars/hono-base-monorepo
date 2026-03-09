import { z } from "zod";

const schema = z.object({
  REDIS_URL: z.string().url(),
});

export const env = schema.parse(process.env);
export type QueueEnv = typeof env;
