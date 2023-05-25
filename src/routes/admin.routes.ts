import express, { Request, Response, NextFunction } from "express";
import { upload } from "../middleware/upload.middleware";
import * as productController from "../controllers/product/index.product.controller";
import * as categoryController from "../controllers/category/index.category.controller";
import * as varientController from "../controllers/varient/index.varient.controller";
import { categoryDetails } from "../schema/category.schema";
import validateResources from "../middleware/validateResources";
import { blankSchema } from "../schema/blank.schema";
import { ProductObject } from "../schema/product.schema";
import { varientDetails } from "../schema/varients.schema";
import * as imageController from "../controllers/image/index.image.controller";
import { varientArray } from "../schema/varients.schema";
const router = express.Router();

// product

router.post(
  "/newProduct",
  upload.array("productImg"),
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

router.put(
  "/addCategory",
  validateResources(blankSchema, categoryDetails, blankSchema),
  categoryController.addCategory
);
router.delete("/deleteCategory", categoryController.deleteCategory);

//varients
router.put(
  "/updateVarient",
  validateResources(blankSchema, varientDetails, blankSchema),
  varientController.addVarient
);
router.delete("/deleteVarient", varientController.deleteVarient);

//images
router.get("/allImages", imageController.getallImages);

router.post(
  "/addImages",
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    const file: any = req.file;
    console.log(file);
    res.status(201).json({
      message: "upload successfully",
    });
  }
);

export default router;
