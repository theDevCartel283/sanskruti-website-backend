import jwt from 'jsonwebtoken';
import { Roles } from '../config/roles.config';
import { env } from '../config/env';

export type TokenPayload = {
  email: string;
  userRole: string;
};

export const signToken = (
  key: 'ACCESS_TOKEN_PRIVATE' | 'REFRESH_TOKEN_PRIVATE',
  email: string,
  role: 'USER' | 'ADMIN' | 'SUPERADMIN'
) => {
  const token_private_key = env[key];
  if (!token_private_key) throw Error(`${key} private secret not found`);

  const payload: TokenPayload = {
    email: email,
    userRole: Roles[role],
  };

  const expiresIn = key === 'ACCESS_TOKEN_PRIVATE' ? '15m' : '30d';

  const token = jwt.sign(payload, token_private_key, {
    algorithm: 'RS256',
    expiresIn,
  });

  return token;
};
