import { Request, Response } from 'express';
import categoryModel from '../../model/category.model';



const deleteCategory = async (req: Request, res: Response) => {
    const id: any = req.query.id
    if (id.length == 24) {
        const category: any = await categoryModel.findById(id);

        if (!category) {
            return res.status(500).json({
                success: false,
                message: "category not found"
            });
        }
        else {
            await category.deleteOne(req.query);
            res.status(200).json({
                success: true,
                message: "category Deleted Successfully"
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

export default deleteCategory;