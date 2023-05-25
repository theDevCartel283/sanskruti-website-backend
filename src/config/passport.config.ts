import passport = require("passport");
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Jwt } from "jsonwebtoken";
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "715667966784-sqgodbqvb2v07okrcbb4ihi2j1upsc2m.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/api/auth/googleRedirect",
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      return done(null, profile);
    }
  )
);
