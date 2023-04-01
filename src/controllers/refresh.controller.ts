import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as JWT from '../utils/jwt.utils';
import getRole from '../utils/getRole.util';
import UserModel from '../model/user.model';

export const handleRefresh = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.jwt)
    return res.status(401).send({ message: 'request cookie empty' });
  const refreshToken: string = cookie.jwt;

  // find user
  const foundUser = await UserModel.findOne({ refreshToken });
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // verify refresh jwt
  const refresh_public = process.env.REFRESH_TOKEN_PUBLIC;
  if (!refresh_public) return res.sendStatus(500);
  jwt.verify(refreshToken, refresh_public, (err, decoded: any) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403); // Forbidden

    // roles
    const role = getRole(foundUser.role);
    if (!role) throw Error('User role undefined');

    // refresh token verified create access token
    // Access Token
    const accessToken = JWT.signAccessToken(foundUser.email, role);
    res.status(200).json({ accessToken });
  });
};
