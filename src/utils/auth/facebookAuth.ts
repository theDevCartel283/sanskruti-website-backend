import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
// import newUserModel from "../model/newUser.model";
import * as Jwt from "jsonwebtoken";

export const connectPassport = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: "188658517367833",
        clientSecret: "66012adc535b96fac584509d6a371989",
        callbackURL: "http://localhost:3000/api/v1/auth/facebookRedirect",
      },
      async function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        return done(null, profile);
        // const user = await newUserModel.findOne({
        //   googleId: profile.id,
        // });
        // if (!user) {
        //   const newUser = await newUserModel.create({
        //     googleId: profile.id,
        //     name: profile.displayName,
        //     email: " ",
        //     refreshToken: null,
        //   });
        //   await newUser.save();
        //   return done(null, newUser);
        // } else {
        //   return done(null, user);
        // }
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
    const user = {};
    done(null, user);
  } catch (err) {
    done(err);
  }
});
