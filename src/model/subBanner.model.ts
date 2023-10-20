import mongoose from "mongoose";

const subBannerSchema = new mongoose.Schema({
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

const subBannerModel = mongoose.model("SubBanner", subBannerSchema);

export default subBannerModel;
