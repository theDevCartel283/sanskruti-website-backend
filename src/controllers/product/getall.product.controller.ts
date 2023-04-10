import { Request, Response } from 'express';
import ProductModel from '../../model/product.model';
import ApiFeatures from '../../utils/apiFeatures.utils';


export const getallProducts = async (
    req: Request, res: Response) => {
    const resultperpage: number = 8;
    const productCount: number = await ProductModel.countDocuments();
    const apiFeatures = new ApiFeatures(ProductModel.find(), req.query).search().filter().pagination(resultperpage)
    const products = await apiFeatures.query;
    if (!products) {
        res.status(401).json({
            message: "no products found"
        })
    }
    else {
        res.status(200).json({
            success: true,
            productCount,
            products
        });
    }
}

export default getallProducts;