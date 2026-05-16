export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message)
    this.name = "ApiError"
    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor)
  }
}
