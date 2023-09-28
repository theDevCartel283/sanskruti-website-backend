import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { getPayZappCredentials } from "../config/payzapp.config.controller";
import { env } from "../../config/env";
import crypto from "crypto";
import { encrypt } from "../CCAV/utils/ccav.utils";
import PaymentModel from "../../model/payment.model";
import { checkIfPending } from "./create.order.controller";
import { v4 as uuid } from "uuid";

const handleRepay = async (
  req: Request<{}, {}, { orderId: string }>,
  res: Response
) => {
  try {
    const payment = await PaymentModel.findOne({ orderId: req.body.orderId });
    if (!payment)
      return res.status(400).send({
        message: "order doesn't exist",
        type: "error",
      });

    const { billingAddress, shippingAddress, orderId, orderInfo, secret } =
      payment;
    const { Amount } = orderInfo;
    const tracking_id = uuid();
    payment.paymentInfo.push({
      amount: Amount,
      currency: "INR",
      order_status: "Pending",
      trans_date: new Date().toString(),
      tracking_id,
    });
    await payment.save();

    const { merchant_id, access_code, working_key } =
      await getPayZappCredentials();

    const redirect_url = `${env.ENDPOINT}/api/v1/ccavResponseHandler/payment`;
    const cancel_url = `${env.ENDPOINT}/api/v1/ccavResponseHandler/cancel`;

    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash("md5").update(working_key).digest();
    var keyBase64 = Buffer.from(md5).toString("base64");

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");

    const billingAddressQuery = `billing_name=${billingAddress.name}&billing_address=${billingAddress.address}&billing_city=${billingAddress.city}&billing_state=${billingAddress.state}&billing_zip=${billingAddress.zip}&billing_country=${billingAddress.country}&billing_tel=${billingAddress.tel}&billing_email=${billingAddress.email}`;
    const ShippingAddressQuery = `delivery_name=${shippingAddress.name}&delivery_address=${shippingAddress.address}&delivery_city=${shippingAddress.city}&delivery_state=${shippingAddress.state}&delivery_zip=${shippingAddress.zip}&delivery_country=${shippingAddress.country}&delivery_tel=${shippingAddress.tel}`;
    const merchantParams = `merchant_param1=${secret}&merchant_param2=${tracking_id}`;
    const encString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=INR&amount=${Amount}&redirect_url=${redirect_url}&cancel_url=${cancel_url}&${billingAddressQuery}&${ShippingAddressQuery}&${merchantParams}`;
    const encRequest = encrypt(encString, keyBase64, ivBase64);

    checkIfPending(orderId, tracking_id);

    return res.status(200).json({
      link: `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${access_code}`,
    });
  } catch (err) {
    logger.error("handle repay error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export default handleRepay;
