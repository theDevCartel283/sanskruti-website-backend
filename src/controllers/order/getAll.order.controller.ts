import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import orderModel from "../../model/order.model";
import logger from "../../utils/logger.utils";
import PaymentModel from "../../model/payment.model";
import ProductModel from "../../model/product.model";
import { Types } from "mongoose";

const handleGetAllOrders = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity } = req.body;

  try {
    const orderWithIds = await orderModel
      .find({ userId: userUniqueIdentity })
      .lean();
    const payments = await PaymentModel.find({ userId: userUniqueIdentity });

    if (!orderWithIds || !payments)
      return res
        .status(500)
        .send({ message: "something went wrong", type: "error" });

    const orders = await Promise.all(
      orderWithIds.map(async (order) => {
        const product = await ProductModel.findById(order.product?.id);
        return {
          ...order,
          product: {
            product,
            quantity: order.product?.quantity,
            varient: order.product?.varient,
          },
        };
      })
    );

    const groupedData: {
      orders: typeof orders;
      payment: (typeof payments)[0];
    }[] = [];
    payments.map((payment) => {
      groupedData.push({
        orders: [],
        payment,
      });
    });
    orders.map((order) => {
      const orderGroup = groupedData.find(
        (data) => data.payment.orderId == order.orderId
      );
      // console.log(orderGroup);
      if (!orderGroup) return;
      orderGroup.orders.push(order);
    });

    return res.status(200).send({ orders: groupedData });
  } catch (err) {
    logger.error("get all orders error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default handleGetAllOrders;
