import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  desktopImage: {
    type: String,
    default: null,
  },
  mobileImage: {
    type: String,
    default: null,
  },
  bannerLink: {
    type: String,
  },
});

const bannerModel = mongoose.model("Banner", bannerSchema);

export default bannerModel;
