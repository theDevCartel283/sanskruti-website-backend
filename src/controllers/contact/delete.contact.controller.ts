import { Request, Response } from "express";
import ContactModel from "../../model/contacts.model";
import logger from "../../utils/logger.utils";

const handleDeleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ContactModel.findByIdAndDelete(id);
    return res.status(200).send({
      message: "Contact deleted successfully",
      type: "success",
    });
  } catch (err) {
    logger.error("delete contact error " + err);
    return res.status(500).send({
      message: "Something went wrong",
      type: "error",
    });
  }
};

export default handleDeleteContact;
