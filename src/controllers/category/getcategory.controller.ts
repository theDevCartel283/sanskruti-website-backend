import { Request, Response } from 'express';
import categoryModel from '../../model/category.model';


const getCategory = async (
    req: Request, res: Response) => {
    const categories = await categoryModel.find();
    if (!categories) {
        res.status(401).json({
            message: "no categories found"
        })
    }
    else {
        res.status(200).json({
            success: true,
            categories
        });
    }
}

export default getCategory;