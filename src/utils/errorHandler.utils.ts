class ErrorHandler extends Error {
  statusCode: number;
  type: string;
  constructor(message: string, type: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
}
export default ErrorHandler;
