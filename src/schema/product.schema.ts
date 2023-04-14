import { z } from 'zod';
import { userEmailPwd } from './user.schema';
import { ObjectId } from 'bson';


// schemas
export const ProductObject = z.object({
    name: z.string({
        required_error: 'product name is required',
    }),
    description: z.string({
        required_error: 'product brand name is required',
    }),
    size:z.string({required_error:"size is not defined"}),
    color:z.string({required_error:"color is not defined"}),
    stock: z.number({ required_error: "stock is not defined" }),
    price: z.number({ required_error: "price is not defined" }),
    gst_price: z.number({ required_error: "gst price is not defined" }),
    sale_price: z.number({ required_error: "sale price is not defined" }),
    MainCategory: z.string({ required_error: "main category not defined" }),
    SubCategory: z.string({ required_error: "sub category not defined" }),
    brand_name: z.string({ required_error: "brand name is  not defined" }),
    is_featured: z.boolean({ required_error: "this product featured product or not ? (true/false) " }),
    is_new_arrival: z.boolean({ required_error: "Is this product a new arrival product ? (true/false) " }),
    is_best_seller: z.boolean({ required_error: "bestseller product ? (true/false) " }),
    seo_tittle: z.string({ required_error: "seo tittle is not defined" }),
    seo_description: z.string({ required_error: "seo description is not defined" }),
    seo_keyword: z.string({ required_error: "seo keyword is not defined" }),
    // createdBy: z.string().refine((value) => {
    //     try {
    //         new ObjectId(value);
    //         return true;
    //     } catch (error) {
    //         return false;
    //     }
    // }, 'Invalid ObjectId')

});

const newProductObject=ProductObject.merge(userEmailPwd);

// types
export type ReqProductObject = z.infer<typeof ProductObject>;
export type ReqNewProductObject=z.infer<typeof newProductObject >;

