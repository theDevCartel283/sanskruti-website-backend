import { Request, Response } from "express";
import { decrypt } from "./utils/ccav.utils";
import crypto from "crypto";
import z from "zod";
import PaymentModel from "../../model/payment.model";
import logger from "../../utils/logger.utils";
import orderModel from "../../model/order.model";
import cartModel from "../../model/cart.model";
import ProductModel from "../../model/product.model";
import { getPayZappCredentials } from "../config/payzapp.config.controller";
import { getValidDate } from "../../utils/getValidDate";
import UserModel from "../../model/user.model";
import { getOrderFormat } from "../../utils/email/orderFormat";
import sendEmail from "../../utils/email/sendEmail";

const resultSchema = z.object({
  order_id: z.string(),
  tracking_id: z.string(),
  bank_ref_no: z.string().nullish(),
  order_status: z.enum(["Success", "Failure", "Aborted", "Invalid", "Timeout"]),

  payment_mode: z.string().nullish(),
  card_name: z.string().nullish(),

  currency: z.string(),
  amount: z.string().refine((number) => !Number.isNaN(Number(number))),
  trans_date: z.string().nullish(),

  failure_message: z.string().nullish(),

  merchant_param1: z.string().nullish(),
  merchant_param2: z.string().nullish(),
});

const getObject = async (query: string) => {
  const params = new URLSearchParams(query);
  const result: any = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  try {
    const testResult = resultSchema.parse(result);
    return testResult;
  } catch (err) {
    return undefined;
  }
};

const handleCCAVResponse = async (
  req: Request<
    {},
    {},
    { encResp: string; orderNo: string; crossSellUrl: string }
  >,
  res: Response
) => {
  const { encResp, orderNo, crossSellUrl } = req.body;

  const { working_key } = await getPayZappCredentials();
  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(working_key).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  const result = await getObject(decrypt(encResp, keyBase64, ivBase64));
  if (
    !result ||
    !result.bank_ref_no ||
    !result.card_name ||
    !result.payment_mode ||
    !result.trans_date
  ) {
    logger.error("ccva enc responce err result: " + JSON.stringify(result));
    return res
      .status(500)
      .redirect(`https://sanskrutinx.in/user/order/status?orderId=${orderNo}`);
  }
  try {
    const payment = await PaymentModel.findOne({ orderId: result.order_id });
    const orders = await orderModel.find({ orderId: result.order_id });
    if (!payment || !orders) {
      logger.error(
        "ccva enc responce payment or orders not found not found for order_id:" +
          result.order_id
      );
      return res
        .status(500)
        .redirect(
          `https://sanskrutinx.in/user/order/status?orderId=${orderNo}&tracking_id=${result.tracking_id}`
        );
    }
    if (result.merchant_param1 !== payment.secret)
      return res
        .status(500)
        .redirect(
          `https://sanskrutinx.in/user/order/status?orderId=${orderNo}&tracking_id=${result.tracking_id}`
        );

    const user = await UserModel.findById(payment.userId);
    if (!user) {
      logger.error("user not found for order id: " + result.order_id);
      return res
        .status(500)
        .redirect(
          `https://sanskrutinx.in/user/order/status?orderId=${orderNo}&tracking_id=${result.tracking_id}`
        );
    }
    const validDate = Number.isNaN(new Date(result.trans_date).getTime())
      ? getValidDate(result.trans_date)
      : result.trans_date;

    payment.paymentInfo.map((pay) => {
      if (pay.tracking_id === result.merchant_param2) {
        if (Number(pay.amount?.toString()) !== Number(result.amount)) {
          pay.order_status = "Failure";
          pay.errStack?.push(
            `recieved amount ${result.amount} does match database amount ${pay.amount}`
          );
        } else {
          pay.amount = Number(result.amount);
          pay.order_status = result.order_status;
        }
        result.failure_message && pay.errStack?.push(result.failure_message);
        pay.bank_ref_no = result.bank_ref_no!;
        pay.card_name = result.card_name!;
        pay.currency = result.currency;
        pay.payment_mode = result.payment_mode!;
        pay.tracking_id = result.tracking_id;
        pay.trans_date = validDate;
      }
    });

    await payment.save();
    if (result.order_status == "Success") {
      const productsArray = orders.map(({ product }) => {
        const variants = product.varient?.variations;
        const values = Object.values(variants) as string[];
        const variation = Object.keys(variants)
          .map((key, index) => ({ key, value: values[index] }))
          .filter((val) => !!val.value && !!val.key);
        return {
          image: product.images[0],
          name: product.name,
          quantity: product.quantity,
          price: product.varient.price,
          variation,
        };
      });
      sendEmail({
        email: user.email!,
        subject: "Order Placed",
        message: getOrderFormat({
          username: user.username!,
          orderId: payment.orderId,
          date: payment.orderInfo.Date,
          SubTotal: payment.orderInfo.SubTotal,
          discount: payment.orderInfo.Totaldiscount || 0,
          TotalAmount: payment.orderInfo.Amount,
          paymentMethod: payment.paymentMethod,
          products: productsArray,
          shippingAddress: payment.shippingAddress,
          billingAddress: payment.billingAddress,
          bankDetails: {
            amount: result.amount,
            payment_mode: result.payment_mode,
            card_name: result.card_name,
            bank_ref_no: result.bank_ref_no,
            currency: result.currency,
          },
        }),
      });
      return res
        .status(200)
        .redirect(
          `https://sanskrutinx.in/user/order/status?orderId=${orderNo}&tracking_id=${result.tracking_id}`
        );
    } else {
      const orders = await orderModel.find({ orderId: orderNo });

      const cart = await cartModel.findOne({ userId: orders[0].userId });

      await Promise.all(
        orders.map(async (order) => {
          const product = await ProductModel.findOne({ _id: order.product.id });
          const variant = Object.values(
            order.product.varient.variations
          ).filter((item) => item);
          product?.varients.variations.map((varie) => {
            if (
              JSON.stringify(varie.combinationString) ===
              JSON.stringify(variant)
            ) {
              varie.quantity += order.product.quantity;
            }
          });
          product?.save();
          cart?.product.push({
            productId: product?._id,
            quantity: order.product.quantity,
            variant,
          });
        })
      );
      await cart?.save();

      return res
        .status(200)
        .redirect(
          `https://sanskrutinx.in/user/order/status?orderId=${orderNo}&tracking_id=${result.tracking_id}`
        );
    }
  } catch (err) {
    logger.error("ccav response error " + err);
    return res
      .status(500)
      .redirect(
        `https://sanskrutinx.in/user/order/status?orderId=${orderNo}&tracking_id=${result.tracking_id}`
      );
  }
};

export default handleCCAVResponse;
