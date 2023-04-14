import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subCategory: [
        {
            type: String
        }
    ]
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });


const categoryModel = mongoose.model('Category', categorySchema);
export default categoryModel;


