import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqUserUpdatePassword } from "../../schema/user.schema";
import bcrypt from "bcrypt";
import logger from "../../utils/logger.utils";
import { TokenPayload } from "../../utils/jwt.utils";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";

// Update Password
export const handleUpdatePassword = async (
  req: Request<{}, {}, ReqUserUpdatePassword & TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity, password, updatePassword } = req.body;

  // check if user exists
  const foundUser = await getUserFromEmailOrNumber(userUniqueIdentity);
  if (!foundUser)
    return res.status(401).json({
      message: "email / number or password is incorrect",
      type: "warning",
    }); // Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // hash password
    const hashedPassword = await bcrypt.hash(updatePassword, 10);
    try {
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
  } else {
    res.status(401).json({
      message: "password is incorrect",
      type: "error",
    });
  }
};

export default handleUpdatePassword;
