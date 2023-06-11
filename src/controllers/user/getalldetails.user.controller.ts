import { Request, Response } from "express";
import getRole from "../../utils/getRole.util";
import UserModel from "../../model/user.model";

// Protected Routes Controller
// Get User Details
export const handleGetUserDetails = async (req: Request, res: Response) => {
  const id = req.query.id;
  const user = await UserModel.findById({ _id: id });
  // username doesn't exist in db
  if (!user) {
    return res.status(401).json({
      message: "user not found",
      type: "error",
    }); // Unauthorized
  }

  const role = getRole(user.role);

  const userTrimmend = {
    username: user.username,
    email: user.email,
    email_verified: user.email_verified,
    address: user.address,
    Mobile_No: user.Mobile_No,
    Mobile_No_verified: user.Mobile_No_verified,
    dob: user.dob,
    provider: user.provider,
    role,
    is_Banned_User: user.is_Banned_User,
  };

  res.status(200).json({
    user: userTrimmend,
  });
};

export default handleGetUserDetails;
