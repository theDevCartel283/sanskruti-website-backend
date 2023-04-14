import mongoose from "mongoose";

const sizeSchema=new mongoose.Schema({
    size:{
        type:String,
        required:true
    }
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const sizeModel=mongoose.model('Size',sizeSchema);
export default sizeModel;