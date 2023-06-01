import { Request, Response } from "express";
import cartModel from "../../model/cart.model";
import { ReqCartObject } from "../../schema/cart.schema";

const addToCart = async (
  req: Request<{}, {}, ReqCartObject>,
  res: Response
) => {
  const user = await cartModel.findOne({ email: req.body.email });
  const arr: any = [
    {
      id: req.body.id,
      name: req.body.name,
      color: req.body.color,
      price: req.body.price,
      size: req.body.size,
      quantity: req.body.quantity,
      gst_price: req.body.gst_price,
      sale_price: req.body.sale_price,
    },
  ];

  if (!user) {
    const newCart = new cartModel({
      email: req.body.email,
      product: arr,
    });
    const cart = await newCart.save();
    res.status(200).json({
      success: true,
      cart,
    });
  } else {
    var isPresent: boolean = false;
    const user1 = await cartModel.findOne({ email: req.body.email });

    user1?.product.forEach((item) => {
      if (item.name === req.body.name) {
        isPresent = true;
      }
    });

    if (isPresent) {
      user1?.product.forEach((item) => {
        if (item.name === req.body.name) {
          item.quantity = req.body.quantity;
        }
      });
      await user1?.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      user1?.product.push({
        id: req.body.id,
        name: req.body.name,
        color: req.body.color,
        price: req.body.price,
        size: req.body.size,
        quantity: req.body.quantity,
        gst_price: req.body.gst_price,
        sale_price: req.body.sale_price,
      });
      const cart = await user1?.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        cart,
      });
    }
  }
};
export default addToCart;
