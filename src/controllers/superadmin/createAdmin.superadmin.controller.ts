import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import bcrypt from "bcrypt";
import { Roles } from "../../config/roles.config";
import logger from "../../utils/logger.utils";
import { ReqAdmin } from "../../schema/admin.schema";

// Register
const handleCreateAdmin = async (
  req: Request<{}, {}, ReqAdmin>,
  res: Response
) => {
  const userEmailAlreadyExists = await UserModel.findOne({
    email: req.body.email,
  });

  // check if user email already exists
  if (userEmailAlreadyExists)
    return res
      .status(409)
      .json({ message: "user email already exists", type: "warning" }); // Conflict

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    // create new user
    const newAdmin = new UserModel({
      name: "ADMIN",
      password: hashedPassword,
      refreshToken: "null",
      role: Roles[req.body.role],
      email: req.body.email,
    });

    // save user
    const admin = await newAdmin.save();
    logger.success(
      `success, new ${admin.username} [id:${admin._id}] was created`
    );
    res.status(201).json({
      message: `success, new ${admin.username} was created`,
      type: "success",
    });
  } catch (err: any) {
    logger.error(`admin registeration error\n${err}`);
    res.status(502).json({ message: "something went wrong", type: "info" }); // Bad Gateway
  }
};

export default handleCreateAdmin;
