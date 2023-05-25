import { Request, Response } from "express";
import { ReqEmailName } from "../../schema/cart.schema";
import cartModel from "../../model/cart.model";

const removeFromCart = async (req: Request<ReqEmailName>, res: Response) => {
  const { email, name } = req.body;
  const user = await cartModel.findOne({ email });
  const arr: any = user?.product.filter((item) => {
    return item.name !== name;
  });

  const cart = await user?.updateOne({
    $set: { product: arr },
  });
  res.status(200).json({
    message: "product removed successfully",
    cart,
  });
};

export default removeFromCart;
