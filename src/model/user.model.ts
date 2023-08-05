import { Document, Model, model, Schema } from "mongoose";

export interface Address {
  id: string;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  tel: number | null;
  email: string | null;
}

export interface User extends Document {
  username: string | null;
  googleId: number | null;
  facebookId: number | null;
  Mobile_No: number | null;
  Mobile_No_verified: boolean;
  email: string | null;
  email_verified: boolean;
  password: string;
  provider: string;
  role: string;
  is_Banned_User: boolean;
  dob: Date | null;
  address: Address[]; // Array of address sub-schemas
}

export const addressSchema = new Schema<Address>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: null,
  },
  tel: {
    type: Number,
    required: true,
    default: null,
  },
  zip: {
    type: String,
    required: true,
    default: null,
  },
  address: {
    type: String,
    required: true,
    default: null,
  },
  city: {
    type: String,
    required: true,
    default: null,
  },
  country: {
    type: String,
    required: true,
    default: null,
  },
  state: {
    type: String,
    required: true,
    default: null,
  },
  email: {
    type: String,
    required: true,
    default: null,
  },
});

const userSchema = new Schema<User>({
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

const UserModel: Model<User> = model<User>("User", userSchema);
export default UserModel;
