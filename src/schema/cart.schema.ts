import { z } from "zod";

export const emailName = z.object({
  email: z.string({ required_error: "email is not defined" }),
  name: z.string({ required_error: "name is not defined" }),
});

export const cartInfo = z.object({
  id: z.string({ required_error: "id missing" }),
  color: z.string({ required_error: "color is not defined" }),
  size: z.string({ required_error: "size is not defined" }),
  price: z.number({ required_error: "price ?" }),
  quantity: z.number({ required_error: "quantity is not defined" }),
  gst_price: z.number({ required_error: "gst price is not defined" }),
  sale_price: z.number({ required_error: "sale price is not defined" }),
});

export const cartDetails = emailName.merge(cartInfo);
export type ReqEmailName = z.infer<typeof emailName>;
export type ReqCartObject = z.infer<typeof cartDetails>;
