import { Request, Response } from "express";
import varientModel from "../../model/varients.model";
import { ReqAllVarientObject } from "../../schema/varients.schema";

const addVarient = async (
  req: Request<{}, {}, ReqAllVarientObject>,
  res: Response
) => {
  const varientAlreadyExists = await varientModel.findOne({
    varientName: req.body.varientName.toUpperCase(),
  });

  if (varientAlreadyExists) {
    const updatedVarient = await varientModel.updateOne(
      { varientName: req.body.varientName.toUpperCase() },
      {
        $set: {
          varientName: req.body.varientName.toUpperCase(),
          value: req.body.value,
        },
      }
    );
    res.status(200).json({
      success: true,
      updatedVarient,
    });
  } else {
    try {
      const newVarient = new varientModel({
        varientName: req.body.varientName.toUpperCase(),
        value: req.body.value,
      });

      const varient = await newVarient.save();
      res.status(201).json({
        success: true,
        varient,
      });
    } catch (error) {
      res.status(502).json({
        error,
      });
    }
  }
};

export default addVarient;
