import { NextFunction, Request, Response } from "express";
import varientModel from "../../model/varients.model";
import { ReqAllVarientObject } from "../../schema/varients.schema";
import ErrorHandler from "../../utils/errorHandler.utils";

const updateVarient = async (
  req: Request<{}, {}, ReqAllVarientObject>,
  res: Response,
  next: NextFunction
) => {
  const id = req.query.id;
  const varientAlreadyExists = await varientModel.findOne({ _id: id });

  if (varientAlreadyExists) {
    let isExist = false;
    const varientArray = await varientModel.find();
    varientArray.forEach((i) => {
      if (i.varientName === req.body.varientName) {
        isExist = true;
      }
    });
    if (isExist) {
      if (req.body.varientName === varientAlreadyExists.varientName) {
        await varientModel.updateOne(
          { _id: id },
          {
            $set: {
              varientName: req.body.varientName.toLowerCase(),
              value: req.body.value,
            },
          }
        );
        res.status(200).json({
          type: "success",
          message: "varient updated successfully",
        });
      } else {
        return next(new ErrorHandler("varient already exists", "error", 409));
      }
    } else {
      await varientModel.updateOne(
        { _id: id },
        {
          $set: {
            varientName: req.body.varientName.toLowerCase(),
            value: req.body.value,
          },
        }
      );
      res.status(200).json({
        type: "success",
        message: "varient updated successfully",
      });
    }
  } else {
    res.status(502).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

export default updateVarient;
