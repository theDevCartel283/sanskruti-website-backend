import { z } from "zod";

export const subCategoryDetails = z.object({
  Title: z.string({
    required_error: "title is not defined  ",
  }),
  Category: z.string({
    required_error: "Category is not defined",
  }),
  Slug: z.string({
    required_error: "slug is not defined ",
  }),
  Meta_Title: z.string({
    required_error: "meta_title is not defined ",
  }),
  Meta_Description: z.string({
    required_error: "meta_description is not defined",
  }),
});

export type ReqSubCategoryObject = z.infer<typeof subCategoryDetails>;
