import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { MAIL_QUEUE_NAME, type MailJobType } from "./types.js";

export interface QueueClientOptions {
  /** Redis URL (e.g. redis://localhost:6379) */
  redisUrl: string;
}

export interface QueueClient {
  addMailJob(job: MailJobType): Promise<string>;
  close(): Promise<void>;
}

export function createQueueClient(options: QueueClientOptions): QueueClient {
  const connection = new Redis(options.redisUrl);
  const mailQueue = new Queue(MAIL_QUEUE_NAME, {
    connection: connection as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: { count: 1000 },
    },
  });

  return {
    async addMailJob(job: MailJobType) {
      const bullJob = await mailQueue.add(job.name, job.data);
      return bullJob.id ?? "";
    },
    async close() {
      await mailQueue.close();
      await connection.quit();
    },
  };
}
