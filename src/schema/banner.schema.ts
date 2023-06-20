import { z } from "zod";

export const bannerInfo = z.object({
  type: z.string({ required_error: "type missing" }),
  isPublished: z.string(),
  image: z.string({ required_error: "image feild is empty" }),
});

export type ReqBannerObject = z.infer<typeof bannerInfo>;
