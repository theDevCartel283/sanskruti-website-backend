import { Request,Response } from "express";
import colorModel from "../../model/color.model";
import sizeModel from "../../model/size.model";
import { ReqColorObject } from "../../schema/color.schema";
import { ReqSizeObject } from "../../schema/size.schema";

export const addColor=async(req:Request<{},{},ReqColorObject>,res:Response)=>{
    const colorAlreadyExists=await colorModel.findOne({
        name:req.body.name
    });

    
    if (colorAlreadyExists) {
        return res.status(409).send({ message: 'color already exists' });
    }
    else {
        try {
            const newColor = new colorModel({
                name: req.body.name
            });


            const Color = await newColor.save();
            res
                .status(201).json({
                    success: true,
                    Color
                });

        } catch (error) {
            res.status(502).json({
                error
            });
        }
    }


}


export const addSize=async(req:Request<{},{},ReqSizeObject>,res:Response)=>{
    const size=req.body.size.toUpperCase();
    console.log(size);
    const sizeAlreadyExists=await sizeModel.findOne({
     size
    });

    
    if (sizeAlreadyExists) {
        return res.status(409).send({ message: 'size already exists' });
    }
    else {
        try {
            const newSize = new sizeModel({
                size: req.body.size.toUpperCase()
            });


            const Size = await newSize.save();
            res
                .status(201).json({
                    success: true,
                    Size
                });

        } catch (error) {
            res.status(502).json({
                error
            });
        }
    }


}