import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import * as JWT from "../utils/jwt.utils";
import getRole from "../utils/getRole.util";

const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "/auth/googleRedirect",
    failureRedirect: "/auth/login",
  })
);

router.get(
  "/facebooklogin",
  passport.authenticate("facebook", {
    scope: ["profile", "email"],
    successRedirect: "/auth/facebookRedirect",
    failureRedirect: "/auth/login",
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

      // create httpOnly cookie
      const accessToken = JWT.signTokenForEmail(
        "ACCESS_TOKEN_PRIVATE",
        userEmail,
        provider,
        role
      );

      // create httpOnly cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.redirect(
        302,
        `${req.protocol}://${
          req.hostname === "localhost" ? "localhost:3000" : req.hostname
        }/`
      );
    } else {
      res.redirect("/auth/login");
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

export default router;
