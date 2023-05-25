import { Request, Response } from "express";
import imageModel from "../../model/image.model";

const getallImages = async (req: Request, res: Response) => {
  const allImages = await imageModel.find();

  res.status(200).json({
    success: true,
    allImages,
  });
};
export default getallImages;
