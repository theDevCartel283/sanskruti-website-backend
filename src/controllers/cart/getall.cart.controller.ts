import { Request, Response } from "express";
import cartModel from "../../model/cart.model";
import { TokenPayload } from "../../utils/jwt.utils";
import { Types } from "mongoose";
import ProductModel from "../../model/product.model";
import logger from "../../utils/logger.utils";
import { GetAmountCart } from "../../utils/getAmount";

export const getCartProductsFromIds = async (
  cart: {
    productId: Types.ObjectId;
    variant: string[];
    quantity: number;
  }[]
) => {
  try {
    let emptyArray: { productId: Types.ObjectId; variant: string[] }[] = [];
    let filteredArray: GetAmountCart[] = [];

    for (const cartItem of cart) {
      const product = await ProductModel.findById(cartItem.productId);
      const doesVariationExist = product?.varients.variations.find(
        (variant) => {
          return (
            JSON.stringify(variant.combinationString) ===
            JSON.stringify(cartItem.variant)
          );
        }
      );

      if (
        product &&
        doesVariationExist &&
        doesVariationExist?.quantity - 1 >= 0
      ) {
        filteredArray.push({
          product,
          variant: cartItem.variant,
          quantity: cartItem.quantity,
        });
      } else {
        emptyArray.push({
          productId: cartItem.productId,
          variant: cartItem.variant,
        });
      }
    }
    return { filteredArray, emptyArray };
  } catch (error) {
    return {};
  }
};

const cartItems = async (req: Request<{}, {}, TokenPayload>, res: Response) => {
  try {
    const user = await cartModel.findOne({
      userId: req.body.userUniqueIdentity,
    });
    if (!user) return res.status(200).send({ cart: [] });

    let cart = user.product || [];
    const { filteredArray, emptyArray } = await getCartProductsFromIds(cart);

    if (emptyArray && emptyArray.length !== 0) {
      user.product = user.product.filter(
        (product) =>
          !emptyArray.find(
            (emp) =>
              product.productId === emp.productId &&
              JSON.stringify(product.variant) === JSON.stringify(emp.variant)
          )
      );
      await user.save();
    }
    return res.status(200).send({
      cart: filteredArray,
    });
  } catch (error) {
    logger.error("get cart " + error);
    res.status(500).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

export default cartItems;
