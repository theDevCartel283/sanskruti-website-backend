import { Request, Response } from "express";
import { ReqAdminUpdateOrder } from "../../schema/order.schema";
import logger from "../../utils/logger.utils";
import orderModel from "../../model/order.model";

const handleUpdateOrderFromAdmin = async (
  req: Request<{}, {}, ReqAdminUpdateOrder, { id: string }>,
  res: Response
) => {
  const {
    cancelRefundStatus,
    deliveryStatus,
    returnRefundStatus,
    returnStatus,
  } = req.body;

  try {
    const order = await orderModel.findById(req.query.id);

    if (!order)
      return res.status(500).send({
        message: "something went wrong",
        type: "error",
      });

    if (deliveryStatus) {
      order.deliveryInfo.status = deliveryStatus;
    }
    if (returnStatus) {
      order.returnInfo.status = returnStatus;
    }
    if (cancelRefundStatus !== undefined && cancelRefundStatus !== null) {
      order.cancellationInfo.Amount_refunded = cancelRefundStatus;
    }
    if (returnRefundStatus !== undefined && returnRefundStatus !== null) {
      order.returnInfo.Amount_refunded = returnRefundStatus;
    }

    await order.save();
    return res.status(200).send({
      message: "order updated successfully",
      type: "success",
    });
  } catch (err) {
    logger.error("handle admin update error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleUpdateOrderFromAdmin;
