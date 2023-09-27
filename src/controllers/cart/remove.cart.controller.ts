import { Request, Response } from "express";
import cartModel from "../../model/cart.model";
import { TokenPayload } from "../../utils/jwt.utils";
import { ReqDelCart } from "../../schema/cart.schema";
import logger from "../../utils/logger.utils";
import { getCartProductsFromIds } from "./getall.cart.controller";

const handleDeleteCart = async (
  req: Request<{}, {}, TokenPayload, ReqDelCart>,
  res: Response
) => {
  try {
    const cart = await cartModel.findOne({
      userId: req.body.userUniqueIdentity,
    });

    const { productId, variant } = req.query;
    const variantArray = variant.split(",");

    if (!cart) return res.status(200).send({ cart: [] });

    cart.product = cart.product.filter(
      (product) =>
        JSON.stringify(product.productId) !== JSON.stringify(productId) ||
        JSON.stringify(product.variant) !== JSON.stringify(variantArray)
    );
    const newCart = await cart.save({ validateBeforeSave: true });

    const { filteredArray, emptyArray } = await getCartProductsFromIds(
      newCart.product
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
      await cart.save();
    }
    return res.status(200).send({
      cart: filteredArray,
    });
  } catch (error) {
    logger.error("delete cart error " + error);
    res.status(500).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

export default handleDeleteCart;
