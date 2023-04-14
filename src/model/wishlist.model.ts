import mongoose from "mongoose";

const wishlistSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    listItems:[
        {
            name:{
                type:String
            },
            price:{
                type:Number
            }
        }
    ]
});


const wishlistModel=mongoose.model('Wishlist',wishlistSchema);
export default wishlistModel;