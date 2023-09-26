import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../model/user.model";
import { env } from "../../config/env";
import { Roles } from "../../config/roles.config";
import { getGoogleAuthKeys } from "../../controllers/config/auth.config.controllers";

export const connectPassportGoogle = async () => {
  const { clientId, secret } = await getGoogleAuthKeys();
  const googleConfig = {
    clientID: clientId || "",
    clientSecret: secret || "",
    callbackURL: `${env.ENDPOINT}/api/v1/auth/googleRedirect`,
  };
  passport.use(
    new GoogleStrategy(googleConfig, async function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      const user = await UserModel.findOne({
        email: profile._json.email,
      });

      if (!user) {
        const newUser = await UserModel.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile._json.email,
          email_verified: true,
          provider: "google",
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
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
