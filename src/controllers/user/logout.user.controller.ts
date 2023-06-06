import { Response } from "express";
import { VerifyRequest } from "../../middleware/verifyJwt";
import UserModel from "../../model/user.model";
import { TokenPayload } from "../../utils/jwt.utils";

export const handleLogout = async (
  req: VerifyRequest<null, TokenPayload, null>,
  res: Response
) => {
  const { userUniqueIdentity, provider } = req.body;

  // username doesn't exist in jwt token
  if (!userUniqueIdentity)
    return res
      .status(200)
      .json({ message: "logged out", type: "success", isAuthenticated: false });

  if (provider === "Email/Number") {
    // clear cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `user was successfully logged out`,
      type: "success",
      isAuthenticated: false,
    });
  } else if (provider === "google") {
    const user = await UserModel.findOneAndUpdate(
      { email: userUniqueIdentity },
      { refreshToken: "null", accessToken: null }
    );

    // username doesn't exist in db
    if (!user) {
      return res.status(200).json({
        message: "logged out",
        type: "success",
        isAuthenticated: false,
      });
    } else {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({
            err,
          });
        } else {
          res.clearCookie("connect.sid");
          res.clearCookie("jwt");
          res.status(200).json({
            message: "logged out Google oauth 2.0 successfully",
            type: "success",
            isAuthenticated: false,
          });
        }
      });
    }
  } else {
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
  }
};
