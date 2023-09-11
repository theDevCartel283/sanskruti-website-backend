import z from "zod";
import { addressObject } from "./user.schema";

export const orderDetails = z.object({
  paymentMethod: z.enum(["COD", "PayZapp"]),

  // address
  shippingAddress: addressObject.merge(
    z.object({
      id: z.string(),
    })
  ),
  billingAddress: addressObject.merge(
    z.object({
      id: z.string(),
    })
  ),

  // calculation
  couponCode: z.string().nullish(),
});

export const adminUpdateOrder = z.object({
  deliveryStatus: z
    .enum(["Pending", "Confirmed", "Out for delivery", "Delivered"])
    .nullish(),
  returnStatus: z
    .enum([
      "Pending",
      "Confirmed",
      "Out for pickup",
      "Refund initiated",
      "Refund credited",
    ])
    .nullish(),
  cancelRefundStatus: z.boolean().nullish(),
  returnRefundStatus: z.boolean().nullish(),
});

export type ReqOrderDetails = z.infer<typeof orderDetails>;
export type ReqAdminUpdateOrder = z.infer<typeof adminUpdateOrder>;
