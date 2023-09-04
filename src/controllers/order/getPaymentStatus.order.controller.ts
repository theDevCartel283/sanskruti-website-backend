import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import PaymentModel from "../../model/payment.model";

const handleGetPaymentStatus = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const payment = await PaymentModel.findOne({ orderId: id });

    if (!payment)
      return res
        .status(404)
        .send({ message: "Order not found", type: "warning" });

    res.status(200).send({
      orderId: payment.orderId,
      status:
        payment.paymentMethod === "PayZapp"
          ? payment.paymentInfo.order_status
          : "Success",
      amount: payment.paymentInfo.amount,
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
