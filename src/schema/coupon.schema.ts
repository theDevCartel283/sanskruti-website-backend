import { z } from "zod";

export const couponDetails = z.object({
  title: z.string({ required_error: "title is missing" }),
  is_published: z.boolean(),
  discount: z.number({ required_error: "discount not defined" }),
  code: z.string({ required_error: "coupon code is not defined" }),
  expiry: z.string({ required_error: "date is not defined" }),
});

export type ReqCouponObject = z.infer<typeof couponDetails>;
