import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.iso.datetime().describe("ISO 8601 timestamp"),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
