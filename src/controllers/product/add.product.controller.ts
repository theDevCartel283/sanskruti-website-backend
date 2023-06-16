import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { Roles } from "../../config/roles.config";
import { ReqProductObjectWithName } from "../../schema/product.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import multer from "multer";
import path from "path";
const directory = path.join(__dirname, "../../../public/images");

var upload = multer({ dest: `${directory}` });

const addProduct = async (
  req: Request<{}, {}, ReqProductObjectWithName & TokenPayload>,
  res: Response
) => {
  const productAlreadyNameExists = await ProductModel.findOne({
    name: req.body.name,
  });

  if (productAlreadyNameExists)
    return res
      .status(409).json({ type: "warning", message: "product name already exists" });

  const productAlreadySlugExists = await ProductModel.findOne({
    slug: req.body.slug,
  });

  if (productAlreadySlugExists)
    return res
      .status(409)
      .json({ type: "warning", message: "product slug already exists" });

  try {
    const newProduct = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      gst_price: req.body.gst_price,
      sale_price: req.body.sale_price,
      MainCategory: req.body.MainCategory,
      SubCategory: req.body.SubCategory,
      slug: req.body.slug,
      brand_name: req.body.brand_name,
      is_featured: req.body.is_featured,
      is_new_arrival: req.body.is_new_arrival,
      is_best_seller: req.body.is_best_seller,
      meta_tittle: req.body.meta_tittle,
      meta_description: req.body.meta_description,
      meta_keyword: req.body.meta_keyword,
      createdBy: req.body.userUniqueIdentity,
    });

    const product = await newProduct.save();
    res.status(201).json({
      type: "success",
      message: "product added ",
    });
  } catch (error) {
    res.status(502).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

export default addProduct;
