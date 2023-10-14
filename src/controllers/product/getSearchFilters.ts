import { Request, Response } from "express";
import ProductModel, { ProductDocument } from "../../model/product.model";
import { ReqFilters } from "../../schema/product.schema";
import _ from "lodash";

const getTagsArray = (obj: Object) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  const tagsArray = [];
  const variantTagsArray: { [key: string]: string } = {};
  let min = undefined;
  let max = undefined;

  for (let i = 0; i < keys.length; i++) {
    let searchKey = `${keys[i]}`;

    if (keys[i].startsWith("price.min") && !Number.isNaN(Number(values[i]))) {
      min = Number(values[i]);
      continue;
    }

    if (keys[i].startsWith("price.max") && !Number.isNaN(Number(values[i]))) {
      max = Number(values[i]);
      continue;
    }

    keys[i].startsWith("var.")
      ? (variantTagsArray[searchKey.slice(4)] = values[i])
      : tagsArray.push({ [searchKey]: values[i] });
  }
  return { tagsArray, variantTagsArray, min, max };
};

const getFilteredProducts = async (
  products: ProductDocument[],
  variantTagsArray: Object,
  search: string,
  min?: number,
  max?: number
) => {
  const keys = Object.keys(variantTagsArray);
  const values = Object.values(variantTagsArray) as string[];

  let minInProducts: number | undefined = undefined;
  let maxInProducts: number | undefined = undefined;

  const filteredProducts = products
    .filter((product) => {
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
    })
    .filter((product) => {
      const inName = product.name.toLowerCase().includes(search.toLowerCase());
      const inMainCategory = product.MainCategory.toLowerCase().includes(
        search.toLowerCase()
      );
      const inSubCategory = product.SubCategory.toLowerCase().includes(
        search.toLowerCase()
      );
      return inName || inMainCategory || inSubCategory;
    })
    .map((item) => {
      if (maxInProducts === undefined) {
        maxInProducts = item.varients.variations[0].price;
      }
      if (minInProducts === undefined) {
        minInProducts = item.varients.variations[0].price;
      }
      if (item.varients.variations[0].price > maxInProducts) {
        maxInProducts = item.varients.variations[0].price;
      }
      if (item.varients.variations[0].price < minInProducts) {
        minInProducts = item.varients.variations[0].price;
      }
      return item;
    })
    .filter((item) => {
      let price = item.varients.variations[0].discount
        ? item.varients.variations[0].price -
          item.varients.variations[0].discount *
            item.varients.variations[0].price
        : item.varients.variations[0].price;
      if (max && price > max) {
        return false;
      }
      if (min && price < min) {
        return false;
      }
      return true;
    });
  return { filteredProducts, minInProducts, maxInProducts };
};

export const getallProductsFromSearchFilters = async (
  req: Request<{}, {}, {}, ReqFilters & { search?: string }>,
  res: Response
) => {
  const limit = 24;
  const page = Number(req.query.page) || 1;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  let tags = _.omit(req.query, ["page", "search"]);
  const { tagsArray, variantTagsArray, max, min } = getTagsArray(tags);

  const unFilteredProducts =
    tagsArray.length === 0
      ? await ProductModel.find().skip(skip).limit(limit)
      : await ProductModel.find({
          $and: tagsArray,
        });

  const {
    filteredProducts: products,
    maxInProducts,
    minInProducts,
  } = await getFilteredProducts(
    unFilteredProducts,
    variantTagsArray,
    search,
    min,
    max
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
    minValue: minInProducts,
    maxValue: maxInProducts,
  });
};

export default getallProductsFromSearchFilters;
