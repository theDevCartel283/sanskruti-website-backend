import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import logger from "../../utils/logger.utils";
import { verifyJwt } from "../../utils/jwt.utils";

// Update user
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

export default handleVerifyEmail;
