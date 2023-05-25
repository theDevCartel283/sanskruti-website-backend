import mongoose from "mongoose";
import { Schema } from "zod";

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  profile: {
    type: String,
    default: "default.jpg",
  },
});

const imageModel = mongoose.model("Image", imageSchema);

export default imageModel;
