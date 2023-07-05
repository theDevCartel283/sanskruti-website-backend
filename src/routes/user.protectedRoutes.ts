import { blankSchema } from "./../schema/blank.schema";
import express from "express";
import * as userController from "../controllers/user/index.user.controller";
import * as reviewController from "../controllers/product_review/index.review.controller";
import * as wishlistController from "../controllers/wishlist/index.wishlist.controller";
import * as cartController from "../controllers/cart/index.cart.controller";
import * as orderController from "../controllers/order/index.order.controller";
import validateResources from "../middleware/validateResources";
import {
  Address,
  addressObject,
  auth,
  userDetails,
  userMobileNoPwd,
  userUpdatePassword,
} from "../schema/user.schema";
import { reviewObject } from "../schema/review.schema";
import { wishlistDetails } from "../schema/wishlist.schema";
import { cartDetails, delCart, updateCart } from "../schema/cart.schema";
import { z } from "zod";
import { orderDetails } from "../schema/order.schema";

const router = express.Router();

router.get("/", userController.handleGetUser);

router.post(
  "/update",
  validateResources(blankSchema, userDetails, blankSchema),
  userController.handleUpdateUser
);

router.get("/logout", userController.handleLogout);

router.post(
  "/password/update",
  validateResources(blankSchema, userUpdatePassword, blankSchema),
  userController.handleUpdatePassword
);

router.delete(
  "/delete",
  validateResources(blankSchema, auth, blankSchema),
  userController.handleDelete
);

router.delete(
  "/numberdelete",
  validateResources(blankSchema, userMobileNoPwd, blankSchema),
  userController.handleDelete
);

router
  .route("/address")
  .get(
    // Get all address
    userController.getAllAddress
  )
  .post(
    // Add address
    validateResources(blankSchema, addressObject, blankSchema),
    userController.addAddress
  )
  .put(
    // Update Address
    validateResources(blankSchema, Address, blankSchema),
    userController.updateAddress
  )
  .delete(
    // Delete Address
    validateResources(blankSchema, blankSchema, z.object({ id: z.string() })),
    userController.handleDeleteAddress
  );

router
  .route("/wishlist")
  .get(wishlistController.handleGetWishlist)
  .post(
    validateResources(blankSchema, wishlistDetails, blankSchema),
    wishlistController.addToWishlist
  )
  .delete(wishlistController.handleRemoveFromWishlist);

router
  .route("/cart")
  .get(cartController.cartItems)
  .post(
    validateResources(blankSchema, cartDetails, blankSchema),
    cartController.addToCart
  )
  .put(
    validateResources(blankSchema, updateCart, blankSchema),
    cartController.handleUpdateCart
  )
  .delete(
    validateResources(blankSchema, blankSchema, delCart),
    cartController.handleDeleteCart
  );
router.post(
  "/cart/quantity",
  validateResources(blankSchema, cartDetails, blankSchema),
  cartController.handleUpdateCartQuantity
);

router
  .route("/order")
  .post(
    validateResources(blankSchema, orderDetails, blankSchema),
    orderController.handlePlaceOrder
  );

router.get("/order/history", orderController.handleGetAllOrders);
router.get(
  "/order/history/:orderId",
  validateResources(
    z.object({ orderId: z.string() }),
    blankSchema,
    blankSchema
  ),
  orderController.handleGetOrder
);

router.put(
  "/updateReview",
  validateResources(blankSchema, reviewObject, blankSchema),
  reviewController.updateReview
);

export default router;
