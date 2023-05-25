import { TypeOf, object, z } from "zod";

export const varientDetails = z.object({
  varientName: z.string({ required_error: "define name " }),
});

export const varientValues = z.object({
  value: z.array(z.string()),
});

export const varientArray = z.object({
  arr: z.array(z.object({})),
});

export const allVarientDetails = varientDetails.merge(varientValues);

export type ReqVarientObject = z.infer<typeof varientDetails>;
export type ReqAllVarientObject = z.infer<typeof allVarientDetails>;
export type ReqVarientArray = z.infer<typeof varientArray>;
