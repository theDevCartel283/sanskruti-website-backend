import { Request, Response } from "express";
import varientModel from "../../model/varients.model";

const getallVarients = async (req: Request, res: Response) => {
  const varients = await varientModel.find();
  const varientsCount: number = await varientModel.countDocuments();
  if (!varients) {
    res.status(401).json({
      success: false,
      message: "no varient  found",
    });
  } else {
    res.status(200).json({
      success: true,
      varientsCount,
      varients,
    });
  }
};

export default getallVarients;
