import { NextFunction, Request, Response } from "express";
import varientModel from "../../model/varients.model";
import { ReqAllVarientObject } from "../../schema/varients.schema";
import ErrorHandler from "../../utils/errorHandler.utils";

const addVarient = async (
  req: Request<{}, {}, ReqAllVarientObject>,
  res: Response,
  next: NextFunction
) => {
  const varientAlreadyExists = await varientModel.findOne({
    varientName: req.body.varientName.toLowerCase(),
  });

  if (varientAlreadyExists) {
    return next(new ErrorHandler("varient already exists", "error", 409));
  } else {
    try {
      const newVarient = new varientModel({
        varientName: req.body.varientName.toLowerCase(),
        value: req.body.value,
      });

      const varient = await newVarient.save();
      res.status(201).json({
        type: "success",
        message: "varient added",
      });
    } catch (error) {
      res.status(502).json({
        type: "error",
        message: "something went wrong",
      });
    }
  }
};

export default addVarient;
