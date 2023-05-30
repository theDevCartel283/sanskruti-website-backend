import { Request, Response, NextFunction } from "express";

export const asyncArrayMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const arr: Array<string> = [];
  const temp: any = req.files;
  console.log(temp);
  for (let x in temp) {
    arr.push(temp[x].path);
  }
  req.body.imagePathArray = arr;
  next();
};

export const asyncSingleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data: any = req.file;
  const imagePath = data.path;
  req.body.imagePath = imagePath;
  next();
};
