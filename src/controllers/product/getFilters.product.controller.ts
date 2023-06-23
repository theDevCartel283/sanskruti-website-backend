import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { ReqFilters } from "../../schema/product.schema";
import _ from "lodash";

const getTagsArray = (obj: Object) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const tagsArray = [];
  for (let i = 0; i < keys.length; i++) {
    let searchKey = `${keys[i]}`;
    tagsArray.push({ [searchKey]: values[i] });
  }
  return tagsArray;
};

export const getallProductsFromFilters = async (
  req: Request<{}, {}, {}, ReqFilters>,
  res: Response
) => {
  const limit = 25;
  const page = req.query.page || 1;

  const skip = (page - 1) * limit;

  let tags = _.omit(req.query, "page");
  const tagsArray = getTagsArray(tags);

  const products =
    tagsArray.length === 0
      ? await ProductModel.find().skip(skip).limit(limit)
      : await ProductModel.find({
          $and: tagsArray,
        });

  const totalPages = Math.ceil(products.length / limit);
  const paginatedProducts =
    skip + limit < products.length
      ? products.slice(skip, skip + limit)
      : skip < products.length && products.length < skip + limit
      ? products.slice(skip)
      : [];
  res.status(200).json({
    totalPages,
    currentPage: page,
    products: paginatedProducts,
  });
};

export default getallProductsFromFilters;
