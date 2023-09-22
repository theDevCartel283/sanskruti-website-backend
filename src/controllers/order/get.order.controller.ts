import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import logger from "../../utils/logger.utils";
import orderModel from "../../model/order.model";
import PaymentModel from "../../model/payment.model";

const handleGetOrder = async (
  req: Request<{ id: string }, {}, TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity } = req.body;
  const { id } = req.params;

  try {
    const order = await orderModel.findById(id);

    if (!order)
      return res
        .status(200)
        .send({ message: "product not found", type: "error" });

    const payment = await PaymentModel.findOne({
      userId: userUniqueIdentity,
      orderId: order.orderId,
    });

    const allOrders = await orderModel.find({ orderId: order.orderId });

    if (!payment || !allOrders)
      return res
        .status(200)
        .send({ message: "product not found", type: "error" });
    const latestOrder = payment?.paymentInfo.sort((a, b) => {
      const dataB = new Date(b.trans_date || "").getTime();
      const dataA = new Date(a.trans_date || "").getTime();
      return dataB - dataA;
    })[0];

    return res.status(200).send({
      order: {
        order,
        payment: {
          ...payment.toJSON(),
          paymentInfo: latestOrder || {
            order_status: "Pending",
          },
        },
      },
      allOrders,
    });
  } catch (err) {
    logger.error("get order error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default handleGetOrder;
