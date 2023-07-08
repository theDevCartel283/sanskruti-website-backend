import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { ReqOrderDetails } from "../../schema/order.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import cartModel from "../../model/cart.model";
import { v4 as uuid } from "uuid";
import orderModel from "../../model/order.model";
import PaymentModel from "../../model/payment.model";
import { getCartProductsFromIds } from "../cart/getall.cart.controller";
import _ from "lodash";

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
    const cartWithIds = await cartModel.findOne({ userId: userUniqueIdentity });
    if (!cartWithIds || !cartWithIds.product.length)
      return res
        .status(400)
        .send({ message: "something went wrong", type: "error" });

    const { filteredArray } = await getCartProductsFromIds(cartWithIds.product);
    if (!filteredArray || !filteredArray.length)
      return res
        .status(400)
        .send({ message: "something went wrong", type: "error" });

    // loop through cart
    const orders = Promise.all(
      filteredArray.map(async (prod) => {
        if (!prod) return;
        const combination =
          prod.product?.varients?.variations.find(
            (variation) =>
              JSON.stringify(variation.combinationString) ===
              JSON.stringify(prod.variant)
          )! || prod.product?.varients?.variations[0]!;

        const varient = {
          price: combination.price,
          discount: combination.discount,
          variations: _.omit(combination, [
            "price",
            "discount",
            "combinationString",
            "quantity",
          ]),
        };
        const orderItem = new orderModel({
          orderId,
          userId: userUniqueIdentity,
          product: {
            id: prod.product?._id,
            slug: prod.product?.slug,
            name: prod.product?.name,
            brand_name: prod.product?.brand_name,
            images: prod.product?.images,
            gst_percent: prod.product?.gst_percent,
            quantity: prod.quantity,
            varient,
          },
          deliveryInfo: {
            status: "Pending",
            date: new Date(),
          },
          cancellationInfo: {
            isCancelled: false,
            Amount_refunded: false,
          },

          returnInfo: {
            isReturned: false,
            Amount_refunded: false,
            status: "Pending",
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
    cartWithIds.product = [];
    await cartWithIds.save();

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
