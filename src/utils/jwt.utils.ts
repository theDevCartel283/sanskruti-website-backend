import jwt from "jsonwebtoken";
import { Roles } from "../config/roles.config";
import { env } from "../config/env";
import logger from "./logger.utils";
import UserModel from "../model/user.model";
import getRole from "./getRole.util";
import { Types } from "mongoose";

export type TokenPayload = {
  userUniqueIdentity: Types.ObjectId;
  userRole: string;
  provider: string;
};

export const signToken = (
  key: "ACCESS_TOKEN_PRIVATE" | "REFRESH_TOKEN_PRIVATE" | "EMAIL_TOKEN_PRIVATE",
  id: Types.ObjectId,
  provider: string,
  role: "USER" | "ADMIN" | "SUPERADMIN"
) => {
  const token_private_key = env[key];
  if (!token_private_key) throw Error(`${key} private secret not found`);

  const payload: TokenPayload = {
    userUniqueIdentity: id,
    userRole: Roles[role],
    provider: provider,
  };

  const expiresIn = key === "EMAIL_TOKEN_PRIVATE" ? "15m" : "30d";

  const token = jwt.sign(payload, token_private_key, {
    algorithm: "RS256",
    expiresIn,
  });

  return token;
};

export function verifyJwt(
  token: string,
  key: "ACCESS_TOKEN_PUBLIC" | "REFRESH_TOKEN_PUBLIC" | "EMAIL_TOKEN_PUBLIC"
) {
  const token_public_key = env[key];
  if (!token_public_key) throw Error(`${key} public secret not found`);

  try {
    const decoded = jwt.verify(token, token_public_key) as TokenPayload;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === "jwt expired",
      decoded: null,
    };
  }
}

// export const tokenRefreshForEmail: (refreshToken: string) => Promise<{
//   valid: boolean;
//   newAccessToken?: string;
//   email?: string;
//   Mobile_NO?: number;
//   provider?: string;
//   role?: "USER" | "ADMIN" | "SUPERADMIN";
// }> = async (refreshToken) => {
//   // validate refresh Token
//   const validRefreshTokenUser = await UserModel.findOne({ refreshToken });
//   if (!validRefreshTokenUser) return { valid: false };

//   // validate refreshToken
//   const { valid, expired, decoded } = verifyJwt(
//     refreshToken,
//     "REFRESH_TOKEN_PUBLIC"
//   );

//   // invalid or expired or decoded is empty
//   if (!valid || expired || !decoded) return { valid: false };

//   // now refresh token is valid
//   // get user role
//   const role = getRole(validRefreshTokenUser.role);
//   if (!role) {
//     logger.error(`User  role is undefined`);
//     return { valid: false };
//   }

//   if (validRefreshTokenUser.provider === "Email") {
//     const newAccessToken = signToken(
//       "ACCESS_TOKEN_PRIVATE",
//       validRefreshTokenUser.email,
//       validRefreshTokenUser.provider,
//       role
//     );

//     return {
//       valid: true,
//       newAccessToken,
//       email: validRefreshTokenUser.email,
//       Mobile_NO: validRefreshTokenUser.Mobile_No,
//       provider: validRefreshTokenUser.provider,
//       role,
//     };
//   } else {
//     const newAccessToken = signToken(
//       "ACCESS_TOKEN_PRIVATE",
//       validRefreshTokenUser.Mobile_No,
//       validRefreshTokenUser.provider,
//       role
//     );

//     return {
//       valid: true,
//       newAccessToken,
//       email: validRefreshTokenUser.email,
//       Mobile_NO: validRefreshTokenUser.Mobile_No,
//       provider: validRefreshTokenUser.provider,
//       role,
//     };
//   }
// };
