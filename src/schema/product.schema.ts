import { ZodObject, object, z } from "zod";
import { userEmailPwd } from "./user.schema";
import { ObjectId } from "bson";

// schemas

export const nameObject = z.object({
  name: z.string({
    required_error: "product name is required",
  }),
});

export const ProductObject = z.object({
  description: z.string({
    required_error: "product description is required",
  }),
  gst_percent: z.number({ required_error: "gst price is not defined" }),
  MainCategory: z.string({ required_error: "main category not defined" }),
  SubCategory: z.string({ required_error: "sub category not defined" }),
  brand_name: z.string({ required_error: "brand name is  not defined" }),
  is_featured: z.boolean({
    required_error: "this product featured product or not ? (true/false) ",
  }),
  is_new_arrival: z.boolean({
    required_error: "Is this product a new arrival product ? (true/false) ",
  }),
  is_best_seller: z.boolean({
    required_error: "bestseller product ? (true/false) ",
  }),
  stylesAndTips: z.string(),
  meta_tittle: z.string({ required_error: "meta tittle is not defined" }),
  meta_description: z.string({
    required_error: "meta description is not defined",
  }),
  meta_keyword: z.string({ required_error: "meta keyword is not defined" }),
  images: z.array(
    z.object({
      image: z.string(),
      imageName: z.string().nullish(),
    })
  ),
  varients: z.object({}),
});

export const varientObject = z.object({
  size: z.string({ required_error: "size is not defined" }),
  color: z.string({ required_error: "color is not defined" }),
  stock: z.number({ required_error: "stock is not defined" }),
  price: z.number({ required_error: "price is not defined" }),
});

export const filters = z.object({
  MainCategory: z
    .string({ required_error: "main category not defined" })
    .nullish(),
  SubCategory: z
    .string({ required_error: "sub category not defined" })
    .nullish(),
  page: z.number().nullish(),
});

const newProductObject = ProductObject.merge(userEmailPwd);
const ProductObjectWithName = newProductObject.merge(nameObject);
const updatedProductObject = ProductObjectWithName.merge(varientObject);

// types
export type ReqProductObject = z.infer<typeof ProductObject>;
export type RequpdatedProductObject = z.infer<typeof updatedProductObject>;
export type ReqProductObjectWithName = z.infer<typeof ProductObjectWithName>;
export type ReqFilters = z.infer<typeof filters>;
