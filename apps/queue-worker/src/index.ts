import { Worker } from "bullmq";
import {
  createMailer,
  sendEmail,
  sendEmailOTP,
  sendPasswordResetEmail,
  sendWelcomeMessage,
} from "@repo/mail";
import { createWorkerConnection, MAIL_QUEUE_NAME } from "@repo/queue";
import type { MailJobType } from "@repo/queue";
import { env } from "@repo/config/queue-worker";

const connection = createWorkerConnection(env.REDIS_URL);

const mailer = createMailer({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  from: env.SMTP_FROM,
});

async function processMailJob(job: { name: string; data: unknown }) {
  const { name, data } = job as { name: MailJobType["name"]; data: MailJobType["data"] };

  switch (name) {
    case "sendEmail":
      await sendEmail(data as Parameters<typeof sendEmail>[0], mailer);
      break;
    case "sendEmailOTP":
      await sendEmailOTP(data as Parameters<typeof sendEmailOTP>[0], mailer);
      break;
    case "sendPasswordResetEmail":
      await sendPasswordResetEmail(
        data as Parameters<typeof sendPasswordResetEmail>[0],
        mailer,
      );
      break;
    case "sendWelcomeMessage":
      await sendWelcomeMessage(
        data as Parameters<typeof sendWelcomeMessage>[0],
        mailer,
      );
      break;
    default:
      throw new Error(`Unknown mail job type: ${name}`);
  }
}

const worker = new Worker(
  MAIL_QUEUE_NAME,
  async (job) => {
    await processMailJob(job);
  },
  {
    connection: connection as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`[${MAIL_QUEUE_NAME}] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[${MAIL_QUEUE_NAME}] Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.error(`[${MAIL_QUEUE_NAME}] Worker error:`, err);
});

console.log(`Queue worker started, processing ${MAIL_QUEUE_NAME}...`);

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing worker...");
  await worker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, closing worker...");
  await worker.close();
  process.exit(0);
});
