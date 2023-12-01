import { z } from "zod";

export const contact = z.object({
  name: z.string(),
  email: z.string(),
  tel: z.string(),
  review: z.string(),
});

export type ReqContact = z.infer<typeof contact>;
