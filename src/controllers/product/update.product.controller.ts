import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { ReqProductObjectWithName } from "../../schema/product.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import slugify from "slugify";
const updateProduct = async (
  req: Request<{}, {}, ReqProductObjectWithName & TokenPayload>,
  res: Response
) => {
  const id: any = req.query.id;
  const slug: string = slugify(req.body.name);
  console.log(req.body);

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
        await ProductModel.findByIdAndUpdate(
          id,
          {
            name: req.body.name,
            description: req.body.description,
            gst_percent: req.body.gst_percent,
            MainCategory: req.body.MainCategory,
            SubCategory: req.body.SubCategory,
            slug,
            varients: req.body.varients || [],
            brand_name: req.body.brand_name,
            is_featured: req.body.is_featured,
            is_new_arrival: req.body.is_new_arrival,
            is_best_seller: req.body.is_best_seller,
            meta_tittle: req.body.meta_tittle,
            meta_description: req.body.meta_description,
            meta_keyword: req.body.meta_keyword,
            createdBy: req.body.userUniqueIdentity,
            images: req.body.images || [],
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
        res.status(200).json({
          type: "success",
          message: "product updated successfully",
        });
      }
    } else {
      const newCategory = await ProductModel.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          description: req.body.description,
          gst_percent: req.body.gst_percent,
          MainCategory: req.body.MainCategory,
          SubCategory: req.body.SubCategory,
          slug,
          varients: req.body.varients || [],
          brand_name: req.body.brand_name,
          is_featured: req.body.is_featured,
          is_new_arrival: req.body.is_new_arrival,
          is_best_seller: req.body.is_best_seller,
          meta_tittle: req.body.meta_tittle,
          meta_description: req.body.meta_description,
          meta_keyword: req.body.meta_keyword,
          createdBy: req.body.userUniqueIdentity,
          images: req.body.images || [],
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        type: "success",
        message: "product updated successfully",
      });
    }
  }
};

export default updateProduct;
