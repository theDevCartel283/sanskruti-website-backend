import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../model/user.model";
import { env } from "../../config/env";
import { Roles } from "../../config/roles.config";

export const connectPassportGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.ENDPOINT}/api/v1/auth/googleRedirect`,
      },
      async function (accessToken, refreshToken, profile, done) {
        const user = await UserModel.findOne({
          email: profile._json.email,
        });

        if (!user) {
          const newUser = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile._json.email,
            refreshToken: null,
            accessToken: null,
            provider: "google",
            role: Roles["USER"],
            password: "0",
            Mobile_No: null,
          });
          await newUser.save();

          return done(null, newUser);
        } else {
          return done(null, user);
        }
      }
    )
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
