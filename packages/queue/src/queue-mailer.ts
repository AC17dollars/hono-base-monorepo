import type {
  Mailer,
  SendEmailOptions,
  EmailOTPOptions,
  PasswordResetOptions,
  WelcomeMessageOptions,
} from "@repo/mail";
import type { QueueClient } from "./client.js";

/**
 * A Mailer implementation that queues emails instead of sending them directly.
 * Use this in the API to make mail sending non-blocking.
 * The queue-worker app processes these jobs and sends emails via the real Mailer.
 */
export function createQueueMailer(queue: QueueClient): Mailer {
  return {
    transporter: null as unknown as Mailer["transporter"],
    options: { from: "" },
    sendEmail: (options: SendEmailOptions) =>
      queue.addMailJob({ name: "sendEmail", data: options }).then(() => {}),
    sendEmailOTP: (options: EmailOTPOptions) =>
      queue.addMailJob({ name: "sendEmailOTP", data: options }).then(() => {}),
    sendPasswordResetEmail: (options: PasswordResetOptions) =>
      queue.addMailJob({ name: "sendPasswordResetEmail", data: options }).then(() => {}),
    sendWelcomeMessage: (options: WelcomeMessageOptions) =>
      queue.addMailJob({ name: "sendWelcomeMessage", data: options }).then(() => {}),
  };
}
