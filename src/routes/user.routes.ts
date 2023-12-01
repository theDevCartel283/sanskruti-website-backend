import z, { string } from "zod";
import express, { Request, Response } from "express";
import * as userController from "../controllers/user/index.user.controller";
import * as productController from "../controllers/product/index.product.controller";
import * as varientController from "../controllers/varient/index.varient.controller";
import * as bannerController from "../controllers/Banner/index.banner.controller";
import * as subBannerController from "../controllers/SubBanner/index.subbanner.controller";
import * as subCategoryController from "../controllers/subcategory/index.subCategory.controller";
import * as reviewController from "../controllers/product_review/index.review.controller";
import validateResources from "../middleware/validateResources";
import * as configController from "../controllers/config/index.config.controller";
import * as markdownController from "../controllers/markdowns/index.markdown.controller";
import * as contactController from "../controllers/contact/index.contact.controller";
import { blankSchema } from "../schema/blank.schema";
import {
  userEmailPwd,
  emailPwdWithUsername,
  userMobileNoPwd,
  userMobileNoPwdWithUsername,
  authWithUsername,
  register,
  auth,
} from "../schema/user.schema";
import * as categoryController from "../controllers/category/index.category.controller";
import { filters } from "../schema/product.schema";
import { contact } from "../schema/contact.schema";

const router = express.Router();

router.post(
  "/register",
  validateResources(blankSchema, register, blankSchema),
  userController.handleRegister
);
router.post(
  "/login",
  validateResources(blankSchema, auth, blankSchema),
  userController.handleAuthentication
);

router
  .route("/forgotPassword")
  .get(
    validateResources(
      blankSchema,
      blankSchema,
      z.object({ email: z.string().email() })
    ),
    userController.handleForgotPasswordRequest
  )
  .post(
    validateResources(
      blankSchema,
      z.object({ token: z.string(), updatePassword: z.string() }),
      blankSchema
    ),
    userController.handleForgotPasswordChange
  );

router
  .route("/verifyEmail")
  .get(
    validateResources(
      blankSchema,
      blankSchema,
      z.object({ email: string().email() })
    ),
    userController.handleVerifyEmailRequest
  )
  .post(
    validateResources(
      blankSchema,
      z.object({ token: z.string() }),
      blankSchema
    ),
    userController.handleVerifyEmail
  );

router.get("/categories", categoryController.getCategory);
router.get("/categories/:id", categoryController.handleGetCategoryFromId);
router.get("/subcategories", subCategoryController.getAllSubCategories);
router.get(
  "/subcategories/:id",
  subCategoryController.handleGetSubCategoryById
);

// search
router.get("/getallProducts", productController.getallProducts);
router.get(
  "/getallProductsFromFilters",
  productController.getallProductsFromFilters
);
router.get(
  "/getallProductsFromSearchFilters",
  validateResources(
    blankSchema,
    blankSchema,
    filters.merge(z.object({ search: z.string().nullish() }))
  ),
  productController.getallProductsFromSearchFilters
);
router.get("/product", productController.getproductDetails);
router.get("/product/:id", productController.handleGetProductFromId);
router.get("/getVarients", varientController.getallVarients);
router.get("/getVarients/:id", varientController.handleGetVarientFromId);

router.get("/getAllBanners", bannerController.getallBanners);
router.get("/getAllBanners/:id", bannerController.handleGetBannerById);
router.get("/getAllSubBanners", subBannerController.getallBanners);
router.get("/getAllSubBanners/:id", subBannerController.handleGetSubBannerById);

router.get("/reviews/:id", reviewController.handleReviewFetch);

router.get("/getMarkdown", markdownController.getMarkdown);
router.get("/getSocials", configController.GetAllSocialConfig);

router.get("/analytics/google", configController.handleGetGoogleAnalytics);
router.get("/auth/status", configController.handleGetAuthStatus);

// contact us
router.post(
  "/contactus",
  validateResources(blankSchema, contact, blankSchema),
  contactController.handleAddContact
);

export default router;
