import mongoose from 'mongoose';

const bannedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const BannedEmailModel = mongoose.model('BannedEmail', bannedEmailSchema);
export default BannedEmailModel;
