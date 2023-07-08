import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { TokenPayload } from "../../utils/jwt.utils";
import orderModel from "../../model/order.model";

const handleCancellationRequest = async (
  req: Request<{ id: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order)
      return res.status(500).send({
        message: "something went wrong",
        type: "error",
      });

    // condition 1: Cancel order
    if (
      order.deliveryInfo?.status !== "Delivered" &&
      !order.cancellationInfo.isCancelled &&
      !order.returnInfo.isReturned
    ) {
      // check if cancelable
      if (order.deliveryInfo.status === "Out for deivery") {
        return res.status(200).send({
          message: "Product is out for delivery",
          type: "success",
          content:
            "Once product is out for delivery it is not cancellable. check our cancelation policy for more details.",
        });
      }

      order.cancellationInfo.isCancelled = true;
      order.cancellationInfo.date = new Date();
      const newOrder = await order.save({ validateBeforeSave: true });
      return res.status(200).send({
        message: "Order cancelled successfully",
        type: "success",
        content:
          "Online payments will be refunded in 5-6 business days. Contact support for any concerns.",
        order: newOrder,
      });
    }

    // condition 2: Return product request
    if (
      order.deliveryInfo?.status === "Delivered" &&
      !order.cancellationInfo.isCancelled &&
      !order.returnInfo.isReturned
    ) {
      order.returnInfo.isReturned = true;
      order.returnInfo.status = "Pending";
      order.returnInfo.date = new Date();
      const newOrder = await order.save({ validateBeforeSave: true });
      return res.status(200).send({
        message: "Requested for product return",
        type: "success",
        content: "Your return request is currently under pending review.",
        order: newOrder,
      });
    }

    // consdition 3: Cancel product return request
    if (
      order.deliveryInfo?.status === "Delivered" &&
      !order.cancellationInfo.isCancelled &&
      order.returnInfo.isReturned
    ) {
      if (
        order.returnInfo.status !== "Pending" &&
        order.returnInfo.status !== "Confirmed"
      ) {
        return res.status(200).send({
          message: "Request is not cancellable",
          type: "success",
          content:
            "Once return is out for pickup it is not cancellable. check our return policy for more details.",
        });
      }

      order.cancellationInfo.isCancelled = true;
      order.cancellationInfo.date = new Date();
      const newOrder = await order.save({ validateBeforeSave: true });
      return res.status(200).send({
        message: "Return request cancelled",
        type: "success",
        content: "Your return request has been successfull cancelled.",
        order: newOrder,
      });
    }

    return res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  } catch (err) {
    logger.error("cancel request error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleCancellationRequest;
