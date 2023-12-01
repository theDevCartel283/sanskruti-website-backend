import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { ReqContact } from "../../schema/contact.schema";
import ContactModel from "../../model/contacts.model";

const handleAddContact = async (
  req: Request<{}, {}, ReqContact>,
  res: Response
) => {
  try {
    const { name, email, tel, review } = req.body;

    const newContact = new ContactModel({
      name,
      email,
      tel,
      review,
    });

    newContact.save();

    return res.status(200).send({
      message: `Thank you ${name} for leaving a review`,
      type: "success",
    });
  } catch (err) {
    logger.error("add contact error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleAddContact;
