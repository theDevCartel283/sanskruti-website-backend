import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { TokenPayload } from "../../utils/jwt.utils";

export const getAllAddress = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity, provider } = req.body;
  var user: any = {};
  if (provider === "Email" || provider === "google") {
    user = await UserModel.findOne({ email: userUniqueIdentity });
  } else {
    user = await UserModel.findOne({ Mobile_No: userUniqueIdentity });
  }
  const Address = user.address;
  res.status(200).json({
    type: "success",
    Address,
  });
};
