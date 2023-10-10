import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { TokenPayload } from "../../utils/jwt.utils";
import orderModel, { Order } from "../../model/order.model";
import ProductModel from "../../model/product.model";
import { string } from "zod";

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
      if (order.deliveryInfo.status === "Out for delivery") {
        return res.status(200).send({
          message: "Product is out for delivery",
          type: "info",
          content:
            "Once product is out for delivery it is not cancellable. check our cancelation policy for more details.",
          order,
        });
      }

      const { message, type } = await addProductQuantityBack(order);
      if (message && type)
        return res.status(400).send({ message, type, order });

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
      const { message, type } = await addProductQuantityBack(order);
      if (message && type)
        return res.status(400).send({ message, type, order });

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
          type: "info",
          content:
            "Once return is out for pickup it is not cancellable. check our return policy for more details.",
          order,
        });
      }

      const { message, type } = await removeProductQuantity(order);
      if (message && type)
        return res.status(400).send({ message, type, order });

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

export const addProductQuantityBack = async (order: Order) => {
  const product = await ProductModel.findById(order.product.id);

  if (!product)
    return {
      message: "something went wrong",
      type: "error",
    };

  const variant = Object.values(order.product.varient.variations).filter(
    (item) => item
  ) as string[];
  product.varients = {
    attributes: product.varients.attributes,
    variations: product.varients.variations.map((varie) => {
      if (JSON.stringify(varie.combinationString) === JSON.stringify(variant)) {
        varie.quantity = varie.quantity + order.product.quantity;
      }
      return varie;
    }),
  };
  await product.save();
  return {};
};

export const removeProductQuantity = async (order: Order) => {
  const product = await ProductModel.findById(order.product.id);

  if (!product)
    return {
      message: "something went wrong",
      type: "error",
    };

  const variant = Object.values(order.product.varient.variations).filter(
    (item) => item
  ) as string[];
  product.varients = {
    attributes: product.varients.attributes,
    variations: product.varients.variations.map((varie) => {
      if (JSON.stringify(varie.combinationString) === JSON.stringify(variant)) {
        varie.quantity = varie.quantity - order.product.quantity;
      }
      return varie;
    }),
  };
  await product.save();
  return {};
};
