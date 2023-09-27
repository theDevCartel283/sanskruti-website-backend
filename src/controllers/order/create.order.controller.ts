import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { ReqOrderDetails } from "../../schema/order.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import cartModel from "../../model/cart.model";
import { v4 as uuid } from "uuid";
import orderModel from "../../model/order.model";
import PaymentModel, { CCAveneueResponse } from "../../model/payment.model";
import { getCartProductsFromIds } from "../cart/getall.cart.controller";
import _ from "lodash";
import crypto from "crypto";
import { env } from "../../config/env";
import { decrypt, encrypt } from "../CCAV/utils/ccav.utils";
import couponModel from "../../model/coupon.model";
import { dateFormater } from "../../utils/dateFormater";
import sendEmail from "../../utils/email/sendEmail";
import UserModel from "../../model/user.model";
import { getOrderFormat } from "../../utils/email/orderFormat";
import { getPayZappCredentials } from "../config/payzapp.config.controller";
import { getAmounts } from "../../utils/getAmount";
import axios from "axios";
import { getValidDate } from "../../utils/getValidDate";
import ProductModel from "../../model/product.model";

const handlePlaceOrder = async (
  req: Request<{}, {}, TokenPayload & ReqOrderDetails>,
  res: Response
) => {
  const {
    userUniqueIdentity,
    paymentMethod,
    shippingAddress,
    billingAddress,
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
        (product) =>
          !emptyArray.find(
            (emp) =>
              product.productId === emp.productId &&
              JSON.stringify(product.variant) === JSON.stringify(emp.variant)
          )
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

      if (coupon.minPurchase > total) {
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
          message: "Coupon is used",
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
    // error
    const errMessage: string[] = [];

    // loop through cart
    const orders = await Promise.all(
      filteredArray.map(async (prod) => {
        const foundProd = await ProductModel.findById(prod.product.id);
        if (!foundProd) {
          errMessage.push(`product ${prod.product.name} not found`);
          return;
        }
        const combination =
          foundProd?.varients?.variations.find(
            (variation) =>
              JSON.stringify(variation.combinationString) ===
              JSON.stringify(prod.variant)
          )! || foundProd?.varients?.variations[0]!;

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
            id: foundProd?._id,
            slug: foundProd?.slug,
            name: foundProd?.name,
            brand_name: foundProd?.brand_name,
            images: [foundProd?.images[0]],
            gst_percent: foundProd?.gst_percent,
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

        foundProd.varients.variations.map((varie) => {
          if (
            JSON.stringify(varie.combinationString) ===
            JSON.stringify(combination.combinationString)
          ) {
            if (varie.quantity - prod.quantity < 0) {
              errMessage.push(`product ${foundProd.name} out of stock`);
            }
          }
        });
        return { orderItem, combination };
      })
    );

    // check for err
    if (!!errMessage.length) {
      return res.status(400).send({
        message: "Failure",
        content: errMessage.join(", "),
        type: "error",
      });
    } else {
      await Promise.all(
        orders.map(async (or) => {
          if (!or) return false;
          await or.orderItem.save();
          const foundProd = await ProductModel.findById(
            or.orderItem.product.id
          );
          foundProd?.varients.variations.map((varie) => {
            if (
              JSON.stringify(varie.combinationString) ===
              JSON.stringify(or.combination.combinationString)
            ) {
              varie.quantity -= or.orderItem.product.quantity;
              console.log(varie.quantity);
            }
          });
          console.log(JSON.stringify(foundProd?.varients.variations));
          await foundProd?.save();
          return true;
        })
      );
    }

    // payment
    const date = new Date();
    const secret = uuid();
    const tracking_id = uuid();
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
      secret,
      paymentInfo: [
        {
          amount: finalValue,
          currency: "INR",
          order_status: "Pending",
          trans_date: new Date().toString(),
          tracking_id,
        },
      ],
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
      const merchantParams = `merchant_param1=${secret}&merchant_param2=${tracking_id}`;
      const encString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=INR&amount=${finalValue}&redirect_url=${redirect_url}&cancel_url=${cancel_url}&${billingAddressQuery}&${ShippingAddressQuery}&${merchantParams}`;
      const encRequest = encrypt(encString, keyBase64, ivBase64);

      checkIfPending(orderId, tracking_id);

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
        tracking_id,
      });
    }
  } catch (err) {
    logger.error("place order error" + err);
    res.status(500).send({ message: "something went wrong", type: "info" });
  }
};

// "Success" | "Failure" | "Aborted" | "Invalid" | "Timeout"

export const checkIfPending = (orderId: string, tracking_id: string) => {
  setTimeout(async () => {
    try {
      console.log("check");
      const payment = await PaymentModel.findOne({ orderId });
      if (!payment) {
        logger.error("payment not found when checking orderId:" + orderId);
        return;
      }

      const findTransaction = payment.paymentInfo.find(
        (trans) => trans.tracking_id === tracking_id
      );
      if (findTransaction && findTransaction.order_status === "Pending") {
        const { working_key, access_code } = await getPayZappCredentials();
        //Generate Md5 hash for the key and then convert in base64 string
        var md5 = crypto.createHash("md5").update(working_key).digest();
        var keyBase64 = Buffer.from(md5).toString("base64");

        //Initializing Vector and then convert in base64 string
        var ivBase64 = Buffer.from([
          0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,
          0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
        ]).toString("base64");
        const encString = JSON.stringify({
          fromDate: "01-01-2023",
          order_no: orderId,
        });
        const encRequest = encrypt(encString, keyBase64, ivBase64);
        axios
          .post(
            `https://apitest.ccavenue.com/apis/servlet/DoWebTrans?enc_request=${encRequest}&access_code=${access_code}&request_type=JSON&command=orderLookup&version=1.2`
          )
          .then(async (res) => {
            const response = new URLSearchParams(String(res.data)).get(
              "enc_response"
            ) as string;
            const value = JSON.parse(
              decrypt(response, keyBase64, ivBase64)
            ) as {
              order_Status_List: CCAveneueResponse[];
              total_records: number;
            };
            if (!value.total_records || !value.order_Status_List.length) {
              payment.paymentInfo.map((val) =>
                val.tracking_id === tracking_id
                  ? (val.order_status = "Timeout")
                  : val
              );
              await payment.save();
              return;
            }

            const findTransInVal = value.order_Status_List.find(
              (trans) => trans.merchant_param2 === tracking_id
            );
            if (!findTransInVal) {
              payment.paymentInfo.map((val) =>
                val.tracking_id === tracking_id
                  ? (val.order_status = "Timeout")
                  : val
              );
              await payment.save();
              return;
            }
            if (findTransInVal.order_amt != findTransaction.amount) {
              findTransaction.tracking_id =
                findTransInVal.reference_no.toString();
              findTransaction.bank_ref_no = findTransInVal.order_bank_ref_no;
              findTransaction.card_name = findTransInVal.order_card_name;
              findTransaction.payment_mode = findTransInVal.payment_mode;
              findTransaction.currency = findTransInVal.order_currncy;
              findTransaction.trans_date = Number.isNaN(
                new Date(findTransInVal.order_status_date_time).getTime()
              )
                ? getValidDate(findTransInVal.order_status_date_time)
                : findTransInVal.order_status_date_time;
              findTransaction.order_status = "Failure";
              findTransaction.errStack?.push(
                `recieved amount ${findTransInVal.order_amt} does match database amount ${findTransaction.amount}`
              );
            } else {
              findTransaction.amount = findTransInVal.order_amt;
              findTransaction.tracking_id =
                findTransInVal.reference_no.toString();
              findTransaction.bank_ref_no = findTransInVal.order_bank_ref_no;
              findTransaction.card_name = findTransInVal.order_card_name;
              findTransaction.payment_mode = findTransInVal.payment_mode;
              findTransaction.currency = findTransInVal.order_currncy;
              findTransaction.trans_date = Number.isNaN(
                new Date(findTransInVal.order_status_date_time).getTime()
              )
                ? getValidDate(findTransInVal.order_status_date_time)
                : findTransInVal.order_status_date_time;

              let order_status = "" as
                | "Success"
                | "Failure"
                | "Aborted"
                | "Invalid"
                | "Timeout"
                | "Pending";
              switch (findTransInVal.order_status) {
                case "Shipped":
                  order_status = "Success";
                  break;
                case "Unsuccessful":
                  order_status = "Failure";
                  break;
                case "Aborted":
                  order_status = "Aborted";
                  break;
                case "Invalid":
                  order_status = "Invalid";
                  break;
                case "Initiated":
                  order_status = "Timeout";
                  break;
                default:
                  order_status = findTransInVal.order_status;
              }
              findTransaction.order_status = order_status;
            }
          });
        await payment.save();
      }
    } catch (err) {
      logger.error("check payment for order " + orderId + " \nerror " + err);
    }
  }, 20 * 60 * 1000);
  return;
};

export default handlePlaceOrder;
