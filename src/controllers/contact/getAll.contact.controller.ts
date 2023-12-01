import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ContactModel from "../../model/contacts.model";

const handleGetAllContacts = async (
  req: Request<{}, {}, {}, { search: string }>,
  res: Response
) => {
  try {
    const { search } = req.query;
    const contacts = await ContactModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { tel: { $regex: search, $options: "i" } },
      ],
    });

    return res.status(200).send({ contacts });
  } catch (err) {
    logger.error("get all contacts error " + err);
    return res.status(500).send({
      message: "Something went wrong",
      type: "error",
    });
  }
};

export default handleGetAllContacts;
