import express, { Request, Response } from "express";
import * as userController from "../controllers/user/index.user.controller";
import * as productController from "../controllers/product/index.product.controller";
import * as varientController from "../controllers/varient/index.varient.controller";
import validateResources from "../middleware/validateResources";
import { blankSchema } from "../schema/blank.schema";
import * as imageController from "../controllers/image/index.image.controller";
import {
  userEmailPwd,
  emailPwdWithUsername,
  userMobileNoPwd,
  userMobileNoPwdWithUsername,
} from "../schema/user.schema";
import * as categoryController from "../controllers/category/index.category.controller";
import passport from "passport";

const router = express.Router();

router.post(
  "/emailregister",
  validateResources(blankSchema, emailPwdWithUsername, blankSchema),
  userController.handleRegisterWithEmail
);
router.post(
  "/numberregister",
  validateResources(blankSchema, userMobileNoPwdWithUsername, blankSchema),
  userController.handleRegisterWithNumber
);
router.post(
  "/emaillogin",
  validateResources(blankSchema, userEmailPwd, blankSchema),
  userController.handleAuthenticationWithEmail
);
router.post(
  "/numberlogin",
  validateResources(blankSchema, userMobileNoPwd, blankSchema),
  userController.handleAuthenticationWithNumber
);

router.get("/categories", categoryController.getCategory);

router.get("/getallProducts", productController.getallProducts);
router.get("/product", productController.getproductDetails);
router.get("/getVarients", varientController.getallVarients);
export default router;
