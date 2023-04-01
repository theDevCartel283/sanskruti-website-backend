import jwt from 'jsonwebtoken';
import { Roles } from '../config/roles.config';

export type TokenPayload = {
  email: string;
  userRole: string;
};

export const signAccessToken = (
  email: string,
  role: 'USER' | 'ADMIN' | 'SUPERADMIN'
) => {
  const access_private = process.env.ACCESS_TOKEN_PRIVATE;
  if (!access_private) throw Error('access token private secret not found');

  const payload: TokenPayload = {
    email: email,
    userRole: Roles[role],
  };

  const accessToken = jwt.sign(payload, access_private, {
    algorithm: 'RS256',
    expiresIn: '15m',
  });

  return accessToken;
};

export const signRefreshToken = (
  email: string,
  role: 'USER' | 'ADMIN' | 'SUPERADMIN'
) => {
  const refresh_private = process.env.REFRESH_TOKEN_PRIVATE;
  if (!refresh_private) throw Error('refresh token private secret not found');

  const payload: TokenPayload = {
    email: email,
    userRole: Roles[role],
  };

  const refreshToken = jwt.sign(payload, refresh_private, {
    algorithm: 'RS256',
    expiresIn: '30d',
  });

  return refreshToken;
};
