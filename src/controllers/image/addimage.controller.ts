import { Request, Response } from "express";
import imageModel from "../../model/image.model";
import path from "path";

const addImage = async (req: Request, res: Response) => {
  res.status(200).json({
    mes: "ok",
  });
};

export default addImage;
