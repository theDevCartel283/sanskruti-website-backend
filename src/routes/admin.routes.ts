import express, { Request, Response, NextFunction } from "express";
import { upload } from "../middleware/upload.middleware";
import * as productController from "../controllers/product/index.product.controller";
import * as categoryController from "../controllers/category/index.category.controller";
import * as varientController from "../controllers/varient/index.varient.controller";
import * as subCategoryController from "../controllers/subcategory/index.subCategory.controller";
import * as userController from "../controllers/user/index.user.controller";
import { categoryDetails } from "../schema/category.schema";
import validateResources from "../middleware/validateResources";
import { blankSchema } from "../schema/blank.schema";
import { ProductObject } from "../schema/product.schema";
import { varientDetails } from "../schema/varients.schema";
import * as imageController from "../controllers/image/index.image.controller";
import { varientArray } from "../schema/varients.schema";
import {
  asyncArrayMiddleware,
  asyncSingleMiddleware,
} from "../middleware/middlware";
import { subCategoryDetails } from "../schema/subcategory.schema";
const router = express.Router();

// user
router.get("/getAllUsers", userController.getAllUsers);
router.delete("/deleteuser", userController.deleteUserById);
router.get("/getUserDetails", userController.handleGetUserDetails);

// product

router.post(
  "/newProduct",
  validateResources(blankSchema, ProductObject, blankSchema),
  productController.addProduct
);
router.put(
  "/updateProduct",
  validateResources(blankSchema, ProductObject, blankSchema),
  productController.updateProduct
);

router.put(
  "/variations",
  validateResources(blankSchema, varientArray, blankSchema),
  productController.addVariations
);
router.delete("/delete", productController.deleteProduct);

// categories

router.post(
  "/addCategory",
  validateResources(blankSchema, categoryDetails, blankSchema),
  categoryController.addCategory
);
router.put(
  "/updateCategory",
  validateResources(blankSchema, categoryDetails, blankSchema),
  categoryController.updateCategory
);
router.delete("/deleteCategory", categoryController.deleteCategory);

//subCategories
router.post(
  "/addSubCategory",
  validateResources(blankSchema, subCategoryDetails, blankSchema),
  subCategoryController.addSubCategory
);
router.put(
  "/updateSubCategory",
  validateResources(blankSchema, categoryDetails, blankSchema),
  subCategoryController.updateSubCategory
);
router.get("/getSubCategory", subCategoryController.getSubCategory);
router.delete("/deleteSubCategory", subCategoryController.deleteSubCategory);

//varients
router.post(
  "/addVarient",
  validateResources(blankSchema, varientDetails, blankSchema),
  varientController.addVarient
);
router.put(
  "/updateVarient",
  validateResources(blankSchema, varientDetails, blankSchema),
  varientController.updateVarient
);
router.delete("/deleteVarient", varientController.deleteVarient);

//images

// ##product

router.get("/allImages", imageController.getallImages);

router.post(
  "/addProductImages",
  upload.array("image"),
  asyncArrayMiddleware,
  productController.addProductImages
);
router.post("/deleteProductImage", productController.deleteProductImages);

// ##category
router.post(
  "/addCategoryImage",
  upload.single("image"),
  asyncSingleMiddleware,
  categoryController.addCategoryImage
);

router.post("/deleteCategoryImage", categoryController.deleteCategoryImage);

export default router;
