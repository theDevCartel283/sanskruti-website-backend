import { z } from "zod";

export const markdownDetails = z.object({
  status: z.string().nullish(),
  returnPolicy: z.string().nullish(),
  termsAndConditions: z.string().nullish(),
  privacyPolicy: z.string().nullish(),
});
export type ReqMarkdownObject = z.infer<typeof markdownDetails>;
