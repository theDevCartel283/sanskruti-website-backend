import { Request, Response } from "express";
import cartModel from "../../model/cart.model";
import { TokenPayload } from "../../utils/jwt.utils";
import { ReqUpdateCart } from "../../schema/cart.schema";
import logger from "../../utils/logger.utils";
import { getCartProductsFromIds } from "./getall.cart.controller";

const handleUpdateCart = async (
  req: Request<{}, {}, TokenPayload & ReqUpdateCart>,
  res: Response
) => {
  try {
    const cart = await cartModel.findOne({
      userId: req.body.userUniqueIdentity,
    });
    if (!cart) return res.status(200).send({ cart: [] });

    const { productId, oldVariant, newVariant } = req.body;

    const findProductVariationAlreadyExists = cart.product.find(
      (product) =>
        JSON.stringify(product.productId) === JSON.stringify(productId) &&
        JSON.stringify(product.variant) === JSON.stringify(newVariant)
    );

    if (!!findProductVariationAlreadyExists) {
      cart.product = cart.product.filter(
        (product) =>
          JSON.stringify(product.productId) !== JSON.stringify(productId) ||
          JSON.stringify(product.variant) !== JSON.stringify(oldVariant)
      );
      const { filteredArray, emptyArray } = await getCartProductsFromIds(
        cart.product
      );

      if (emptyArray && emptyArray.length !== 0) {
        cart.product = cart.product.filter(
          (product) =>
            !emptyArray.find(
              (emp) =>
                product.productId === emp.productId &&
                JSON.stringify(product.variant) === JSON.stringify(emp.variant)
            )
        );
      }
      await cart.save();
      return res.status(200).send({
        cart: filteredArray,
      });
    } else {
      cart.product = cart.product.map((product) =>
        JSON.stringify(product.productId) === JSON.stringify(productId) &&
        JSON.stringify(product.variant) === JSON.stringify(oldVariant)
          ? { ...product, variant: newVariant }
          : product
      );
      const { filteredArray, emptyArray } = await getCartProductsFromIds(
        cart.product
      );

      if (emptyArray && emptyArray.length !== 0) {
        cart.product = cart.product.filter(
          (product) =>
            !emptyArray.find(
              (emp) =>
                product.productId === emp.productId &&
                JSON.stringify(product.variant) === JSON.stringify(emp.variant)
            )
        );
      }
      await cart.save();
      return res.status(200).send({
        cart: filteredArray,
      });
    }
  } catch (error) {
    logger.error("update cart error " + error);
    res.status(500).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

export default handleUpdateCart;
