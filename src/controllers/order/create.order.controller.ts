import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { ReqOrderDetails } from "../../schema/order.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import cartModel from "../../model/cart.model";
import { v4 as uuid } from "uuid";
import orderModel from "../../model/order.model";
import PaymentModel from "../../model/payment.model";

const handlePlaceOrder = async (
  req: Request<{}, {}, TokenPayload & ReqOrderDetails>,
  res: Response
) => {
  const {
    userUniqueIdentity,
    paymentMethod,
    shippingAddress,
    billingAddress,
    SubTotal,
    discount,
    gst,
    Amount,
  } = req.body;
  const orderId = uuid();
  try {
    const cart = await cartModel.findOne({ userId: userUniqueIdentity });
    if (!cart || !cart.product.length)
      return res
        .status(400)
        .send({ message: "something went wrong", type: "error" });

    // loop through cart
    const orders = Promise.all(
      cart.product.map(async (prod) => {
        const orderItem = new orderModel({
          orderId,
          userId: userUniqueIdentity,
          product: {
            id: prod.productId,
            varient: prod.variant,
            quantity: prod.quantity,
          },

          cancellationInfo: {
            isCancelled: false,
            Amount_refunded: false,
          },

          returnInfo: {
            isReturned: false,
            Amount_refunded: false,
            status: "Null",
          },
        });
        return await orderItem.save();
      })
    );

    // payment
    const date = Date.now();
    const payment = new PaymentModel({
      userId: userUniqueIdentity,
      orderId,

      // address
      shippingAddress,
      billingAddress,

      paymentMethod,
      orderInfo: {
        Date: date,
        status: "Pending",
        SubTotal,
        ShippingCost: 0,
        Totaldiscount: discount,
        TotalGST: gst,
        Amount,
      },

      paymentInfo: {
        status: "Pending",
      },
    });
    await payment.save();

    // clear cart
    cart.product = [];
    await cart.save();

    return res.status(200).send({
      message: "Thank you for shopping at sanskrutinx.in",
      type: "success",
    });
  } catch (err) {
    logger.error("place order error" + err);
    res.status(500).send({ message: "something went wrong", type: "info" });
  }
};

export default handlePlaceOrder;
