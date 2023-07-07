import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import orderModel from "../../model/order.model";
import logger from "../../utils/logger.utils";
import PaymentModel from "../../model/payment.model";

const handleGetAllOrders = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity } = req.body;

  try {
    const orderWithIds = await orderModel.find({ userId: userUniqueIdentity });
    const payments = await PaymentModel.find({ userId: userUniqueIdentity });

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

export default handleGetAllOrders;
