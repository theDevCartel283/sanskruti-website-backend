import { Request, Response, NextFunction } from "express";
const fs = require("fs");

export const asyncArrayMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const arr: Array<string> = [];
  const temp: any = req.files;
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
  const data1: any = req.file;
  const imageName = req.file?.filename;
  const data = fs.readFileSync(data1.path);
  const buf = Buffer.from(data);

  // Convert the image to base64 format
  const base64Image = data.toString("base64");
  const imageUrl = `data:${data1.mimetype};base64,${base64Image}`;
  req.body.data = {
    imageBuffer: buf,
    imageName,
  };
  // Remove the temporary file
  fs.unlinkSync(data1.path);
  next();
};

function imageToBase64(imagePath: String) {
  // Read the image file
  const imageData = fs.readFileSync(imagePath);

  // Convert the image to base64
  const base64Image = imageData.toString("base64");
  fs.unlinkSync(imagePath);

  return base64Image;
}
