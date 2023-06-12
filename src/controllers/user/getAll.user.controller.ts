import { Request, Response } from "express";
import ApiFeatures from "../../utils/apiFeatures.utils";
import UserModel from "../../model/user.model";

const getAllUsers = async (req: Request, res: Response) => {
  const resultperpage: number = 8;
  const userCount: number = await UserModel.countDocuments();
  const apiFeatures = new ApiFeatures(UserModel.find(), req.query)
    .search()
    .filter();
  const users = await apiFeatures.query;
  if (!users) {
    res.status(401).json({
      type: "success",
      message: "no users found",
    });
  } else {
    res.status(200).json({
      type: "success",
      users,
      userCount,
    });
  }
};

export default getAllUsers;
