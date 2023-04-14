import { Request, Response } from "express";
import colorModel from "../../model/color.model";

const updateColor = async (req: Request, res: Response) => {
    const id: any = req.query.id;
    if (id.length == 24) {
        const color = await colorModel.findById(id);
        if (!color) {
            return res.status(500).json({
                success: false,
                message: "color not found"
            });
        }
        else {
            const newColor = await colorModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })
            console.log(newColor);
            res.status(200).json({
                success: true,
                newColor
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

export default updateColor;