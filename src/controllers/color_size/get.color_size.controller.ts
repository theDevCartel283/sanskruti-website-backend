import {Request,Response} from 'express';
import colorModel from '../../model/color.model';
import sizeModel from '../../model/size.model';

export const getColor=async(req:Request,res:Response)=>{
    const colors=await colorModel.find();
    if (!colors) {
        res.status(401).json({
            message: "no colors found"
        })
    }
    else {
        res.status(200).json({
            success: true,
            colors
        });
    }
}

export const getSize=async(req:Request,res:Response)=>{
    const size=await sizeModel.find();
    if (!size) {
        res.status(401).json({
            message: "no sizes found"
        })
    }
    else {
        res.status(200).json({
            success: true,
            size
        });
    }
}