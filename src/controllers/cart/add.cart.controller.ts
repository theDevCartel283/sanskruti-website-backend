import { Request, Response } from "express";
import cartModel from "../../model/cart.model";
import { ReqCartObject } from "../../schema/cart.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import ProductModel from "../../model/product.model";

const addToCart = async (
  req: Request<{}, {}, TokenPayload & ReqCartObject>,
  res: Response
) => {
  const user = await cartModel.findOne({ userId: req.body.userUniqueIdentity });
  const product = await ProductModel.findById(req.body.productId);

  if (!product)
    return res
      .status(404)
      .send({ message: "Product not found", type: "warning" });

  if (!user) {
    const newCart = new cartModel({
      userId: req.body.userUniqueIdentity,
      product: [
        {
          productId: product._id,
          variant: req.body.variant,
          quantity: req.body.quantity,
        },
      ],
    });
    const cart = await newCart.save();
    res.status(200).json({
      success: true,
      message: "added to cart",
      type: "success",
    });
  } else {
    let isPresent = false;
    user.product.map((item) => {
      if (
        JSON.stringify(item.productId) === JSON.stringify(product._id) &&
        JSON.stringify(item.variant) === JSON.stringify(req.body.variant)
      ) {
        isPresent = true;
      }
    });

    if (isPresent)
      return res
        .status(200)
        .send({ message: "added to cart", type: "success" });

    user.product.push({
      productId: product._id,
      variant: req.body.variant,
      quantity: req.body.quantity,
    });

    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "added to cart",
      type: "success",
    });
  }
};
export default addToCart;
