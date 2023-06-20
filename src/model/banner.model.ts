import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: null,
  },
});

const bannerModel = mongoose.model("Banner", bannerSchema);

export default bannerModel;
