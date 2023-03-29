import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
