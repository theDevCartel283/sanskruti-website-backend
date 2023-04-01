import { Request, Response } from 'express';
import UserModel from '../../model/user.model';
import { ReqUserObject } from '../../schema/user.schema';
import bcrypt from 'bcrypt';
import { Roles } from '../../config/roles.config';

// Register
const handleRegister = async (
  req: Request<{}, {}, ReqUserObject>,
  res: Response
) => {
  const userAlreadyExists = await UserModel.findOne({ email: req.body.email });

  // check if user already exists
  if (userAlreadyExists)
    return res.status(409).send({ message: 'user already exists' }); // Conflict

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

    res
      .status(201)
      .send({ message: `success, new user ${user.name} was created` });
  } catch (err: any) {
    console.log(err);
    res.status(502).send(err); // Bad Gateway
  }
};

export default handleRegister;
