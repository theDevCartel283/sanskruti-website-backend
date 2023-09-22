import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import PaymentModel from "../../model/payment.model";

const handleGetPaymentStatus = async (
  req: Request<{}, {}, {}, { orderId: string }>,
  res: Response
) => {
  try {
    const { orderId } = req.query;

    const payment = await PaymentModel.findOne({
      orderId: orderId,
    });

    if (!payment)
      return res
        .status(404)
        .send({ message: "Order not found", type: "warning" });

    const order = payment.paymentInfo.sort((a, b) => {
      const dataB = new Date(b.trans_date || "").getTime();
      const dataA = new Date(a.trans_date || "").getTime();
      console.log(a.trans_date, b.trans_date);
      return dataB - dataA;
    })[0];

    res.status(200).send({
      orderId: payment.orderId,
      status:
        payment.paymentMethod === "PayZapp" ? order.order_status : "Success",
      amount: order.amount,
    });
  } catch (err) {
    logger.error("get status error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export default handleGetPaymentStatus;
