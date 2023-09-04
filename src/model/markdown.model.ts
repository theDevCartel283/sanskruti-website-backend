import mongoose from "mongoose";

const markdownSchema = new mongoose.Schema({
  status: {
    type: String,
  },
  returnPolicy: {
    type: String,
  },
  termsAndConditions: {
    type: String,
  },
  privacyPolicy: {
    type: String,
  },
});

const markdownModel = mongoose.model("Markdown", markdownSchema);

export default markdownModel;
