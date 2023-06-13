import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import logger from "../../utils/logger.utils";
import sendEmail from "../../utils/email/sendEmail";
import { getForgotPasswordFormat } from "../../utils/email/forgotPasswordFormat";
import { verifyJwt } from "../../utils/jwt.utils";

// Forgot Password Request
export const handleForgotPasswordRequest = async (
  req: Request<{}, {}, {}, { email: string }>,
  res: Response
) => {
  const { email } = req.query;

  try {
    // check if user exists
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser || !foundUser.username)
      return res.status(401).json({
        message: `user with email ${email} not found`,
        type: "warning",
      }); // Unauthorized
    sendEmail({
      email,
      message: getForgotPasswordFormat(
        foundUser.username,
        foundUser._id,
        foundUser.provider
      ),
      subject: "Reset Your Password",
    });

    return res.status(200).json({
      message: "password change link is sent to your email",
      type: "success",
    });
  } catch (err) {
    logger.error(`forgot password error ${err}`);
    return res.status(500).json({
      message: "something went wrong",
      type: "info",
    });
  }
};

// Forgot Password Request
export const handleForgotPasswordChange = async (
  req: Request<{}, {}, { token: string; updatePassword: string }>,
  res: Response
) => {
  const { token, updatePassword } = req.body;

  const { valid, decoded, expired } = verifyJwt(token, "EMAIL_TOKEN_PUBLIC");

  if (!valid || !decoded || !decoded.userUniqueIdentity || expired) {
    return res.status(400).send({
      message: "Invalid Request, The OTP link has expired",
      type: "error",
    });
  }

  try {
    // check if user exists
    const foundUser = await UserModel.findById(decoded.userUniqueIdentity);
    if (!foundUser)
      return res.status(400).send({
        message: "Invalid Request, The OTP link has expired",
        type: "error",
      });

    // hash password
    const hashedPassword = await bcrypt.hash(updatePassword, 10);

    // update password in db
    await UserModel.findOneAndUpdate(
      { email: foundUser.email },
      { password: hashedPassword }
    );

    res.status(200).json({
      message: "password changed successfully",
      type: "success",
    });
  } catch (err: any) {
    logger.error(`update user password error\n${err}`);
    res.sendStatus(500);
  }
};
