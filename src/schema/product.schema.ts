import { z } from 'zod';

// schemas
export const ProductObject = z.object({
  productId: z.string({
    required_error: 'product Id is required',
  }),
  name: z.string({
    required_error: 'product name is required',
  }),
  brandName: z.string({
    required_error: 'product brand name is required',
  }),
});

// types
export type ReqProductObject = z.infer<typeof ProductObject>;
