import { Request, Response } from 'express';
import UserModel from '../../model/user.model';
import { ReqUserObject } from '../../schema/user.schema';
import bcrypt from 'bcrypt';
import { Roles } from '../../config/roles.config';
import logger from '../../utils/logger.utils';
import BannedEmailModel from '../../model/bannedEmail.model';

// Register
const handleRegister = async (
  req: Request<{}, {}, ReqUserObject>,
  res: Response
) => {
  const userIsBanned = await BannedEmailModel.findOne({
    email: req.body.email,
  });

  // check if user email is banned
  if (userIsBanned)
    return res.status(403).json({
      message: `user email:${req.body.email} has been banned`,
      type: 'warning',
    }); // Forbidden

  const userEmailAlreadyExists = await UserModel.findOne({
    email: req.body.email,
  });

  // check if user email already exists
  if (userEmailAlreadyExists)
    return res
      .status(409)
      .json({ message: 'user email already exists', type: 'warning' }); // Conflict

  const userNumberAlreadyExists = await UserModel.findOne({
    mobileNo: req.body.mobileNo,
  });

  // check if user number already exists
  if (userNumberAlreadyExists)
    return res
      .status(409)
      .json({ message: 'user mobile number already exists', type: 'warning' }); // Conflict

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    // create new user
    const newUser = new UserModel({
      name: req.body.name,
      password: hashedPassword,
      refreshToken: 'null',
      role: Roles['USER'],
      email: req.body.email,
      dob: new Date(req.body.dob),
      mobileNo: req.body.mobileNo,
      address: req.body.address,
    });

    // save user
    const user = await newUser.save();
    logger.success(
      `success, new user ${user.name} [id:${user._id}] was created`
    );
    res.status(201).json({
      message: `success, new user ${user.name} was created`,
      type: 'success',
    });
  } catch (err: any) {
    logger.error(`user registeration error\n${err}`);
    res.status(502).json({ message: 'something went wrong', type: 'info' }); // Bad Gateway
  }
};

export default handleRegister;
