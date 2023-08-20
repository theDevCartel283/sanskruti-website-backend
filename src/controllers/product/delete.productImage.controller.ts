import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import fs from "fs";
import axios from "axios";

const deleteProductImages = async (
  req: Request<{}, {}, {}, { name: string; _id: string }>,
  res: Response
) => {
  const img = req.query.name || "";
  const productAlreadyExists = await ProductModel.findOne({
    _id: req.query._id,
  });

  if (productAlreadyExists) {
    const url_params = img.split(`${process.env.CDN_ENDPOINT}/`)[1];
    console.log(url_params);
    await axios.delete(
      `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${url_params}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    productAlreadyExists.images = productAlreadyExists.images.filter(
      (item: any) => item !== img
    );
    await productAlreadyExists.save({
      validateBeforeSave: false,
    });
    res.status(200).json({
      type: "success",
      message: "product images deleted successfully",
    });
  } else {
    res.status(500).json({
      type: "warning",
      message: "product does not exist",
    });
  }
};

export default deleteProductImages;
