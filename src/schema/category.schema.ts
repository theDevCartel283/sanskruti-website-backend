import { z } from 'zod';

export const categoryDetails = z.object({
    name: z.string({
        required_error: 'define name '
    }),
    subCategory: z.string({ required_error: "subcategory not defined " })
});

export type ReqCategoryObject = z.infer<typeof categoryDetails>;


