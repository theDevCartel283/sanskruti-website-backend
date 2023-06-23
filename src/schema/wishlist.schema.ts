import { z } from "zod";

export const wishlistDetails = z.object({
  productId: z.string({
    required_error: "email is not defined",
  }),
});

export type ReqWishlistObject = z.infer<typeof wishlistDetails>;
