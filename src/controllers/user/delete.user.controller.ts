import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqAuth } from "../../schema/user.schema";
import bcrypt from "bcrypt";
import logger from "../../utils/logger.utils";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";

// Delete
export const handleDelete = async (
  req: Request<{}, {}, ReqAuth>,
  res: Response
) => {
  const { emailOrNumber, password } = req.body;
  const foundUser = await getUserFromEmailOrNumber(emailOrNumber);

  // check if user doesn't exists
  if (!foundUser)
    return res.status(200).json({
      message: `user not found`,
      type: "error",
    }); // Ok, As we are going delete the user anyway

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    try {
      // delete user
      const user = await UserModel.findOneAndDelete({ email: foundUser.email });
      res.status(200).json({
        message: `user ${foundUser.username} was successfully deleted`,
        type: "success",
      });
    } catch (err: any) {
      logger.error(`delete user error\n${err}`);
      res.status(502).json({
        message: `Bad Gateway`,
        type: "warning",
      }); // Bad Gateway
    }
  } else {
    res.status(403).json({
      message: `Forbidden`,
      type: "warning",
    }); // Forbidden
  }
};
