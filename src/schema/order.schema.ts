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

export type ReqOrderDetails = z.infer<typeof orderDetails>;
