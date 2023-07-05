import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import logger from "../../utils/logger.utils";
import orderModel from "../../model/order.model";
import PaymentModel from "../../model/payment.model";
import ProductModel from "../../model/product.model";

const handleGetOrder = async (
  req: Request<{ orderId: string }, {}, TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity } = req.body;
  const { orderId } = req.params;

  try {
    const orderWithIds = await orderModel
      .find({
        userId: userUniqueIdentity,
        orderId,
      })
      .lean();
    const payment = await PaymentModel.findOne({
      userId: userUniqueIdentity,
      orderId,
    });

    if (!orderWithIds || !payment)
      return res
        .status(200)
        .send({ message: "product not found", type: "error" });

    const orders = await Promise.all(
      orderWithIds.map(async (order) => {
        const product = await ProductModel.findById(order.product?.id);
        return {
          ...order,
          product: {
            product,
            quantity: order.product?.quantity,
            varient: order.product?.varient,
          },
        };
      })
    );

    return res.status(200).send({
      orders,
      payment,
    });
  } catch (err) {
    logger.error("get order error " + err);
    res.status(500).send({ message: "something went wrong", type: "error" });
  }
};

export default handleGetOrder;
