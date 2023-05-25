import { Request, Response } from "express";
import cartModel from "../../model/cart.model";
import { ReqEmailName } from "../../schema/cart.schema";

const cartItems = async (req: Request<ReqEmailName>, res: Response) => {
  const user = await cartModel.findOne({ email: req.body.email });

  if (user?.product.length === 0) {
    const cart = user.product;
    res.status(200).json({
      message: "cart is empty",
      cart,
    });
  } else {
    const cart = user?.product;
    res.status(200).json({
      cart,
    });
  }
};

export default cartItems;
