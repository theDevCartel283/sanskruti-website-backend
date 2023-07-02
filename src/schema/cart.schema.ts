import { z } from "zod";

export const cartDetails = z.object({
  productId: z.string({ required_error: "id missing" }),
  variant: z.string().array(),
  quantity: z.number(),
});

export type ReqCartObject = z.infer<typeof cartDetails>;
