import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqEmailPwd, RequserMobileNoPwd } from "../../schema/user.schema";
import bcrypt from "bcrypt";
import * as JWT from "../../utils/jwt.utils";
import getRole from "../../utils/getRole.util";
import logger from "../../utils/logger.utils";
import BannedEmailModel from "../../model/bannedEmail.model";

// Login
export const handleAuthenticationWithEmail = async (
  req: Request<{}, {}, ReqEmailPwd>,
  res: Response
) => {
  const { email, password } = req.body;

  // check if user exists
  const foundUser = await UserModel.findOne({ email: email });
  if (!foundUser)
    return res.status(401).json({
      message: "email / number or password is incorrect",
      type: "warning",
      isAuthenticated: false,
    }); // Unauthorized

  const userIsBanned = await BannedEmailModel.findOne({
    email: email,
  });

  // check if user email is banned
  if (userIsBanned)
    return res.status(403).json({
      message: `user email:${email} has been banned`,
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

      const accessToken = JWT.signTokenForEmail(
        "ACCESS_TOKEN_PRIVATE",
        foundUser.email,
        foundUser.provider,
        role
      );

      // Refresh Token
      const refreshToken = JWT.signTokenForEmail(
        "REFRESH_TOKEN_PRIVATE",
        foundUser.email,
        foundUser.provider,
        role
      );

      // store refresh token in db
      await UserModel.findOneAndUpdate(
        { email: foundUser.email },
        { refreshToken: refreshToken }
      );

      // create httpOnly cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        message: `successfully logged in as ${role.toLocaleLowerCase()} ${
          foundUser.username
        }`,
        type: "success",
        accessToken,
        isAuthenticated: true,
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

export const handleAuthenticationWithNumber = async (
  req: Request<{}, {}, RequserMobileNoPwd>,
  res: Response
) => {
  const { Mobile_No, password } = req.body;

  // check if user exists
  const foundUser = await UserModel.findOne({ Mobile_No });
  if (!foundUser)
    return res.status(401).json({
      message: "email / number or password is incorrect",
      type: "warning",
      isAuthenticated: false,
    }); // Unauthorized

  // const userIsBanned = await BannedEmailModel.findOne({
  //   email: email,
  // });

  // check if user email is banned
  // if (userIsBanned)
  //   return res.status(403).json({
  //     message: `user email:${email} has been banned`,
  //     type: "warning",
  //   }); // Forbidden

  // evaluate password
  const mobileNumber: any = foundUser.Mobile_No;
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const role = getRole(foundUser.role);
    if (!role) throw Error(`user ${foundUser.username} role not defined`);
    try {
      // create JWT
      // Access Token

      const accessToken = JWT.signTokenForNumber(
        "ACCESS_TOKEN_PRIVATE",
        mobileNumber,
        foundUser.provider,
        role
      );

      // Refresh Token
      const refreshToken = JWT.signTokenForNumber(
        "REFRESH_TOKEN_PRIVATE",
        mobileNumber,
        foundUser.provider,
        role
      );

      // store refresh token in db
      await UserModel.findOneAndUpdate(
        { Mobile_No: foundUser.Mobile_No },
        { refreshToken: refreshToken }
      );

      // create httpOnly cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        message: `successfully logged in as ${role.toLocaleLowerCase()} ${
          foundUser.username
        }`,
        type: "success",
        accessToken,
        isAuthenticated: true,
      });
    } catch (err: any) {
      logger.error(`user login error\n${err}`);
      res.status(500).json({
        message: "something went wrong",
        type: "info",
        isAuthenticated: false,
      });
    }
  } else {
    res.status(401).json({
      message: "email / number or password is incorrect",
      type: "warning",
      isAuthenticated: false,
    });
  }
};
