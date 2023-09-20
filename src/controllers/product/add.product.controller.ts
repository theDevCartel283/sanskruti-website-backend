import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { Roles } from "../../config/roles.config";
import { ReqProductObjectWithName } from "../../schema/product.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import slugify from "slugify";
import axios from "axios";
import { url } from "envsafe";
const addProduct = async (
  req: Request<{}, {}, ReqProductObjectWithName & TokenPayload>,
  res: Response
) => {
  const productAlreadyNameExists = await ProductModel.findOne({
    name: req.body.name,
  });

  if (productAlreadyNameExists) {
    return res
      .status(409)
      .json({ type: "warning", message: "product name already exists" });
  }
  try {
    const img = req.body.images;
    const response2 = await axios.post(
      `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeMultipleImages`,
      img,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const urls = response2.data.urls;
    console.log(typeof urls);
    console.log(urls.length);

    const newProduct = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      gst_percent: req.body.gst_percent,
      MainCategory: req.body.MainCategory,
      SubCategory: req.body.SubCategory,
      slug: slugify(req.body.name),
      varients: req.body.varients,
      brand_name: req.body.brand_name,
      is_featured: req.body.is_featured,
      is_new_arrival: req.body.is_new_arrival,
      is_best_seller: req.body.is_best_seller,
      meta_tittle: req.body.meta_tittle,
      meta_description: req.body.meta_description,
      meta_keyword: req.body.meta_keyword,
      createdBy: req.body.userUniqueIdentity,
      images: urls || [],
    });

    const product = await newProduct.save();
    res.status(201).json({
      type: "success",
      message: "product added ",
    });
  } catch (error) {
    console.log(error);
    res.status(502).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

export default addProduct;
