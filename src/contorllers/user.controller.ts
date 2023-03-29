import { Request, Response } from 'express';
import UserModel from '../model/user.model';
import { ReqUserObject } from '../schema/user.schema';
import bcrypt from 'bcrypt';
import { ReqUserNamePwd } from '../schema/user.schema';
import jwt from 'jsonwebtoken';

export const handleRegister = async (
  req: Request<{}, {}, ReqUserObject>,
  res: Response
) => {
  const userAlreadyExists = await UserModel.findOne({
    username: req.body.username,
  });

  // check if user already exists
  if (userAlreadyExists) return res.status(409).send('user already exists'); // Conflict

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    // create new user
    const newUser = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      refreshToken: 'null',
      name: req.body.name,
      email: req.body.email,
      dob: new Date(req.body.dob),
      mobileNo: req.body.mobileNo,
      address: req.body.address,
    });

    // save user
    const user = await newUser.save();

    res
      .status(201)
      .send({ message: `success new user ${user.username} was created` });
  } catch (err: any) {
    console.log(err);
    res.status(502).send(err); // Bad Gateway
  }
};

export const handleAuthentication = async (
  req: Request<{}, {}, ReqUserNamePwd>,
  res: Response
) => {
  const { username, password } = req.body;

  // check if user exists
  const foundUser = await UserModel.findOne({ username: username });
  if (!foundUser)
    return res
      .status(401)
      .send({ message: 'usernaem or password is incorrect' }); // Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    try {
      // create JWT
      // Access Token
      const access_private = process.env.ACCESS_TOKEN_PRIVATE;
      if (!access_private) throw Error('access token private secret not found');

      const accessToken = jwt.sign(
        { username: foundUser.username },
        access_private,
        { algorithm: 'RS256', expiresIn: '15m' }
      );

      // Refresh Token
      const refresh_private = process.env.REFRESH_TOKEN_PRIVATE;
      if (!refresh_private)
        throw Error('refresh token private secret not found');

      const refreshToken = jwt.sign(
        { username: foundUser.username },
        refresh_private,
        { algorithm: 'RS256', expiresIn: '30d' }
      );

      // store refresh token in db
      await UserModel.findOneAndUpdate(
        { username: foundUser.username },
        { refreshToken: refreshToken }
      );

      // create httpOnly cookie
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).send({ accessToken });
    } catch (err: any) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.status(401).send('username or password is incorrect');
  }
};
