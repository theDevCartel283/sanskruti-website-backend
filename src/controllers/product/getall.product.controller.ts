import { Request, Response } from 'express';
import ProductModel from '../../model/product.model';


export const getallProducts = async (
    req: Request, res: Response) => {
    const products = await ProductModel.find();
    if (!products) {
        res.status(401).json({
            message: "no products found"
        })
    }
    else {
        res.status(200).json({
            success: true,
            products
        });
    }
}

export default getallProducts;