import addProduct from "./add.product.controller";
import getallProducts from "./getall.product.controller";
import deleteProduct from "./delete.product.controller";
import getproductDetails from "./getproductDetails.controller";
import updateProduct from "./update.product.controller";
import addVariations from "./variations.product.controller";
import addProductImages from "./add.productImage.controller";
import deleteProductImages from "./delete.productImage.controller";
import getallProductsFromFilters from "./getFilters.product.controller";
import getallProductsFromSearchFilters from "./getSearchFilters";
import handleGetProductFromId from "./getProductFromId.controller";

export {
  addVariations,
  addProduct,
  getallProducts,
  getallProductsFromFilters,
  deleteProduct,
  getproductDetails,
  updateProduct,
  addProductImages,
  deleteProductImages,
  getallProductsFromSearchFilters,
  handleGetProductFromId,
};
