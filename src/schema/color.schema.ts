import {z} from 'zod';

export const colorDetails=z.object({
    name:z.string({
        required_error:"color is not defined"
    })
})
export type ReqColorObject=z.infer<typeof colorDetails >;