import { Request, Response } from "express";
import UserModel from "../../model/user.model";

const deleteUserById = async (req: Request, res: Response) => {
  const productAlreadyExists = await UserModel.findOne({
    _id: req.query.id,
  });

  if (productAlreadyExists) {
    await UserModel.deleteOne({ _id: req.query.id });
    res.status(200).json({
      type: "success",
      message: "User deleted successfully",
    });
  } else {
    res.status(500).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

export default deleteUserById;
