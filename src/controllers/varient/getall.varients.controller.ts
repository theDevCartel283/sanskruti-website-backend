import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import ApiFeatures from "../../utils/apiFeatures.utils";
import varientModel from "../../model/varients.model";

const getAllVarients = async (req: Request, res: Response) => {
  const resultperpage: number = 8;
  const apiFeatures = new ApiFeatures(varientModel.find(), req.query)
    .searchForVarient()
    .filter();
  const varients = await apiFeatures.query;
  if (!varients) {
    res.status(401).json({
      type: "success",
      message: "no varients found",
    });
  } else {
    res.status(200).json({
      type: "success",
      varients,
    });
  }
};

export default getAllVarients;
