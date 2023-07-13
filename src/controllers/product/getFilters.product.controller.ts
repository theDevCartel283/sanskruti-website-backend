import { Request, Response } from "express";
import ProductModel, { ProductDocument } from "../../model/product.model";
import { ReqFilters } from "../../schema/product.schema";
import _ from "lodash";

const getTagsArray = (obj: Object) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  const tagsArray = [];
  const variantTagsArray: { [key: string]: string } = {};

  for (let i = 0; i < keys.length; i++) {
    let searchKey = `${keys[i]}`;

    keys[i].startsWith("var.")
      ? (variantTagsArray[searchKey.slice(4)] = values[i])
      : tagsArray.push({ [searchKey]: values[i] });
  }
  return { tagsArray, variantTagsArray };
};

const getFilteredProducts = async (
  products: ProductDocument[],
  variantTagsArray: Object
) => {
  const keys = Object.keys(variantTagsArray);
  const values = Object.values(variantTagsArray) as string[];

  const filteredProducts = products.filter((product) => {
    const allTrue = keys.map((key, index) => {
      const attribute = product.varients.attributes.find(
        (attr) => attr.name === key
      );
      if (!attribute) return false;

      return !!attribute.childern.find(
        (child) => child.value === values[index] && child.state
      );
    });

    return allTrue.every((val) => val);
  });
  return filteredProducts;
};

export const getallProductsFromFilters = async (
  req: Request<{}, {}, {}, ReqFilters>,
  res: Response
) => {
  const limit = 60;
  const page = Number(req.query.page) || 1;

  const skip = (page - 1) * limit;

  let tags = _.omit(req.query, "page");
  const { tagsArray, variantTagsArray } = getTagsArray(tags);

  const unFilteredProducts =
    tagsArray.length === 0
      ? await ProductModel.find().skip(skip).limit(limit)
      : await ProductModel.find({
          $and: tagsArray,
        });

  const products = await getFilteredProducts(
    unFilteredProducts,
    variantTagsArray
  );
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
