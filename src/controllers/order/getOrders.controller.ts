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

    const apiFeatures = new ApiFeatures(
      orderModel.find(),
      req.query
    ).orderFilter(orderWithIds, payments);
    const result = await apiFeatures.query;
    const orders = result.map((order: any) => {
      const payment = payments.find((pay) => pay.orderId === order.orderId);
      return {
        order,
        payment,
      };
    });
    const orderCount = orders.length;
    console.log(orderCount);
    return res.status(200).json({
      orders,
      orderCount,
    });
  } catch (err) {
    logger.error("get all orders error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default getOrder;
