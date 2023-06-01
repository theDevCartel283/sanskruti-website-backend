import mongoose from "mongoose";

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
  Mobile_No: {
    type: Number,
    required: true,
    default: null,
  },
  email: {
    type: String,
    required: true,
    default: null,
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
  refreshToken: {
    type: String,
    required: false,
  },
  accessToken: {
    type: String,
    required: false,
    default: null,
  },
  role: {
    type: String,
    required: true,
    default: "5c83809e-d05a-11ed-afa1-0242ac120002",
  },

  dob: {
    type: Date,
    required: false,
    default: null,
  },
  address: [
    {
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
    },
  ],
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
