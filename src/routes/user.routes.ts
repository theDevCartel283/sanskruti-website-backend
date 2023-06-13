import z from "zod";
import express, { Request, Response } from "express";
import * as userController from "../controllers/user/index.user.controller";
import * as productController from "../controllers/product/index.product.controller";
import * as varientController from "../controllers/varient/index.varient.controller";
import * as subCategoryController from "../controllers/subcategory/index.subCategory.controller";
import validateResources from "../middleware/validateResources";
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

router.post("/verify", userController.handleVerifyEmail);

router.get("/categories", categoryController.getCategory);
router.get("/subcategories", subCategoryController.getAllSubCategories);

router.get("/getallProducts", productController.getallProducts);
router.get("/product", productController.getproductDetails);
router.get("/getVarients", varientController.getallVarients);
export default router;
