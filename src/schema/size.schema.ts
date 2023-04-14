import {ZodError, z} from 'zod';

export const sizeDetails=z.object({
    size:z.string({required_error:"size is not defined"}).max(3,"not more than 3 char")
});

export type ReqSizeObject=z.infer<typeof sizeDetails>;