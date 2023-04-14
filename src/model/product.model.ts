import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // images: [
    //     {
    //         public_id: {
    //             type: String,
    //             default: "xyz",
    //             required: true
    //         },
    //         url: {
    //             type: String,
    //             default: "xyz",
    //             required: true
    //         }
    //     }
    // ],
    description: {
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    size:{
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    gst_price: {
        type: Number,
        required: true,
        default: 0
    },
    sale_price: {
        type: Number,
        required: true,
        default: 0
    },
    MainCategory: {
        type: String,
        required: true,
    },
    SubCategory: {
        type: String,
        required: true
    },
    brand_name: {
        type: String,
        required: true
    },
    is_featured: {
        type: Boolean,
        required: true
    },
    is_new_arrival: {
        type: Boolean,
        required: true
    },
    is_best_seller: {
        type: Boolean,
        required: true
    },
    seo_tittle: {
        type: String,
        required: true
    },
    seo_description: {
        type: String,
        required: true
    },
    seo_keyword: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },


}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;

