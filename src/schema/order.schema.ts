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
  SubTotal: z.number(),
  discount: z.number().nullish(),
  gst: z.number().nullish(),
  Amount: z.number(),
});

export const adminUpdateOrder = z.object({
  deliveryStatus: z
    .enum(["Pending", "Confirmed", "Out for deivery", "Delivered"])
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
