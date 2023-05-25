import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/user.model";
import {
  ReqEmailPwdWithUsername,
  RequserMobileNoPwdWithUsername,
} from "../../schema/user.schema";
import bcrypt from "bcrypt";
import { Roles } from "../../config/roles.config";
import logger from "../../utils/logger.utils";
import ErrorHandler from "../../utils/errorHandler.utils";
import asyncErrorFunction from "../../middleware/catchAsyncError.middleware";

// Register
export const handleRegisterWithEmail = asyncErrorFunction(
  async (
    req: Request<{}, {}, ReqEmailPwdWithUsername>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.username.trim() === "" || req.body.password.trim() === "") {
      return next(new ErrorHandler("Feild is empty", "error", 404));
    }

    const userEmailAlreadyExists = await UserModel.findOne({
      email: req.body.email,
    });

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
      provider: "Email",
      refreshToken: "null",
      role: Roles["USER"],
      email: req.body.email,
      Mobile_No: 91,
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

export const handleRegisterWithNumber = asyncErrorFunction(
  async (
    req: Request<{}, {}, RequserMobileNoPwdWithUsername>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.username.trim() === "" || req.body.password.trim() === "") {
      return next(new ErrorHandler("Feild is empty", "error", 404));
    }

    const userNumberAlreadyExists = await UserModel.findOne({
      Mobile_No: req.body.Mobile_No,
    });

    // check if user email already exists
    if (userNumberAlreadyExists) {
      return next(
        new ErrorHandler("user number already exists", "warning", 404)
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create new user
    const newUser = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      provider: "Number",
      refreshToken: "null",
      role: Roles["USER"],
      email: " ",
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
