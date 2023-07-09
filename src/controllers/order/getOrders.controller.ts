import { Request, Response } from "express";
import orderModel from "../../model/order.model";
import PaymentModel from "../../model/payment.model";
import ApiFeatures from "../../utils/apiFeatures.utils";
import logger from "../../utils/logger.utils";

const getOrder = async (req: Request, res: Response) => {
  try {
    const orderWithIds = await orderModel.find();
    const payments = await PaymentModel.find();

    if (!orderWithIds || !payments)
      return res
        .status(500)
        .send({ message: "something went wrong", type: "error" });

    const orders = orderWithIds.map((order) => {
      const payment = payments.find((pay) => pay.orderId === order.orderId);
      return {
        order,
        payment,
      };
    });

    return res.status(200).send({ orders });
  } catch (err) {
    logger.error("get all orders error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default getOrder;
