import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.utils';
import { env } from '../config/env';
import UserModel from '../model/user.model';
import { signToken, tokenRefresh, verifyJwt } from '../utils/jwt.utils';
import getRole from '../utils/getRole.util';

export type VerifyRequest<TParams, TBody, TQuery> = Request<
  TParams,
  {},
  TBody,
  TQuery
>;

const verifyAccessJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get access Token
  const header = (req.headers['authorization'] ||
    req.headers['Authorization']) as string;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'access token not found' }); // Unauthorized

  const accessToken = header.split(' ')[1];

  // get refresh Token
  const cookie = req.cookies;
  if (!cookie?.jwt)
    return res.status(401).json({ message: 'request cookie empty' });
  const refreshToken: string = cookie.jwt;

  // Case 1: accessToken doesn't exist refresh token exists
  if (!accessToken && refreshToken) {
    const { valid, newAccessToken, email, role } = await tokenRefresh(
      refreshToken
    );

    if (!valid || !newAccessToken || !email || !role)
      return res.status(401).send({ message: 'Unauthorized', type: 'warning' });

    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    req.body.email = email;
    req.body.userRole = role;
    return next();
  }

  const { valid, decoded, expired } = verifyJwt(
    accessToken,
    'ACCESS_TOKEN_PUBLIC'
  );

  // Case 2: Valid accessToken JWT
  if (valid && decoded && !expired) {
    req.body.email = decoded.email;
    req.body.userRole = decoded.userRole;
    return next();
  }

  // Case 3: accessToken valid but expired
  if (expired && refreshToken) {
    const { valid, newAccessToken, email, role } = await tokenRefresh(
      refreshToken
    );

    if (!valid || !newAccessToken || !email || !role)
      return res.status(401).send({ message: 'Unauthorized', type: 'warning' });

    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    req.body.email = email;
    req.body.userRole = role;
    return next();
  }

  // All test fail
  return res.status(401).send({ message: 'Unauthorized', type: 'warning' });
};

export default verifyAccessJwt;
