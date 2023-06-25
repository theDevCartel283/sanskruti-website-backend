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

    const emptyArray: Types.ObjectId[] = [];
    const filteredArray = array.filter((product, index) => {
      if (!product) emptyArray.push(list[index]);
      return !!product;
    });
    return { filteredArray, emptyArray };
  } catch (error) {
    return {};
  }
};

export default getProductsFromIds;
