import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqUserDetails } from "../../schema/user.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import logger from "../../utils/logger.utils";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";

// Update user
export const handleUpdateUser = async (
  req: Request<{}, {}, ReqUserDetails & TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity, username, email, Mobile_No } = req.body;

  // check if user exists
  const foundUser = await getUserFromEmailOrNumber(userUniqueIdentity);
  if (!foundUser)
    return res
      .status(401)
      .json({ message: "something went wrong", type: "info" }); // Unauthorized

  // check if email exists
  const foundEmail = await UserModel.findOne({ email });
  if (foundEmail && foundUser.email !== email)
    return res
      .status(400)
      .json({ message: "email already exists", type: "warning" }); // Unauthorized

  // check if mobile number exists
  const foundMobileNumber = await UserModel.findOne({ Mobile_No });
  if (foundMobileNumber && foundUser.Mobile_No !== Mobile_No)
    return res
      .status(400)
      .json({ message: "mobile number already exists", type: "warning" }); // Unauthorized

  try {
    // update user in db
    await UserModel.findOneAndUpdate(
      { email: foundUser.email },
      {
        username,
        Mobile_No,
        email,
      }
    );

    res.status(200).json({
      message: `user was successfully updated`,
      type: "success",
    });
  } catch (err: any) {
    logger.error(`update user error\n${err}`);
    res.status(500).json({ message: "something went wrong", type: "info" });
  }
};

export default handleUpdateUser;
