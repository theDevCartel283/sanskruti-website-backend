import mongoose from "mongoose";
export const addressSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    default: null,
  },
  contactNo: {
    type: Number,
    required: true,
    default: null,
  },
  pincode: {
    type: Number,
    required: true,
    default: null,
  },
  nearBy: {
    type: String,
    required: true,
    default: null,
  },
  landmark: {
    type: String,
    required: true,
    default: null,
  },
  city: {
    type: String,
    required: true,
    default: null,
  },
  state: {
    type: String,
    required: true,
    default: null,
  },
});
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    default: null,
  },
  googleId: {
    type: Number,
    required: false,
    default: null,
  },
  facebookId: {
    type: Number,
    required: false,
    default: null,
  },
  Mobile_No: {
    type: Number,
    default: null,
  },
  Mobile_No_verified: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    default: null,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    default: null,
  },
  provider: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  is_Banned_User: {
    type: Boolean,
    default: false,
  },
  dob: {
    type: Date,
    required: false,
    default: null,
  },
  address: [addressSchema],
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
