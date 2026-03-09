import { Redis } from "ioredis";

/**
 * Creates a Redis connection suitable for BullMQ workers.
 * Use this in the queue-worker app to ensure version compatibility with BullMQ.
 */
export function createWorkerConnection(redisUrl: string): Redis {
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
}
