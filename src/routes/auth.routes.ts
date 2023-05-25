import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { myProfile, logout } from "../controllers/auth/user";
import * as JWT from "../utils/jwt.utils";
import getRole from "../utils/getRole.util";
import UserModel from "../model/user.model";

const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/facebooklogin",
  passport.authenticate("facebook", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/googleRedirect",
  passport.authenticate("google"),
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const user: any = req.user;
      const userRole: any = user.role;
      const userEmail: any = user.email;
      const provider: any = user.provider;
      const role: any = getRole(userRole);

      if (provider === "Email") {
        res.status(502).json({
          message: `user already exists with ${provider} login`,
          type: "error",
        });
      } else {
        // create JWT
        // Access Token
        const accessToken = JWT.signTokenForEmail(
          "ACCESS_TOKEN_PRIVATE",
          userEmail,
          provider,
          role
        );

        // Refresh Token
        const refreshToken = JWT.signTokenForEmail(
          "REFRESH_TOKEN_PRIVATE",
          userEmail,
          provider,
          role
        );
        // store refresh token in db
        await UserModel.findOneAndUpdate(
          { email: userEmail },
          { refreshToken: refreshToken }
        );
        // create httpOnly cookie
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        console.log(req.headers["authorization"]);
        res.status(200).json({
          message: `successfully logged in as ${userEmail}`,
          type: "success",
          accessToken,
        });
      }
    }
  }
);

router.get(
  "/auth/facebookRedirect",
  passport.authenticate("facebook"),
  (req, res, next) => {
    res.send("logged in");
  }
);

router.get("/me", myProfile);
router.get("/logout", logout);

export default router;
