import { Request, Response, NextFunction } from "express";

const asyncErrorFunction =
  (passedFunction: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
  };

export default asyncErrorFunction;
