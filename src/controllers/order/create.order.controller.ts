import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { ReqOrderDetails } from "../../schema/order.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import cartModel from "../../model/cart.model";
import { v4 as uuid } from "uuid";
import orderModel from "../../model/order.model";
import PaymentModel from "../../model/payment.model";
import { getCartProductsFromIds } from "../cart/getall.cart.controller";
import _ from "lodash";
import crypto from "crypto";
import { env } from "../../config/env";
import { encrypt } from "../CCAV/utils/ccav.utils";
import couponModel from "../../model/coupon.model";
import { dateFormater } from "../../utils/dateFormater";
import sendEmail from "../../utils/email/sendEmail";
import UserModel from "../../model/user.model";
import { getOrderFormat } from "../../utils/email/orderFormat";
import { getPayZappCredentials } from "../config/payzapp.config.controller";
import { getAmounts } from "../../utils/getAmount";

const handlePlaceOrder = async (
  req: Request<{}, {}, TokenPayload & ReqOrderDetails>,
  res: Response
) => {
  const {
    userUniqueIdentity,
    paymentMethod,
    shippingAddress,
    billingAddress,
    // SubTotal,
    // discount,
    // gst,
    // Amount,
    couponCode,
  } = req.body;
  const orderId = uuid();

  try {
    const user = await UserModel.findById(userUniqueIdentity);
    if (!user || !user.email)
      return res
        .status(400)
        .send({ message: "something went wrong", type: "error" });

    const cartWithIds = await cartModel.findOne({ userId: userUniqueIdentity });
    if (!cartWithIds || !cartWithIds.product.length)
      return res
        .status(400)
        .send({ message: "something went wrong", type: "error" });
    const { filteredArray, emptyArray } = await getCartProductsFromIds(
      cartWithIds.product
    );
    if (!filteredArray || !filteredArray.length)
      return res
        .status(400)
        .send({ message: "something went wrong", type: "error" });

    if (emptyArray && emptyArray.length !== 0) {
      cartWithIds.product = cartWithIds.product.filter(
        (product) => !emptyArray.includes(product.productId)
      );
      await cartWithIds.save();
    }

    // check coupon validity
    let couponDiscount = 0;
    let { finalValue, discount, gst, total } = getAmounts(filteredArray);

    if (couponCode) {
      const coupon = await couponModel.findOne({ code: couponCode });

      if (!coupon)
        return res.status(404).send({
          message: "Coupon doesn't exist",
          type: "info",
        });

      if (coupon.minPurchase > finalValue) {
        return res.status(403).send({
          message: "Cannot avail coupon",
          content: `User must shop for a minimum price of Rs.${coupon.minPurchase} to avail the coupon`,
          type: "info",
        });
      }

      // check used by user
      const couponNotUsedByUser = !coupon.usedBy.includes(
        userUniqueIdentity.toString()
      );
      if (!couponNotUsedByUser) {
        return res.status(403).send({
          message: "Coupon Is Used",
          content: `Coupon has been used by user`,
          type: "info",
        });
      }

      // check expiry
      const todayDate = new Date().getTime();
      const expirationDate = coupon.expirationDate.getTime();
      const couponNotExpired = expirationDate > todayDate;

      if (!couponNotExpired) {
        return res.status(403).send({
          message: "Coupon expired",
          content: `Coupon has expired on ${dateFormater(
            coupon.expirationDate
          )}`,
          type: "info",
        });
      }

      couponDiscount =
        coupon.discountType === "percentage"
          ? Number(((coupon.value * finalValue) / 100).toFixed(2))
          : coupon.value;

      finalValue -= couponDiscount;
      coupon.usedBy.push(userUniqueIdentity.toString());
      await coupon.save();
      if (coupon.type === "oneTime") {
        await coupon.deleteOne({ code: coupon.code });
      }
    }

    // loop through cart
    const orders = Promise.all(
      filteredArray.map(async (prod) => {
        if (!prod) return;
        const combination =
          prod.product?.varients?.variations.find(
            (variation) =>
              JSON.stringify(variation.combinationString) ===
              JSON.stringify(prod.variant)
          )! || prod.product?.varients?.variations[0]!;
        const varient = {
          price: combination.price,
          discount: combination.discount,
          variations: _.omit(combination, [
            "price",
            "discount",
            "combinationString",
            "quantity",
          ]),
        };
        const orderItem = new orderModel({
          orderId,
          userId: userUniqueIdentity,
          product: {
            id: prod.product?._id,
            slug: prod.product?.slug,
            name: prod.product?.name,
            brand_name: prod.product?.brand_name,
            images: [prod.product?.images[0]],
            gst_percent: prod.product?.gst_percent,
            quantity: prod.quantity,
            varient,
          },
          deliveryInfo: {
            status: "Pending",
            date: new Date(),
          },
          cancellationInfo: {
            isCancelled: false,
            Amount_refunded: false,
          },
          returnInfo: {
            isReturned: false,
            Amount_refunded: false,
            status: "Pending",
          },
        });
        return await orderItem.save();
      })
    );
    // payment
    const date = new Date();
    const payment = new PaymentModel({
      userId: userUniqueIdentity,
      orderId,
      // address
      shippingAddress,
      billingAddress,
      paymentMethod,
      orderInfo: {
        Date: date,
        SubTotal: total,
        ShippingCost: 0,
        CouponCode: couponCode,
        CouponDiscount: couponDiscount,
        Totaldiscount: discount,
        TotalGST: gst,
        Amount: finalValue,
      },
      paymentInfo: {
        order_status: "Pending",
      },
    });
    await payment.save();
    // clear cart
    cartWithIds.product = [];
    await cartWithIds.save();

    if (paymentMethod === "PayZapp") {
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
      const encString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=INR&amount=${finalValue}&redirect_url=${redirect_url}&cancel_url=${cancel_url}&${billingAddressQuery}&${ShippingAddressQuery}`;
      const encRequest = encrypt(encString, keyBase64, ivBase64);

      return res.status(200).json({
        link: `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${access_code}`,
      });
    } else {
      const productsArray = filteredArray.map((product) => {
        const combination =
          product.product?.varients?.variations.find(
            (variation) =>
              JSON.stringify(variation.combinationString) ===
              JSON.stringify(product.variant)
          )! || product.product?.varients?.variations[0]!;
        return {
          image: product.product?.images[0],
          name: product.product?.name,
          quantity: product.quantity,
          price: combination.price,
          variation: combination.combinationString,
        };
      });
      sendEmail({
        email: user.email,
        subject: "Order Placed",
        message: getOrderFormat({
          username: user.username!,
          orderId,
          date,
          SubTotal: total,
          discount: discount || 0,
          TotalAmount: finalValue,
          paymentMethod,
          products: productsArray,
          shippingAddress,
          billingAddress,
        }),
      });
      return res.status(200).send({
        message: "Thank you for shopping at sanskrutinx.in",
        type: "success",
        orderId,
      });
    }
  } catch (err) {
    logger.error("place order error" + err);
    res.status(500).send({ message: "something went wrong", type: "info" });
  }
};

export default handlePlaceOrder;
