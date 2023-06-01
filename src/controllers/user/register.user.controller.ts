import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqAuthWithUsername, ReqRegister } from "../../schema/user.schema";
import bcrypt from "bcrypt";
import { Roles } from "../../config/roles.config";
import logger from "../../utils/logger.utils";
import ErrorHandler from "../../utils/errorHandler.utils";
import asyncErrorFunction from "../../middleware/catchAsyncError.middleware";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";

// Register
export const handleRegister = asyncErrorFunction(
  async (
    req: Request<{}, {}, ReqRegister>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.username.trim() === "" || req.body.password.trim() === "") {
      return next(new ErrorHandler("Feild is empty", "error", 404));
    }

    const userEmailAlreadyExists = await getUserFromEmailOrNumber(
      req.body.email
    );

    // check if user email already exists
    if (userEmailAlreadyExists)
      return next(
        new ErrorHandler("user Email already exists", "warning", 409)
      ); // Conflict

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create new user
    const newUser = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      provider: "Email/Number",
      refreshToken: "null",
      role: Roles["USER"],
      email: req.body.email,
      Mobile_No: req.body.Mobile_No,
    });

    // save user
    const user = await newUser.save();
    logger.success(
      `success, new user ${user.username} [id:${user._id}] was created`
    );
    res.status(201).json({
      message: `success, new user ${user.username} was created`,
      type: "success",
    });
  }
);
