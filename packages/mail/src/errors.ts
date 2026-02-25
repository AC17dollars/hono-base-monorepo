export class EmailError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "EmailError";
    Object.setPrototypeOf(this, EmailError.prototype);
  }
}
