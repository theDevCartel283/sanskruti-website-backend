import mongoose from "mongoose";

const colorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})


const colorModel = mongoose.model('Color', colorSchema);
export default colorModel;

