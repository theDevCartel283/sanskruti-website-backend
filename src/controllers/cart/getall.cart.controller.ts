import { Request, Response } from "express";
import cartModel from "../../model/cart.model";
import { TokenPayload } from "../../utils/jwt.utils";
import { Types } from "mongoose";
import ProductModel from "../../model/product.model";

const getCartProductsFromIds = async (
  cart: {
    productId: Types.ObjectId;
    variant: string[];
    quantity: number;
  }[]
) => {
  try {
    const array = await Promise.all(
      cart.map(async (cartItem) => {
        const product = await ProductModel.findById(cartItem.productId);
        return {
          product,
          variant: cartItem.variant,
          quantity: cartItem.quantity,
        };
      })
    );

    const emptyArray: Types.ObjectId[] = [];
    const filteredArray = array.filter((cartItem, index) => {
      if (!cartItem.product) emptyArray.push(cart[index].productId);
      return !!cartItem;
    });
    return { filteredArray, emptyArray };
  } catch (error) {
    return {};
  }
};

const cartItems = async (req: Request<{}, {}, TokenPayload>, res: Response) => {
  const user = await cartModel.findOne({ userId: req.body.userUniqueIdentity });

  if (!user) return res.send(200).send({ cart: [] });

  let cart = user.product || [];
  const { filteredArray, emptyArray } = await getCartProductsFromIds(cart);

  if (emptyArray && emptyArray.length !== 0) {
    user.product = user.product.filter(
      (product) => !emptyArray.includes(product.productId)
    );
    await user.save();
  }
  return res.send({
    cart: filteredArray,
  });
};

export default cartItems;
