import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqArr } from "../../schema/user.schema";
import { TokenPayload } from "../../utils/jwt.utils";

export const updateAddress = async (
  req: Request<{}, {}, TokenPayload & ReqArr>,
  res: Response
) => {
  const { userUniqueIdentity, provider, arr } = req.body;

  if (provider === "Email" || provider === "google") {
    const user = await UserModel.findOne({ email: userUniqueIdentity });
    const updateAddress = await UserModel.updateOne(
      { email: userUniqueIdentity },
      {
        $set: {
          address: arr,
        },
      }
    );
    res.status(200).json({
      success: true,
      updateAddress,
    });
  } else {
    const user = await UserModel.findOne({ Mobile_No: userUniqueIdentity });
    const updateAddress = await UserModel.updateOne(
      { Mobile_No: userUniqueIdentity },
      {
        $set: {
          address: arr,
        },
      }
    );
    res.status(200).json({
      success: true,
      updateAddress,
    });
  }
};
