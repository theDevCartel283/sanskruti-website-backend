import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqUserDetails } from "../../schema/user.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import logger from "../../utils/logger.utils";
import sendEmail from "../../utils/email/sendEmail";
import { getVerifyEmailFormat } from "../../utils/email/verifyEmailFormat";

// Update user
export const handleUpdateUser = async (
  req: Request<{}, {}, ReqUserDetails & TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity, username, email, Mobile_No } = req.body;

  // check if user exists
  const foundUser = await UserModel.findById(userUniqueIdentity);
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
    // Send Email verification
    if (foundUser.email !== email) {
      sendEmail({
        email: req.body.email,
        message: getVerifyEmailFormat(
          req.body.username,
          foundUser._id,
          "Email/Number"
        ),
        subject: "Email Verification - from Sanskruti Nx",
      });
    }

    // update user in db
    foundUser.username = username;
    foundUser.Mobile_No = Mobile_No;
    foundUser.email_verified =
      foundUser.email !== email ? false : foundUser.email_verified;
    foundUser.email = email;
    await foundUser.save();

    return res.status(200).json({
      message: `user was successfully updated`,
      type: "success",
      username,
      Mobile_No,
      Mobile_No_verified: foundUser.Mobile_No_verified,
      email,
      email_verified: foundUser.email_verified,
    });
  } catch (err: any) {
    logger.error(`update user error\n${err}`);
    return res
      .status(500)
      .json({ message: "something went wrong", type: "info" });
  }
};

export default handleUpdateUser;
