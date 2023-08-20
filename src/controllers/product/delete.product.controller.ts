import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { Roles } from "../../config/roles.config";
import { TokenPayload } from "../../utils/jwt.utils";
import fs from "fs";
import axios from "axios";

const deleteProduct = async (req: Request<TokenPayload>, res: Response) => {
  const productAlreadyExists = await ProductModel.findOne({
    _id: req.query.id,
  });

  if (productAlreadyExists) {
    productAlreadyExists.images.map(async (item) => {
      const name = item.split(`${process.env.CDN_ENDPOINT}/`)[1];
      console.log(name);
      const response = await axios.delete(
        `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${name}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    await ProductModel.deleteOne({ _id: req.query.id });
    res.status(200).json({
      type: "success",
      message: "product deleted successfully",
    });
  } else {
    res.status(500).json({
      type: "error",
      message: "product does not exist",
    });
  }
};

export default deleteProduct;
