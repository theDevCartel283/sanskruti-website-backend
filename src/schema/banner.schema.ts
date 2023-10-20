import { z } from "zod";

export const bannerInfo = z.object({
  isPublished: z.string(),
  desktopImage: z.string({ required_error: "image feild is empty" }),
  mobileImage: z.string({ required_error: "image feild is empty" }),
  bannerLink: z.string(),
  desktopImageName: z.string({ required_error: "image feild is empty" }),
  mobileImageName: z.string({ required_error: "image feild is empty" }),
});

export type ReqBannerObject = z.infer<typeof bannerInfo>;
