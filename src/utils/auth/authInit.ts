import { Application } from "express";
import session from "express-session";
import { connectPassportGoogle } from "./googleAuth";
import passport from "passport";
// import { connectPassportFacebook } from "./facebookAuth";

export const authInit = (app: Application) => {
  app.use(
    session({
      secret: "ashjvasdhbsaduyvuyvvsa",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.authenticate("session"));
  app.use(passport.initialize());
  app.use(passport.session());
  connectPassportGoogle();
  // connectPassportFacebook();
};
