import {Request,Response} from 'express';
import reviewModel from '../../model/review.model';
import { ReqReviewObject } from '../../schema/review.schema';

const updateReview=async(req:Request<{},{},ReqReviewObject>,res:Response)=>{
    const {product_id,username,comment,rating}=req.body;
    const review:object={
        username,
        comment,
        rating
    }
    const arr:Array<object>=[
        review
    ]

    const product_review=await reviewModel.findOne({product_id});
    if(!product_review){
        try {

            const newReview=new reviewModel({
              product_id:req.body.product_id,
              reviews:arr  
            });

            const Review=await newReview.save();

            res.status(200).json({
                success:true,
                Review
            })
        } catch (error) {
            res.status(502).json({
                error
            });
        }
    }
    else{
        const isReviewed=product_review.reviews.find(
            (i)=>i.username===req.body.username
        );
        if(isReviewed){
            product_review.reviews.forEach((i)=>{
                if(i.username=== req.body.username){
                    i.comment=req.body.comment;
                    i.rating=req.body.rating
                }
            });

            await product_review.save({validateBeforeSave:false});

            res.status(200).json({
                success:true,
                product_review
            })
        }
        else{
            product_review.reviews.push({
                username:req.body.username,
                comment:req.body.comment,
                rating:req.body.rating
            });

            await product_review.save({validateBeforeSave:false});

            res.status(200).json({
                success:true,
                product_review
            })
        }
    }
}
export default updateReview;