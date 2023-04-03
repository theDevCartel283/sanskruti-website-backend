import { Request, Response } from 'express';
import UserModel from '../../model/user.model';
import { ReqEmailPwd } from '../../schema/user.schema';
import bcrypt from 'bcrypt';
import * as JWT from '../../utils/jwt.utils';
import getRole from '../../utils/getRole.util';

// Login
export const handleAuthentication = async (
  req: Request<{}, {}, ReqEmailPwd>,
  res: Response
) => {
  const { email, password } = req.body;

  // check if user exists
  const foundUser = await UserModel.findOne({ email: email });
  if (!foundUser)
    return res.status(401).json({
      message: 'email / number or password is incorrect',
      type: 'warning',
    }); // Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const role = getRole(foundUser.role);
    if (!role) throw Error(`user ${foundUser.name} role not defined`);
    try {
      // create JWT
      // Access Token
      const accessToken = JWT.signAccessToken(foundUser.email, role);

      // Refresh Token
      const refreshToken = JWT.signRefreshToken(foundUser.email, role);

      // store refresh token in db
      await UserModel.findOneAndUpdate(
        { email: foundUser.email },
        { refreshToken: refreshToken }
      );

      // create httpOnly cookie
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        message: `successfully logged in as ${role.toLocaleLowerCase()} ${
          foundUser.name
        }`,
        type: 'success',
        accessToken,
      });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ message: 'something went wrong', type: 'info' });
    }
  } else {
    res.status(401).json({
      message: 'email / number or password is incorrect',
      type: 'warning',
    });
  }
};

export default handleAuthentication;
