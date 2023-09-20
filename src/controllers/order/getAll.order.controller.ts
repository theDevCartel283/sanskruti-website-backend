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
      const latestOrder = payment?.paymentInfo.sort((a, b) => {
        const dataB = new Date(b.trans_date || "").getTime();
        const dataA = new Date(a.trans_date || "").getTime();
        return dataB - dataA;
      })[0];
      return {
        order,
        payment: {
          ...payment,
          paymentInfo: latestOrder,
        },
      };
    });
    const orderCount = orders.length;

    return res.status(200).json({
      orders,
      orderCount,
    });
  } catch (err) {
    logger.error("get all orders error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default handleGetAllOrders;
