import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import PaymentModel from "../../model/payment.model";

const handleGetPaymentStatus = async (
  req: Request<{}, {}, {}, { orderId: string; tracking_id: string }>,
  res: Response
) => {
  try {
    const { orderId, tracking_id } = req.query;

    const payment = await PaymentModel.findOne({
      orderId: orderId,
    });

    if (!payment)
      return res
        .status(404)
        .send({ message: "Order not found", type: "warning" });

    const order = payment.paymentInfo.find(
      (payment) => payment.tracking_id === tracking_id
    );

    res.status(200).send({
      orderId: payment.orderId,
      status:
        payment.paymentMethod === "PayZapp" ? order?.order_status : "Success",
      amount: order?.amount,
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
