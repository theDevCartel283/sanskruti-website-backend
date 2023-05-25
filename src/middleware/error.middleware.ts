import ErrorHandler from "../utils/errorHandler.utils";
import { Request, Response, NextFunction } from "express";

const errFunction = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    type: err.type,
  });
};

export default errFunction;
