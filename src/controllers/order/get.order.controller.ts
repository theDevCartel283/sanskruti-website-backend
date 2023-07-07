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

    if (!payment)
      return res
        .status(200)
        .send({ message: "product not found", type: "error" });

    return res.status(200).send({
      order,
      payment,
    });
  } catch (err) {
    logger.error("get order error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default handleGetOrder;
