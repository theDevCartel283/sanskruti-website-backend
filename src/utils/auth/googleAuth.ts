import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../model/user.model";

export const connectPassportGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "715667966784-sqgodbqvb2v07okrcbb4ihi2j1upsc2m.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:4000/api/v1/auth/googleRedirect",
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
            role: "5c83809e-d05a-11ed-afa1-0242ac120002",
            password: 0,
            Mobile_No: 91,
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
