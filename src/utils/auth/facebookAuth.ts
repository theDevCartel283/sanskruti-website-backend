import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { env } from "../../config/env";
import UserModel from "../../model/user.model";
import { Roles } from "../../config/roles.config";
import { getFacebookAuthKeys } from "../../controllers/config/auth.config.controllers";

export const connectPassportFacebook = async () => {
  const { clientId, secret } = await getFacebookAuthKeys();
  const facebookConfig = {
    clientID: clientId || "",
    clientSecret: secret || "",
    callbackURL: `${env.ENDPOINT}/api/v1/auth/facebookRedirect`,
  };
  if (!clientId || !secret) return;
  passport.use(
    new FacebookStrategy(facebookConfig, async function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      const user = await UserModel.findOne({
        facebookId: profile.id,
      });
      if (!user) {
        if (!profile.emails || !profile.emails[0].value) return;

        const newUser = await UserModel.create({
          facebookId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          email_verified: true,
          provider: "facebook",
          role: Roles["USER"],
          password: "0",
          Mobile_No: null,
          Mobile_No_verified: false,
        });
        await newUser.save();

        return done(null, newUser);
      } else {
        return done(null, user);
      }
    })
  );
};

// Serialize user into session
passport.serializeUser<any, any>((user, done: any) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser<any, any>(async (id, done) => {
  try {
    const user = {};
    done(null, user);
  } catch (err) {
    done(err);
  }
});
