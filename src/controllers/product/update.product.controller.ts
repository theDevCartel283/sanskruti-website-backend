import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { ReqProductObjectWithName } from "../../schema/product.schema";
import { TokenPayload } from "../../utils/jwt.utils";

const updateProduct = async (
  req: Request<{}, {}, ReqProductObjectWithName & TokenPayload>,
  res: Response
) => {
  const id: any = req.query.id;

  const product = await ProductModel.findById(id);
  if (!product) {
    return res.status(500).json({
      type: "error",
      message: "product not found",
    });
  } else {
    const duplicateCategory = await ProductModel.findOne({
      Title: req.body.name,
    });
    if (duplicateCategory) {
      if (req.body.name !== product.name) {
        res.status(200).json({
          type: "warning",
          message: "product already exists !",
        });
      } else {
        await ProductModel.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        });
        res.status(200).json({
          type: "success",
          message: "product updated successfully",
        });
      }
    } else {
      const newCategory = await ProductModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        type: "success",
        message: "product updated successfully",
      });
    }
  }
};

export default updateProduct;
