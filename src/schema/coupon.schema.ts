import dayjs from "dayjs";
import { z } from "zod";

export const couponDetails = z.object({
  code: z.string().refine((code) => code.length <= 6),
  type: z.union([z.literal("oneTime"), z.literal("multiple")]),
  discountType: z.union([z.literal("percentage"), z.literal("price")]),
  value: z.number(),
  minPurchase: z.number(),
  expirationDate: z.string().refine((value) => dayjs(value).isValid(), {
    message: "Invalid date format",
  }),
});

export type ReqCouponObject = z.infer<typeof couponDetails>;
