import {z} from 'zod';

export const wishlistDetails=z.object({
    email: z
    .string({
      required_error: 'email is not defined',
    })
    .email(),
    name:z.string({required_error:"name of product is not defined"}),
    price:z.number({required_error:"price is not defined"})

});

export type ReqWishlistObject=z.infer<typeof wishlistDetails >;

