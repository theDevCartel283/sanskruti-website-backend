import { Request, Response } from 'express';
import UserModel from '../../model/user.model';
import { ReqUserNamePwd } from '../../schema/user.schema';
import bcrypt from 'bcrypt';
import * as JWT from '../../utils/jwt.utils';
import getRole from '../../utils/getRole.util';

// Login
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
      .send({ message: 'username or password is incorrect' }); // Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const role = getRole(foundUser.role);
    if (!role) throw Error(`user ${foundUser.username} role not defined`);
    try {
      // create JWT
      // Access Token
      const accessToken = JWT.signAccessToken(foundUser.username, role);

      // Refresh Token
      const refreshToken = JWT.signRefreshToken(foundUser.username, role);

      // store refresh token in db
      await UserModel.findOneAndUpdate(
        { username: foundUser.username },
        { refreshToken: refreshToken }
      );

      // create httpOnly cookie
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).send({
        message: `successfully logged in as ${role.toLocaleLowerCase()} ${
          foundUser.username
        }`,
        accessToken,
      });
    } catch (err: any) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.status(401).send({ message: 'username or password is incorrect' });
  }
};

export default handleAuthentication;
