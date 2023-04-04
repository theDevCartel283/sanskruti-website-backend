import { Request, Response } from 'express';
import ProductModel from '../../model/product.model';

const updateProduct = async (req: Request, res: Response) => {
    const id: any = req.query.id;
    if (id.length == 24) {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "product not found"
            });
        }
        else {
            const newProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });
            res.status(200).json({
                success: true,
                newProduct
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

export default updateProduct;