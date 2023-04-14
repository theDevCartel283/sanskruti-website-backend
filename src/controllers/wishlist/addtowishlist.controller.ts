import { Request,Response } from "express";
import wishlistModel from "../../model/wishlist.model";
import { ReqWishlistObject } from "../../schema/wishlist.schema";
import { TokenPayload } from "../../utils/jwt.utils";


const addToWishlist=async(req:Request<{},{},ReqWishlistObject & TokenPayload>,res:Response)=>{
    const {email,name,price}=req.body;
    const user=await wishlistModel.findOne({email});

    const fetched_product:object={
        name,price
    }


    if(user){
        user.listItems=user.listItems.filter((product,key)=>product.name !=name);
        user.listItems.push(fetched_product);

       const userWishlist=await user.save({validateBeforeSave:false});

        res.status(200).json({
            success:true,
            userWishlist
            
        })
    }
    else{
        const newUserWishlist=new wishlistModel({
            email,
            listItems:fetched_product
        });

        const wishlist= await newUserWishlist.save();

        res.status(200).json({
            success:true,
            wishlist
        });
    }
}

export default addToWishlist;