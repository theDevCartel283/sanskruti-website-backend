import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqRegister } from "../../schema/user.schema";
import bcrypt from "bcrypt";
import { Roles } from "../../config/roles.config";
import logger from "../../utils/logger.utils";
import ErrorHandler from "../../utils/errorHandler.utils";
import asyncErrorFunction from "../../middleware/catchAsyncError.middleware";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";
import sendEmail from "../../utils/email/sendEmail";
import { getVerifyEmailFormat } from "../../utils/email/verifyEmailFormat";

// Register
export const handleRegister = asyncErrorFunction(
  async (
    req: Request<{}, {}, ReqRegister>,
    res: Response,
    next: NextFunction
  ) => {
    const userEmailAlreadyExists = await getUserFromEmailOrNumber(
      req.body.email
    );
    // check if user email already exists
    if (userEmailAlreadyExists)
      return next(new ErrorHandler("user Email already exists", "error", 409)); // Conflict

    const userMobileNumberExists = await getUserFromEmailOrNumber(
      req.body.Mobile_No
    );

    // check if user mobile number already exists
    if (userMobileNumberExists)
      return next(
        new ErrorHandler("user mobile number already exists", "error", 409)
      ); // Conflict

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create new user
    const newUser = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      provider: "Email/Number",
      role: Roles["USER"],
      email: req.body.email,
      email_verified: false,
      Mobile_No: req.body.Mobile_No,
      Mobile_No_verified: false,
    });

    // save user
    const user = await newUser.save();
    logger.success(
      `success, new user ${user.username} [id:${user._id}] was created`
    );

    sendEmail({
      email: req.body.email,
      message: getVerifyEmailFormat(
        req.body.username,
        newUser._id,
        "Email/Number"
      ),
      subject: "Email Verification - from Sanskruti Nx",
    });

    res.status(201).json({
      message: `success, new user ${user.username} was created`,
      type: "success",
      content:
        "Please note an email verification link in sent to you, be sure to verify your email",
    });
  }
);
