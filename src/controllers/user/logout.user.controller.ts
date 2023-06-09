import { Response } from "express";
import { VerifyRequest } from "../../middleware/verifyJwt";
import UserModel from "../../model/user.model";
import { TokenPayload } from "../../utils/jwt.utils";

export const handleLogout = async (
  req: VerifyRequest<null, TokenPayload, null>,
  res: Response
) => {

  const { userUniqueIdentity } = req.body;

  // username doesn't exist in jwt token
  if (!userUniqueIdentity)
    return res
      .status(200)
      .json({ message: "logged out", type: "success", isAuthenticated: false });

  // clear cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.clearCookie("connect.sid", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: `user was successfully logged out`,
    type: "success",
    isAuthenticated: false,
  });

};
