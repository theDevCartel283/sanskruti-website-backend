import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import orderModel from "../../model/order.model";
import logger from "../../utils/logger.utils";
import PaymentModel from "../../model/payment.model";

const GetOrderDetails = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  const id = req.query.id;
  try {
    const orderWithIds = await orderModel.findById(id);
    const payments = await PaymentModel.find();

    if (!orderWithIds || !payments)
      return res
        .status(500)
        .send({ message: "something went wrong", type: "error" });
    const payment = payments.find(
      (pay) => pay.orderId === orderWithIds.orderId
    );
    const latestOrder = payment?.paymentInfo.sort((a, b) => {
      const dataB = new Date(b.trans_date || "").getTime();
      const dataA = new Date(a.trans_date || "").getTime();
      return dataB - dataA;
    })[0];
    const order = {
      order: orderWithIds,
      payment: {
        ...payment,
        paymentInfo: latestOrder,
      },
    };

    return res.status(200).send({ order });
  } catch (err) {
    logger.error("get all orders error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default GetOrderDetails;
