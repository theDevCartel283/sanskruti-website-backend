import { Types } from "mongoose";
import ProductModel from "../model/product.model";

const getProductsFromIds = async (list: Types.ObjectId[]) => {
  try {
    const array = await Promise.all(
      list.map(async (id) => {
        const product = await ProductModel.findById(id);
        return product;
      })
    );

    const filteredArray = array.filter((product) => !!product);
    return filteredArray;
  } catch (error) {
    return [];
  }
};

export default getProductsFromIds;
