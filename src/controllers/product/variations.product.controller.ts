import { Request, Response } from "express";
import { ReqVarientArray } from "../../schema/varients.schema";
import ProductModel from "../../model/product.model";

const addVariations = async (
  req: Request<{}, {}, ReqVarientArray>,
  res: Response
) => {
  const productAlreadyExists = await ProductModel.findOne({
    name: req.query.name,
  });

  if (productAlreadyExists) {
    const updateProduct = await ProductModel.updateOne(
      { name: req.query.name },
      {
        $set: {
          varients: req.body.arr,
        },
      }
    );
    res.status(200).json({
      success: true,
      updateProduct,
    });
  } else {
    res.status(500).json({
      success: true,
      message: "product does not exist",
    });
  }
};

export default addVariations;
