import { Request, Response } from 'express';
import ProductModel from '../../model/product.model';
import { Roles } from '../../config/roles.config';
import { ReqProductObject } from '../../schema/product.schema';
import { TokenPayload } from '../../utils/jwt.utils';


const addProduct = async (req: Request<{}, {}, ReqProductObject & TokenPayload>, res: Response) => {
    const productAlreadyExists = await ProductModel.findOne({
        name: req.body.name
    });

    if (productAlreadyExists) {
        return res.status(409).send({ message: 'product already exists' });
    }
    else {
        try {
            const newProduct = new ProductModel({
                name: req.body.name,
                description: req.body.description,
                size:req.body.size,
                color:req.body.color,
                stock: req.body.stock,
                price: req.body.price,
                gst_price: req.body.gst_price,
                sale_price: req.body.sale_price,
                MainCategory: req.body.MainCategory,
                SubCategory: req.body.SubCategory,
                brand_name: req.body.brand_name,
                is_featured: req.body.is_featured,
                is_new_arrival: req.body.is_new_arrival,
                is_best_seller: req.body.is_best_seller,
                seo_tittle: req.body.seo_tittle,
                seo_description: req.body.seo_description,
                seo_keyword: req.body.seo_keyword,
                createdBy: req.body.email
            });


            const product = await newProduct.save();
            res
                .status(201).json({
                    success: true,
                    product
                });

        } catch (error) {
            res.status(502).json({
                error
            });
        }
    }


}

export default addProduct;