import mongoose, { Document } from "mongoose";

type Contact = {
  name: string;
  email: string;
  tel: string;
  review: string;
};

interface ContactDocument extends Document, Contact {}

const contactSchema = new mongoose.Schema<ContactDocument>({
  name: String,
  email: String,
  tel: String,
  review: String,
});

const ContactModel = mongoose.model("Contact", contactSchema);
export default ContactModel;
