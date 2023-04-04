import { Request, Response } from 'express';
import ProductModel from '../../model/product.model';
import { Roles } from '../../config/roles.config';

const deleteProduct = async (req: Request, res: Response) => {
    const id: any = req.query.id
    if (id.length == 24) {
        const product: any = await ProductModel.findById(id);

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "product not found"
            });
        }
        else {
            await product.deleteOne(req.query);
            res.status(200).json({
                success: true,
                message: "Product Deleted Successfully"
            })

        }
    }
    else {
        res.status(500).json({
            success: false,
            message: "wrong id / id length should be of 24 char"
        })
    }


}

export default deleteProduct;