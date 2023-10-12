import express, { Request, Response, NextFunction } from "express";
import { upload } from "../middleware/upload.middleware";
import * as productController from "../controllers/product/index.product.controller";
import * as categoryController from "../controllers/category/index.category.controller";
import * as varientController from "../controllers/varient/index.varient.controller";
import * as subCategoryController from "../controllers/subcategory/index.subCategory.controller";
import * as bannerController from "../controllers/Banner/index.banner.controller";
import * as subBannerController from "../controllers/SubBanner/index.subbanner.controller";
import * as userController from "../controllers/user/index.user.controller";
import * as orderController from "../controllers/order/index.order.controller";
import * as couponController from "../controllers/Coupons/index.coupon.controller";
import * as markdownController from "../controllers/markdowns/index.markdown.controller";
import * as reviewController from "../controllers/product_review/index.review.controller";
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
import { adminUpdateOrder } from "../schema/order.schema";
import z from "zod";
import { couponDetails } from "../schema/coupon.schema";
import { markdownDetails } from "../schema/markdown.schema";
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
router.delete("/deleteProductImage", productController.deleteProductImages);

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

router.post("/addImagesInWebp", imageController.addImage);

router.delete("/deleteImage", imageController.delete_single_image);

router.post("/deleteProductImage", productController.deleteProductImages);

// ##category
router.post("/addCategoryImage", categoryController.addCategoryImage);

router.delete("/deleteCategoryImage", categoryController.deleteCategoryImage);

// Banner
router.post("/addBanner", bannerController.addBanner);
router.put("/updateBanner", bannerController.updateBanner);
router.delete("/deleteBanner", bannerController.deleteBanner);
router.delete("/deleteBannerImage", bannerController.deleteBannerImage);

// Sub Banner
router.post("/addSubBanner", subBannerController.addBanner);
router.put("/updateSubBanner", subBannerController.updateBanner);
router.delete("/deleteSubBanner", subBannerController.deleteBanner);
router.delete(
  "/deleteSubBannerImage",
  subBannerController.deleteSubBannerImage
);
router.get("/allOrders", orderController.getOrder);
router.get("/getOrderDetails", orderController.GetOrderDetails);

// order manipulation
router.put(
  "/updateOrderStatus",
  validateResources(
    blankSchema,
    adminUpdateOrder,
    z.object({ id: z.string() })
  ),
  orderController.handleUpdateOrderFromAdmin
);

router.put("/updatecod", orderController.handleUpdatePayStatus);

// coupon
router.get("/allCoupons", couponController.getallCoupons);
router.get("/CouponDetail", couponController.GetCouponDetails);
router
  .route("/coupons")
  .post(
    // add coupon
    validateResources(blankSchema, couponDetails, blankSchema),
    couponController.addCoupon
  )
  .put(
    // update coupon
    validateResources(
      blankSchema,
      couponDetails.merge(z.object({ previousCode: z.string() })),
      blankSchema
    ),
    couponController.handleUpdateCoupon
  )
  .delete(
    // delete coupon
    validateResources(blankSchema, blankSchema, z.object({ code: z.string() })),
    couponController.handleDeleteCoupon
  );

// markdown
router.put(
  "/addmarkdown",
  validateResources(blankSchema, markdownDetails, blankSchema),
  markdownController.addMarkdown
);

// reviews
router.route("/reviews").post(reviewController.handleGetReviewFilters);
router.route("/reviews/notify").post(reviewController.handleAdminNotifyStatus);
router
  .route("/reviews/status")
  .post(reviewController.handleAdminUpdateReviewStatus);

export default router;
