import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import PaymentModel from "../../model/payment.model";
import { TokenPayload } from "../../utils/jwt.utils";
import { PaymentDocument } from "../../model/payment.model";
const handleUpdatePayStatus = async (
  req: Request<
    {},
    {},
    TokenPayload,
    { id: string; status: "Success" | "Pending" }
  >,
  res: Response
) => {
  const id = req.query.id;
  const status = req.query.status;
  try {
    const payment: PaymentDocument | null = await PaymentModel.findById(id);
    if (!payment) {
      res.status(500).send({ message: "something went wrong", type: "error" });
    } else {
      payment.paymentInfo[0].order_status = status;
      await payment.save();
      return res.status(200).json({
        type: "success",
        message: "Payment Status updated successfully",
      });
    }
  } catch (err) {
    logger.error("get all orders error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default handleUpdatePayStatus;
