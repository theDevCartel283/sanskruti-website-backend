import { z } from "zod";
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
  gst_price: z.number({ required_error: "gst price is not defined" }),
  sale_price: z.number({ required_error: "sale price is not defined" }),
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
  meta_tittle: z.string({ required_error: "meta tittle is not defined" }),
  meta_description: z.string({
    required_error: "meta description is not defined",
  }),
  meta_keyword: z.string({ required_error: "meta keyword is not defined" }),
});

export const varientObject = z.object({
  size: z.string({ required_error: "size is not defined" }),
  color: z.string({ required_error: "color is not defined" }),
  stock: z.number({ required_error: "stock is not defined" }),
  price: z.number({ required_error: "price is not defined" }),
});

const newProductObject = ProductObject.merge(userEmailPwd);
const ProductObjectWithName = newProductObject.merge(nameObject);
const updatedProductObject = ProductObjectWithName.merge(varientObject);

// types
export type ReqProductObject = z.infer<typeof ProductObject>;
export type RequpdatedProductObject = z.infer<typeof updatedProductObject>;
export type ReqProductObjectWithName = z.infer<typeof ProductObjectWithName>;
