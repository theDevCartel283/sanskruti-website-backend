import { z } from "zod";

export const cartDetails = z.object({
  productId: z.string({ required_error: "id missing" }),
  variant: z.string().array(),
  quantity: z.number(),
});

export const delCart = z.object({
  productId: z.string({ required_error: "id missing" }),
  variant: z.string(),
});

export const updateCart = z.object({
  productId: z.string({ required_error: "id missing" }),
  oldVariant: z.string().array(),
  newVariant: z.string().array(),
});

export type ReqCartObject = z.infer<typeof cartDetails>;
export type ReqDelCart = z.infer<typeof delCart>;
export type ReqUpdateCart = z.infer<typeof updateCart>;
