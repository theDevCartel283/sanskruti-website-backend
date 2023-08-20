import { z } from "zod";

export const categoryDetails = z.object({
  Title: z.string({
    required_error: "title is not defined  ",
  }),
  Meta_Title: z.string({
    required_error: "meta_title is not defined ",
  }),
  Meta_Description: z.string({
    required_error: "meta_description is not defined",
  }),
  Image: z.string({
    required_error: "upload Image",
  }),
  imageName: z.string({
    required_error: "upload Image",
  }),
});

export type ReqCategoryObject = z.infer<typeof categoryDetails>;
