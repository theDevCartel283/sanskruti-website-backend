import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    product_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    reviews:[
        {
            username:{
                type:String,required:true
            },
            comment:{
                type:String,required:true
            },
            rating:{
                type:Number,required:true
            }
        }
    ]
});

const reviewModel=mongoose.model('Reviews',reviewSchema);
export default reviewModel;