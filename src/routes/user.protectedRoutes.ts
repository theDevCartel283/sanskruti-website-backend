import { blankSchema } from "./../schema/blank.schema";
import express from "express";
import * as userController from "../controllers/user/index.user.controller";
import * as reviewController from "../controllers/product_review/index.review.controller";
import * as wishlistController from "../controllers/wishlist/index.wishlist.controller";
import * as cartController from "../controllers/cart/index.cart.controller";
import validateResources from "../middleware/validateResources";
import {
  addressObject,
  arr,
  userDetails,
  userEmailPwd,
  userMobileNoPwd,
  userUpdatePassword,
} from "../schema/user.schema";
import { reviewObject } from "../schema/review.schema";
import { wishlistDetails } from "../schema/wishlist.schema";
import { cartDetails, emailName } from "../schema/cart.schema";
import { logout, myProfile } from "../controllers/auth/user";

const router = express.Router();

router.get("/", userController.handleGetUser);
router.put(
  "/updateWishlist",
  validateResources(blankSchema, wishlistDetails, blankSchema),
  wishlistController.addToWishlist
);

router.post(
  "/update",
  validateResources(blankSchema, userDetails, blankSchema),
  userController.handleUpdateUser
);

router.get("/oauth/me", myProfile);
router.get("/oauth/logout", logout);

router.get("/emaillogout", userController.handleLogout);
router.get("/numberlogout", userController.handleLogout);

router.post(
  "/password/update",
  validateResources(blankSchema, userUpdatePassword, blankSchema),
  userController.handleUpdatePassword
);

router.delete(
  "/emaildelete",
  validateResources(blankSchema, userEmailPwd, blankSchema),
  userController.handleDeleteForEmail
);

router.delete(
  "/numberdelete",
  validateResources(blankSchema, userMobileNoPwd, blankSchema),
  userController.handleDeleteForNumber
);

router.post(
  "/address",
  validateResources(blankSchema, addressObject, blankSchema),
  userController.addAddress
);
router.put(
  "/address",
  validateResources(blankSchema, arr, blankSchema),
  userController.updateAddress
);

router.get("/address", userController.getAllAddress);

router.get(
  "/cartitems",
  validateResources(blankSchema, emailName, blankSchema),
  cartController.cartItems
);

router.put(
  "/addtocart",
  validateResources(blankSchema, cartDetails, blankSchema),
  cartController.addToCart
);

router.delete(
  "/removecartitem",
  validateResources(blankSchema, emailName, blankSchema),
  cartController.removeFromCart
);

router.put(
  "/updateReview",
  validateResources(blankSchema, reviewObject, blankSchema),
  reviewController.updateReview
);

export default router;
