import { Request, Response } from "express";
import { ReqAuth } from "../../schema/user.schema";
import bcrypt from "bcrypt";
import * as JWT from "../../utils/jwt.utils";
import getRole from "../../utils/getRole.util";
import logger from "../../utils/logger.utils";
import BannedEmailModel from "../../model/bannedEmail.model";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";

// Login
export const handleAuthentication = async (
  req: Request<{}, {}, ReqAuth>,
  res: Response
) => {
  const { emailOrNumber, password } = req.body;

  // check if user exists
  const foundUser = await getUserFromEmailOrNumber(emailOrNumber);
  if (!foundUser)
    return res.status(401).json({
      message: "email / number or password is incorrect",
      type: "warning",
      isAuthenticated: false,
    }); // Unauthorized

  // Guard clause for google
  if (foundUser.provider !== "Email/Number") {
    return res.status(401).json({
      message: "email / number or password is incorrect",
      type: "warning",
      isAuthenticated: false,
    }); //
  }

  const userIsBanned = foundUser.is_Banned_User;

  // check if user email is banned
  if (userIsBanned)
    return res.status(403).json({
      message: `user email:${foundUser.email} has been banned`,
      type: "warning",
      isAuthenticated: false,
    }); // Forbidden

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const role = getRole(foundUser.role);
    if (!role) throw Error(`user ${foundUser.username} role not defined`);
    try {
      // create JWT
      // Access Token

      const accessToken = JWT.signToken(
        "ACCESS_TOKEN_PRIVATE",
        foundUser._id,
        foundUser.provider,
        role
      );

      // create httpOnly cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: `successfully logged in as ${role.toLocaleLowerCase()} ${
          foundUser.username
        }`,
        type: "success",
        isAuthenticated: true,
        role,
      });
    } catch (err: any) {
      logger.error(`user login error\n${err}`);
      res.status(500).json({ message: "something went wrong", type: "info" });
    }
  } else {
    res.status(401).json({
      message: "email / number or password is incorrect",
      type: "warning",
      isAuthenticated: false,
    });
  }
};
