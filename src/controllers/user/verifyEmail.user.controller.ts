import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import logger from "../../utils/logger.utils";
import { verifyJwt } from "../../utils/jwt.utils";
import sendEmail from "../../utils/email/sendEmail";
import { getVerifyEmailFormat } from "../../utils/email/verifyEmailFormat";

export const handleVerifyEmailRequest = async (
  req: Request<{}, {}, {}, { email: string }>,
  res: Response
) => {
  const { email } = req.query;

  try {
    // check if user exists
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser || !foundUser.username)
      return res
        .status(401)
        .json({ message: "something went wrong", type: "info" }); // Unauthorized

    sendEmail({
      email: email,
      message: getVerifyEmailFormat(
        foundUser.username,
        foundUser._id,
        "Email/Number"
      ),
      subject: "Email Verification - from Sanskruti Nx",
    });

    return res.status(200).json({
      message: "Email verification link sent",
      type: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleVerifyEmail = async (
  req: Request<{}, {}, { token: string }>,
  res: Response
) => {
  const { token } = req.body;

  const { valid, decoded, expired } = verifyJwt(token, "EMAIL_TOKEN_PUBLIC");

  if (!valid || !decoded || expired)
    return res
      .status(401)
      .json({ message: "something went wrong", type: "info" }); // Unauthorized

  // check if user exists
  const foundUser = await UserModel.findById(decoded?.userUniqueIdentity);
  if (!foundUser)
    return res
      .status(401)
      .json({ message: "something went wrong", type: "info" }); // Unauthorized

  try {
    // update user in db
    await UserModel.findOneAndUpdate(
      { email: foundUser.email },
      {
        email_verified: true,
      }
    );

    res.status(200).json({
      message: `user email was successfully verified`,
      type: "success",
    });
  } catch (err: any) {
    logger.error(`update user error\n${err}`);
    res.status(500).json({ message: "something went wrong", type: "info" });
  }
};
